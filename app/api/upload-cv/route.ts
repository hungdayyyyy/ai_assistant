import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { z } from "zod"

export const maxDuration = 60 // Allow longer processing time for PDF analysis

// Schema for extracted CV information
const cvAnalysisSchema = z.object({
  personalInfo: z.object({
    fullName: z.string().optional(),
    email: z.string().email().optional(),
    phone: z.string().optional(),
    location: z.string().optional(),
    linkedIn: z.string().optional(),
    website: z.string().optional(),
  }),
  professionalSummary: z.string().optional(),
  workExperience: z
    .array(
      z.object({
        jobTitle: z.string(),
        company: z.string(),
        duration: z.string(),
        description: z.string(),
      }),
    )
    .optional(),
  education: z
    .array(
      z.object({
        degree: z.string(),
        institution: z.string(),
        year: z.string().optional(),
      }),
    )
    .optional(),
  skills: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  analysis: z.object({
    overallScore: z.number().min(0).max(100),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    recommendations: z.array(z.string()),
    atsCompatibility: z.number().min(0).max(100),
    missingElements: z.array(z.string()),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file type
    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Only PDF files are supported" }, { status: 400 })
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 })
    }

    console.log("[v0] Processing CV upload for user:", user.id)

    // Convert file to base64 for AI processing
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString("base64")

    const { object: analysisResult } = await generateObject({
      model: google("gemini-2.0-flash-exp"), // Using latest Gemini model for better PDF processing
      schema: cvAnalysisSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please analyze this CV/Resume PDF and extract all relevant information. Provide a comprehensive analysis including:

1. Personal information (name, contact details)
2. Professional summary
3. Work experience with details
4. Education background
5. Skills and certifications
6. A detailed analysis with:
   - Overall score (0-100)
   - Key strengths
   - Areas for improvement
   - Specific recommendations
   - ATS compatibility score
   - Missing elements that should be added

Be thorough and provide actionable feedback for CV improvement.`,
            },
            {
              type: "file",
              data: base64,
              mediaType: "application/pdf",
              filename: file.name,
            },
          ],
        },
      ],
    })

    console.log("[v0] CV analysis completed for user:", user.id)

    // Save the analysis to database
    const { data: uploadRecord, error: dbError } = await supabase
      .from("cv_uploads")
      .insert({
        user_id: user.id,
        file_name: file.name,
        file_url: "", // We're not storing the file, just the analysis
        analysis_result: analysisResult.analysis,
        extracted_info: {
          personalInfo: analysisResult.personalInfo,
          professionalSummary: analysisResult.professionalSummary,
          workExperience: analysisResult.workExperience,
          education: analysisResult.education,
          skills: analysisResult.skills,
          certifications: analysisResult.certifications,
          languages: analysisResult.languages,
        },
      })
      .select()
      .single()

    if (dbError) {
      console.error("[v0] Database error:", dbError)
      return NextResponse.json({ error: "Failed to save analysis" }, { status: 500 })
    }

    // Update user profile with extracted contact info if available
    if (analysisResult.personalInfo.email || analysisResult.personalInfo.phone) {
      await supabase
        .from("profiles")
        .update({
          email: analysisResult.personalInfo.email || undefined,
          phone: analysisResult.personalInfo.phone || undefined,
          full_name: analysisResult.personalInfo.fullName || undefined,
        })
        .eq("id", user.id)
    }

    return NextResponse.json({
      success: true,
      uploadId: uploadRecord.id,
      analysis: analysisResult,
    })
  } catch (error) {
    console.error("[v0] CV upload error:", error)
    return NextResponse.json({ error: "Failed to process CV. Please try again." }, { status: 500 })
  }
}
