import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { google } from "@ai-sdk/google";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 30;

const GENERAL_SYSTEM_PROMPT = `You are a helpful, friendly, and knowledgeable AI assistant. You can help with a wide variety of topics including:

1. **General questions** - Answer questions on various subjects
2. **Problem solving** - Help users think through challenges
3. **Learning and education** - Explain concepts and provide guidance
4. **Creative tasks** - Brainstorming, writing, and creative projects
5. **Technology** - Programming, software, and tech-related questions
6. **Daily life** - Practical advice and recommendations

**Your communication style:**
- Friendly, conversational, and approachable
- Clear and easy to understand
- Helpful and supportive
- Provide detailed explanations when needed
- Ask follow-up questions to better understand user needs
- Be encouraging and positive

**Guidelines:**
- Be honest if you don't know something
- Provide accurate and up-to-date information
- Offer multiple perspectives when appropriate
- Be respectful and inclusive
- Help users learn and grow

Feel free to chat about anything! I'm here to help and have a great conversation.`;

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

    // Add system prompt as the first message
    const messagesWithSystem = [
      { role: "system" as const, content: GENERAL_SYSTEM_PROMPT },
      ...modelMessages,
    ];

    const result = streamText({
      model: google("gemini-2.0-flash-exp"), // Using latest Gemini model
      messages: messagesWithSystem,
      maxOutputTokens: 2000,
      temperature: 0.8, // Slightly higher temperature for more creative responses
      abortSignal: req.signal,
    });

    let conversationId: string | null = null;

    if (user && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === "user") {
        console.log(
          "[v0] Saving general chat message for user:",
          user.id,
          lastMessage
        );

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
          return "New general conversation";
        })();

        // Create or get conversation for general chat
        const { data: conversation, error: convError } = await supabase
          .from("conversations")
          .insert({
            user_id: user.id,
            title: `General: ${messageContent.slice(0, 40)}${
              messageContent.length > 40 ? "..." : ""
            }`,
          })
          .select()
          .single();

        if (convError) {
          console.error("[v0] Error creating general conversation:", convError);
        } else {
          conversationId = conversation.id;
          console.log("[v0] Created general conversation:", conversationId);
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
            console.error(
              "[v0] Error saving general chat user message:",
              msgError
            );
          } else {
            console.log("[v0] Saved general chat message for user:", user.id);
          }
        }
      }
    }

    return result.toUIMessageStreamResponse({
      onFinish: async ({ isAborted, text }: any) => {
        if (isAborted) {
          console.log("[v0] General chat request aborted");
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
            console.error(
              "[v0] Error saving general chat AI response:",
              aiMsgError
            );
          } else {
            console.log(
              "[v0] Saved general chat AI response for user:",
              user.id
            );
          }
        }
      },
    });
  } catch (error) {
    console.error("[v0] General chat API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
