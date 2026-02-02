import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
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
import { ArrowLeft, Mail, Lock, User, GraduationCap, Building, Home } from "lucide-react";

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

export default function Auth() {
  const [searchParams] = useSearchParams();
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.endsWith("@dtu.ac.in")) {
      setStep(2);
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      setStep(3);
    } else {
      // Login success - redirect
      console.log("Login successful");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
        
        <div className="relative z-10 flex flex-col justify-center p-12 xl:p-16">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20">
              <span className="text-2xl font-bold text-white">D</span>
            </div>
            <div>
              <span className="text-xl font-bold text-white">DTU</span>
              <span className="text-xl font-bold text-white/80"> Multimart</span>
            </div>
          </Link>

          <h1 className="text-4xl xl:text-5xl font-bold text-white mb-6">
            {isSignup ? "Join the DTU Community" : "Welcome Back!"}
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            {isSignup 
              ? "Create your account and start trading with fellow DTU students today."
              : "Sign in to access your marketplace, services, and more."}
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-white/90">2,500+ verified students</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="text-white/90">DTU email verification</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Lock className="h-5 w-5 text-white" />
              </div>
              <div className="text-white/90">Secure & private</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>

          {/* Mobile Logo */}
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
                <span className="text-xl font-bold text-primary-foreground">D</span>
              </div>
              <div>
                <span className="text-lg font-bold text-foreground">DTU</span>
                <span className="text-lg font-bold text-primary"> Multimart</span>
              </div>
            </Link>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {isSignup 
                ? step === 3 
                  ? "Complete Your Profile" 
                  : "Create Account"
                : "Sign In"}
            </h2>
            <p className="text-muted-foreground">
              {step === 1 && "Enter your DTU email to get started"}
              {step === 2 && "We've sent a verification code to your email"}
              {step === 3 && "Tell us a bit about yourself"}
            </p>
          </div>

          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">DTU Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="yourname@dtu.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
                {email && !email.endsWith("@dtu.ac.in") && (
                  <p className="text-sm text-destructive">Please use your @dtu.ac.in email</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={!email.endsWith("@dtu.ac.in")}
              >
                {isSignup ? "Continue" : "Send OTP"}
              </Button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  id="otp"
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  className="text-center text-2xl tracking-widest"
                  required
                />
                <p className="text-sm text-muted-foreground text-center">
                  Didn't receive the code?{" "}
                  <button type="button" className="text-primary hover:underline">
                    Resend
                  </button>
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg">
                {isSignup ? "Verify & Continue" : "Sign In"}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setStep(1)}
              >
                Change email
              </Button>
            </form>
          )}

          {/* Step 3: Profile (Signup only) */}
          {step === 3 && isSignup && (
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input id="name" placeholder="John Doe" className="pl-10" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollno">Roll Number</Label>
                  <Input id="rollno" placeholder="2K21/XX/123" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select>
                  <SelectTrigger>
                    <GraduationCap className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Select your branch" />
                  </SelectTrigger>
                  <SelectContent>
                    {branches.map((branch) => (
                      <SelectItem key={branch} value={branch.toLowerCase()}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select>
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
                  <Select>
                    <SelectTrigger>
                      <Home className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {hostels.map((hostel) => (
                        <SelectItem key={hostel} value={hostel.toLowerCase()}>
                          {hostel}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Create Account
              </Button>
            </form>
          )}

          {/* Toggle Login/Signup */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            {isSignup ? (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={() => {
                    setIsSignup(false);
                    setStep(1);
                  }}
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={() => {
                    setIsSignup(true);
                    setStep(1);
                  }}
                >
                  Sign up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
