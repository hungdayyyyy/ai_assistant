"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CVAnalysis {
  personalInfo: {
    fullName?: string
    email?: string
    phone?: string
    location?: string
    linkedIn?: string
    website?: string
  }
  analysis: {
    overallScore: number
    strengths: string[]
    weaknesses: string[]
    recommendations: string[]
    atsCompatibility: number
    missingElements: string[]
  }
}

interface CVUploadDialogProps {
  children: React.ReactNode
  onUploadComplete?: (analysis: CVAnalysis) => void
}

export function CVUploadDialog({ children, onUploadComplete }: CVUploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [analysis, setAnalysis] = useState<CVAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file
    if (file.type !== "application/pdf") {
      setError("Please select a PDF file")
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB")
      return
    }

    setError(null)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 500)

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Upload failed")
      }

      const result = await response.json()
      setAnalysis(result.analysis)
      onUploadComplete?.(result.analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  const handleReset = () => {
    setAnalysis(null)
    setError(null)
    setUploadProgress(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setTimeout(handleReset, 300) // Reset after dialog closes
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload & Analyze CV
          </DialogTitle>
          <DialogDescription>
            Upload your CV in PDF format to get AI-powered analysis and optimization recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {!analysis && !isUploading && (
            <>
              {/* Upload Area */}
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  error ? "border-destructive bg-destructive/5" : "border-border hover:border-primary/50 bg-muted/20",
                )}
              >
                <input ref={fileInputRef} type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" />
                <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Choose your CV file</h3>
                <p className="text-sm text-muted-foreground mb-4">Upload a PDF file (max 10MB) for analysis</p>
                <Button onClick={() => fileInputRef.current?.click()}>Select PDF File</Button>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-4">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Upload className="h-8 w-8 text-primary animate-pulse" />
                </div>
                <h3 className="text-lg font-medium mb-2">Analyzing your CV...</h3>
                <p className="text-sm text-muted-foreground">
                  Our AI is processing your resume and generating insights
                </p>
              </div>
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-center text-muted-foreground">
                {uploadProgress < 50
                  ? "Uploading file..."
                  : uploadProgress < 90
                    ? "Analyzing content..."
                    : "Generating recommendations..."}
              </p>
            </div>
          )}

          {/* Analysis Results */}
          {analysis && (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Analysis Complete!</span>
              </div>

              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Overall CV Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4">
                    <div className="text-3xl font-bold text-primary">{analysis.analysis.overallScore}/100</div>
                    <div className="flex-1">
                      <Progress value={analysis.analysis.overallScore} className="h-2" />
                      <p className="text-sm text-muted-foreground mt-1">
                        ATS Compatibility: {analysis.analysis.atsCompatibility}/100
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Strengths */}
              {analysis.analysis.strengths.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-green-600">Strengths</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.analysis.strengths.map((strength, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Recommendations */}
              {analysis.analysis.recommendations.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-600">Recommendations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <div className="h-4 w-4 rounded-full bg-blue-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button onClick={handleReset} variant="outline" className="flex-1 bg-transparent">
                  Upload Another CV
                </Button>
                <Button onClick={handleClose} className="flex-1">
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
