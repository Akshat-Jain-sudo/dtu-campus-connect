import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, GraduationCap, Building, Calendar, MapPin, Shield, Loader2 } from "lucide-react";

const BRANCHES = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Production & Industrial",
  "Environmental Engineering",
  "Biotechnology",
  "Engineering Physics",
  "Software Engineering",
];

const HOSTELS = [
  "BR Ambedkar Hostel",
  "CVR Hostel",
  "Vivekananda Hostel",
  "Tagore Hostel",
  "Aryabhatta Hostel",
  "APJ Kalam Hostel",
  "Girls Hostel 1",
  "Girls Hostel 2",
  "Day Scholar",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const Profile = () => {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    roll_number: profile?.roll_number || "",
    branch: profile?.branch || "",
    year: profile?.year || "",
    hostel: profile?.hostel || "",
    bio: profile?.bio || "",
    phone: profile?.phone || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    const { error } = await updateProfile(formData);
    setIsSaving(false);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
      setIsEditing(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Profile Header Card */}
          <Card className="overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-primary/20 to-primary/5" />
            <CardContent className="relative pt-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 -mt-16">
                <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                    {getInitials(profile?.full_name || profile?.email || "U")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 text-center sm:text-left pb-4">
                  <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                    <h1 className="text-2xl font-bold">{profile?.full_name || "DTU Student"}</h1>
                    {profile?.seller_verified && (
                      <Badge variant="secondary" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Verified Seller
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{profile?.email}</p>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="sm:mb-4"
                >
                  {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Profile Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                {isEditing
                  ? "Update your profile details below"
                  : "Your personal and academic information"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </Label>
                {isEditing ? (
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <p className="text-foreground py-2">{profile?.full_name || "Not set"}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email
                </Label>
                <p className="text-foreground py-2">{profile?.email}</p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Phone Number
                </Label>
                {isEditing ? (
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <p className="text-foreground py-2">{profile?.phone || "Not set"}</p>
                )}
              </div>

              {/* Roll Number */}
              <div className="space-y-2">
                <Label htmlFor="roll_number" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Roll Number
                </Label>
                {isEditing ? (
                  <Input
                    id="roll_number"
                    value={formData.roll_number}
                    onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
                    placeholder="e.g., 2K21/CO/123"
                  />
                ) : (
                  <p className="text-foreground py-2">{profile?.roll_number || "Not set"}</p>
                )}
              </div>

              {/* Branch */}
              <div className="space-y-2">
                <Label htmlFor="branch" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Branch
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.branch}
                    onValueChange={(value) => setFormData({ ...formData, branch: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your branch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BRANCHES.map((branch) => (
                        <SelectItem key={branch} value={branch}>
                          {branch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-foreground py-2">{profile?.branch || "Not set"}</p>
                )}
              </div>

              {/* Year */}
              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Year
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.year}
                    onValueChange={(value) => setFormData({ ...formData, year: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your year" />
                    </SelectTrigger>
                    <SelectContent>
                      {YEARS.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-foreground py-2">{profile?.year || "Not set"}</p>
                )}
              </div>

              {/* Hostel */}
              <div className="space-y-2">
                <Label htmlFor="hostel" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Hostel / Day Scholar
                </Label>
                {isEditing ? (
                  <Select
                    value={formData.hostel}
                    onValueChange={(value) => setFormData({ ...formData, hostel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your hostel" />
                    </SelectTrigger>
                    <SelectContent>
                      {HOSTELS.map((hostel) => (
                        <SelectItem key={hostel} value={hostel}>
                          {hostel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <p className="text-foreground py-2">{profile?.hostel || "Not set"}</p>
                )}
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                {isEditing ? (
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell others about yourself..."
                    rows={4}
                  />
                ) : (
                  <p className="text-foreground py-2">{profile?.bio || "No bio added yet"}</p>
                )}
              </div>

              {/* Save Button */}
              {isEditing && (
                <Button onClick={handleSave} disabled={isSaving} className="w-full">
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Changes
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Profile;
