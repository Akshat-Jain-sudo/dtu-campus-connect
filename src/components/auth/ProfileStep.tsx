import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, GraduationCap, Home, Loader2 } from "lucide-react";

const branches = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Communication",
  "Electrical Engineering",
  "Mechanical Engineering",
  "Civil Engineering",
  "Production & Industrial",
  "Environmental Engineering",
  "Biotechnology",
  "Software Engineering",
  "Mathematics & Computing",
  "Engineering Physics",
];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"];

const hostels = [
  "BH-1", "BH-2", "BH-3", "BH-4", "BR Hostel",
  "GH-1", "GH-2",
  "Day Scholar"
];

interface ProfileData {
  full_name: string;
  roll_number: string;
  branch: string;
  year: string;
  hostel: string;
}

interface ProfileStepProps {
  onSubmit: (data: ProfileData) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function ProfileStep({ onSubmit, isLoading, error }: ProfileStepProps) {
  const [formData, setFormData] = useState<ProfileData>({
    full_name: "",
    roll_number: "",
    branch: "",
    year: "",
    hostel: "",
  });

  const isFormValid = Object.values(formData).every((value) => value.trim() !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid) {
      await onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="pl-10"
              required
              disabled={isLoading}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="rollno">Roll Number</Label>
          <Input
            id="rollno"
            placeholder="2K21/XX/123"
            value={formData.roll_number}
            onChange={(e) => setFormData({ ...formData, roll_number: e.target.value })}
            required
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="branch">Branch</Label>
        <Select
          value={formData.branch}
          onValueChange={(value) => setFormData({ ...formData, branch: value })}
          disabled={isLoading}
        >
          <SelectTrigger>
            <GraduationCap className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Select your branch" />
          </SelectTrigger>
          <SelectContent>
            {branches.map((branch) => (
              <SelectItem key={branch} value={branch}>
                {branch}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Select
            value={formData.year}
            onValueChange={(value) => setFormData({ ...formData, year: value })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select year" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="hostel">Hostel</Label>
          <Select
            value={formData.hostel}
            onValueChange={(value) => setFormData({ ...formData, hostel: value })}
            disabled={isLoading}
          >
            <SelectTrigger>
              <Home className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {hostels.map((hostel) => (
                <SelectItem key={hostel} value={hostel}>
                  {hostel}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving profile...
          </>
        ) : (
          "Complete Profile"
        )}
      </Button>
    </form>
  );
}
