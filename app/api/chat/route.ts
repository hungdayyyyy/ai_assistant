import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const CV_SYSTEM_PROMPT = `You are an expert CV/Resume optimization assistant with deep knowledge of:

1. **ATS (Applicant Tracking System) optimization** - Help make resumes ATS-friendly
2. **Industry-specific requirements** - Tailor advice for different sectors
3. **Modern hiring practices** - Current trends in recruitment
4. **Professional formatting** - Best practices for layout and structure
5. **Content optimization** - Improve impact and clarity of descriptions

**Your role:**
- Analyze uploaded CVs and provide detailed, actionable feedback
- Suggest improvements for content, structure, and formatting
- Help optimize keywords for specific job applications
- Provide career guidance and interview preparation tips
- Extract and organize key information (contact details, skills, experience)
- Recommend industry-specific improvements

**Communication style:**
- Professional yet friendly and encouraging
- Provide specific, actionable advice
- Use bullet points for clarity when listing improvements
- Ask clarifying questions to provide personalized recommendations
- Be supportive while being honest about areas needing improvement

**Key areas to focus on:**
- Contact information completeness and professionalism
- Professional summary/objective effectiveness
- Work experience impact and quantification
- Skills relevance and organization
- Education and certifications presentation
- Overall formatting and readability
- ATS compatibility

Always aim to help users create compelling, professional CVs that stand out to both ATS systems and human recruiters.`;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Get user from Supabase (optional - for saving conversation history)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Convert UI messages to model messages and add system prompt
    const modelMessages = convertToModelMessages(messages);

    // Add system prompt as the first message if it's not already there
    const messagesWithSystem = [
      { role: "system" as const, content: CV_SYSTEM_PROMPT },
      ...modelMessages,
    ];

    const result = streamText({
      model: google("gemini-2.0-flash-exp"), // Using latest Gemini model
      messages: messagesWithSystem,
      maxOutputTokens: 2000,
      temperature: 0.7,
      abortSignal: req.signal,
    });

    let conversationId: string | null = null;

    if (user && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        console.log("[v0] Saving user message for user:", user.id, lastMessage);

        const messageContent = (() => {
          const message = lastMessage as any;
          // Check if message has parts array (new structure)
          if (message.parts && Array.isArray(message.parts)) {
            return message.parts
              .filter((part: any) => part.type === "text")
              .map((part: any) => part.text)
              .join(" ");
          }
          // Fallback to content property (old structure)
          else if (message.content) {
            if (typeof message.content === "string") {
              return message.content;
            } else if (Array.isArray(message.content)) {
              return message.content
                .map((part: any) =>
                  typeof part === "string" ? part : part.text || ""
                )
                .join(" ");
            }
          }
          return "New conversation";
        })();

        // Create or get conversation
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            title:
              messageContent.slice(0, 50) +
              (messageContent.length > 50 ? "..." : ""),
          })
          .select()
          .single();

        if (convError) {
          console.error("[v0] Error creating conversation:", convError);
        } else {
          conversationId = conversation.id;
          console.log("[v0] Created conversation:", conversationId);
        }

        // Save user message
        if (conversationId) {
          const { error: msgError } = await supabase.from("messages").insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: "user",
            content: messageContent,
          });

          if (msgError) {
            console.error("[v0] Error saving user message:", msgError);
          } else {
            console.log("[v0] Saved user message for user:", user.id);
          }
        }
      }
    }

    return result.toUIMessageStreamResponse({
      onFinish: async ({ isAborted, text }: any) => {
        if (isAborted) {
          console.log("[v0] Chat request aborted");
          return;
        }

        if (user && text && conversationId) {
          const { error: aiMsgError } = await supabase.from("messages").insert({
            conversation_id: conversationId,
            user_id: user.id,
            role: "assistant",
            content: text,
          });

          if (aiMsgError) {
            console.error("[v0] Error saving AI response:", aiMsgError);
          } else {
            console.log("[v0] Saved AI response for user:", user.id);
          }
        }
      },
    });
  } catch (error) {
    console.error("[v0] Chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
