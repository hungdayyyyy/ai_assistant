import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Chatbox } from "@/components/chatbox/chatbox"
import { CVUploadDialog } from "@/components/cv-upload/cv-upload-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, FileText, MessageSquare, Upload, BarChart3, Calendar, TrendingUp, Clock } from "lucide-react"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Fetch user's CV uploads
  const { data: cvUploads } = await supabase
    .from("cv_uploads")
    .select("*")
    .eq("user_id", data.user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  // Calculate stats
  const totalUploads = cvUploads?.length || 0
  const averageScore = cvUploads?.length
    ? Math.round(
        cvUploads.reduce((sum, upload) => sum + (upload.analysis_result?.overallScore || 0), 0) / cvUploads.length,
      )
    : 0
  const latestUpload = cvUploads?.[0]

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
              <Link href="/protected">
                <Button variant="ghost" size="sm">
                  Home
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
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">
              Track your CV optimization progress and manage your career documents
            </p>
          </div>

          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total CVs Analyzed</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUploads}</div>
                <p className="text-xs text-muted-foreground">
                  {totalUploads > 0 ? "Keep optimizing!" : "Upload your first CV"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{averageScore}/100</div>
                <p className="text-xs text-muted-foreground">
                  {averageScore >= 80 ? "Excellent!" : averageScore >= 60 ? "Good progress" : "Room for improvement"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Latest Score</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latestUpload?.analysis_result?.overallScore || 0}/100</div>
                <p className="text-xs text-muted-foreground">
                  {latestUpload ? "From latest upload" : "No uploads yet"}
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/40 bg-card/50 backdrop-blur">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Member Since</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {new Date(data.user.created_at).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
                <p className="text-xs text-muted-foreground">Account created</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Dashboard Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="uploads">CV History</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Quick Actions */}
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Get started with CV optimization</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CVUploadDialog>
                      <Button className="w-full justify-start">
                        <Upload className="mr-2 h-4 w-4" />
                        Upload New CV
                      </Button>
                    </CVUploadDialog>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Chat with AI Assistant
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <BarChart3 className="mr-2 h-4 w-4" />
                      View Analysis Reports
                    </Button>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest CV optimization activities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {cvUploads && cvUploads.length > 0 ? (
                      <div className="space-y-4">
                        {cvUploads.slice(0, 3).map((upload) => (
                          <div
                            key={upload.id}
                            className="flex items-center gap-3 rounded-lg border border-border/40 p-3"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <FileText className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{upload.file_name}</p>
                              <p className="text-xs text-muted-foreground">
                                Score: {upload.analysis_result?.overallScore || 0}/100
                              </p>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(upload.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <Clock className="mx-auto h-8 w-8 text-muted-foreground/50" />
                        <p className="mt-2 text-sm text-muted-foreground">No recent activity</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* CV History Tab */}
            <TabsContent value="uploads" className="space-y-6">
              <Card className="border-border/40 bg-card/50 backdrop-blur">
                <CardHeader>
                  <CardTitle>CV Upload History</CardTitle>
                  <CardDescription>All your uploaded CVs and their analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  {cvUploads && cvUploads.length > 0 ? (
                    <div className="space-y-4">
                      {cvUploads.map((upload) => (
                        <div key={upload.id} className="rounded-lg border border-border/40 p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{upload.file_name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Uploaded on{" "}
                                {new Date(upload.created_at).toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                })}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                variant={
                                  (upload.analysis_result?.overallScore || 0) >= 80
                                    ? "default"
                                    : (upload.analysis_result?.overallScore || 0) >= 60
                                      ? "secondary"
                                      : "destructive"
                                }
                              >
                                {upload.analysis_result?.overallScore || 0}/100
                              </Badge>
                            </div>
                          </div>

                          {upload.analysis_result && (
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              <div>
                                <h4 className="text-sm font-medium text-green-600 mb-2">Strengths</h4>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {upload.analysis_result.strengths
                                    ?.slice(0, 2)
                                    .map((strength: string, index: number) => (
                                      <li key={index}>• {strength}</li>
                                    ))}
                                </ul>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-blue-600 mb-2">Top Recommendations</h4>
                                <ul className="text-xs text-muted-foreground space-y-1">
                                  {upload.analysis_result.recommendations
                                    ?.slice(0, 2)
                                    .map((rec: string, index: number) => (
                                      <li key={index}>• {rec}</li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <h3 className="mt-4 text-lg font-medium">No CVs uploaded yet</h3>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload your first CV to get started with AI-powered optimization
                      </p>
                      <CVUploadDialog>
                        <Button className="mt-4">
                          <Upload className="mr-2 h-4 w-4" />
                          Upload Your First CV
                        </Button>
                      </CVUploadDialog>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Your account details and preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{data.user.email}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Full Name</label>
                      <p className="text-sm text-muted-foreground">{profile?.full_name || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <p className="text-sm text-muted-foreground">{profile?.phone || "Not provided"}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Member Since</label>
                      <p className="text-sm text-muted-foreground">
                        {new Date(data.user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/40 bg-card/50 backdrop-blur">
                  <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                    <CardDescription>Your usage and progress overview</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">CVs Analyzed</span>
                      <Badge variant="secondary">{totalUploads}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Average Score</span>
                      <Badge
                        variant={averageScore >= 80 ? "default" : averageScore >= 60 ? "secondary" : "destructive"}
                      >
                        {averageScore}/100
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Account Status</span>
                      <Badge variant="default">Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Plan</span>
                      <Badge variant="outline">Free</Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Chatbox Component */}
      <Chatbox />
    </div>
  )
}
