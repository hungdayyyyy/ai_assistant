import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Chatbox } from "@/components/chatbox/chatbox"
import { CVUploadDialog } from "@/components/cv-upload/cv-upload-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, MessageSquare, Upload, BarChart3, Users, Zap } from "lucide-react"
import Link from "next/link"

export default async function ProtectedPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">AI CV Editor</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  Dashboard
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">Welcome, {data.user.email}</span>
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" type="submit">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Welcome Section */}
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Welcome to Your CV Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Upload your CV, chat with our AI assistant, and get personalized optimization recommendations
            </p>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* Upload CV Card */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Upload className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">Upload Your CV</CardTitle>
                <CardDescription>
                  Upload your resume for AI-powered analysis and optimization suggestions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CVUploadDialog>
                  <Button className="w-full">
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </Button>
                </CVUploadDialog>
              </CardContent>
            </Card>

            {/* Chat Assistant Card */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <MessageSquare className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">AI Chat Assistant</CardTitle>
                <CardDescription>Get instant feedback and personalized CV improvement recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Start Chatting
                </Button>
              </CardContent>
            </Card>

            {/* Dashboard Card */}
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                  <BarChart3 className="h-6 w-6 text-chart-3" />
                </div>
                <CardTitle className="text-xl">Full Dashboard</CardTitle>
                <CardDescription>View detailed analysis results and track your optimization progress</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full bg-transparent">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Features Overview */}
          <div className="mt-16">
            <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground text-center">
              Everything You Need for CV Success
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                    <Zap className="h-6 w-6 text-chart-4" />
                  </div>
                  <CardTitle className="text-xl">AI-Powered Analysis</CardTitle>
                  <CardDescription>
                    Get instant, comprehensive feedback on your CV with detailed scoring and recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-4" />
                      ATS compatibility scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-4" />
                      Content optimization suggestions
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-4" />
                      Industry-specific recommendations
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-5/10">
                    <Users className="h-6 w-6 text-chart-5" />
                  </div>
                  <CardTitle className="text-xl">Personal Dashboard</CardTitle>
                  <CardDescription>
                    Track your progress, manage multiple CV versions, and view your optimization history
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-5" />
                      Progress tracking and analytics
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-5" />
                      CV version management
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-chart-5" />
                      Chat conversation history
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbox Component */}
      <Chatbox />
    </div>
  )
}
