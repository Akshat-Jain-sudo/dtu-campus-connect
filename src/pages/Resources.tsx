import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Download, Search, Filter, Star, Upload } from "lucide-react";
import type { Resource } from "@/types/database";

const BRANCHES = [
  "All Branches",
  "Computer Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
];

const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState("All Branches");
  const [selectedSemester, setSelectedSemester] = useState<string>("");

  const { data: resources, isLoading } = useQuery({
    queryKey: ["resources", searchQuery, selectedBranch, selectedSemester],
    queryFn: async () => {
      let query = supabase
        .from("resources")
        .select("*")
        .eq("status", "approved");

      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`);
      }

      if (selectedBranch && selectedBranch !== "All Branches") {
        query = query.eq("branch", selectedBranch);
      }

      if (selectedSemester) {
        query = query.eq("semester", parseInt(selectedSemester));
      }

      const { data, error } = await query.order("downloads_count", { ascending: false });
      if (error) throw error;
      return data as Resource[];
    },
  });

  const getFileIcon = (fileType: string | null) => {
    if (!fileType) return FileText;
    if (fileType.includes("pdf")) return FileText;
    return FileText;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Notes & Study Resources</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access class notes, previous year questions, and study materials shared by DTU students
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by subject or title..."
              className="pl-10"
            />
          </div>
          <Select value={selectedBranch} onValueChange={setSelectedBranch}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Branch" />
            </SelectTrigger>
            <SelectContent>
              {BRANCHES.map((branch) => (
                <SelectItem key={branch} value={branch}>
                  {branch}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedSemester} onValueChange={setSelectedSemester}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Semester" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Semesters</SelectItem>
              {SEMESTERS.map((sem) => (
                <SelectItem key={sem} value={sem.toString()}>
                  Semester {sem}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>

        {/* Resources Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        ) : resources && resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => {
              const FileIcon = getFileIcon(resource.file_type);
              return (
                <Card key={resource.id} className="hover-lift">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg line-clamp-2">
                          {resource.title}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          {resource.subject}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {resource.branch && (
                        <Badge variant="outline">{resource.branch}</Badge>
                      )}
                      {resource.semester && (
                        <Badge variant="secondary">Sem {resource.semester}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Download className="h-4 w-4" />
                          {resource.downloads_count}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          4.5
                        </span>
                      </div>
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p className="text-muted-foreground mb-6">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Be the first to upload study materials!"}
            </p>
            <Button>
              <Upload className="mr-2 h-4 w-4" />
              Upload Resources
            </Button>
          </div>
        )}

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">500+</div>
            <p className="text-sm text-muted-foreground">Notes Uploaded</p>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">10K+</div>
            <p className="text-sm text-muted-foreground">Downloads</p>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">50+</div>
            <p className="text-sm text-muted-foreground">Subjects Covered</p>
          </Card>
          <Card className="text-center p-6">
            <div className="text-3xl font-bold text-primary mb-2">200+</div>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Resources;
