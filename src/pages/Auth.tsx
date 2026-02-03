import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Lock, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { EmailStep } from "@/components/auth/EmailStep";
import { ProfileStep } from "@/components/auth/ProfileStep";
import { CheckCircle } from "lucide-react";

export default function Auth() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isProfileComplete, signUp, signIn, updateProfile } = useAuth();
  
  const [isSignup, setIsSignup] = useState(searchParams.get("mode") === "signup");
  const [step, setStep] = useState<"auth" | "verify" | "profile">("auth");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signupEmail, setSignupEmail] = useState<string | null>(null);

  // Handle complete-profile mode
  useEffect(() => {
    if (searchParams.get("mode") === "complete-profile" && user && !isProfileComplete) {
      setStep("profile");
    }
  }, [searchParams, user, isProfileComplete]);

  // Redirect if already logged in with complete profile
  useEffect(() => {
    if (user && isProfileComplete) {
      navigate("/");
    }
  }, [user, isProfileComplete, navigate]);

  const handleAuthSubmit = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isSignup) {
        const { error } = await signUp(email, password);
        if (error) {
          setError(error.message);
        } else {
          setSignupEmail(email);
          setStep("verify");
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          // Handle specific error cases
          if (error.message.includes("Invalid login credentials")) {
            setError("Invalid email or password. Please try again.");
          } else if (error.message.includes("Email not confirmed")) {
            setError("Please verify your email before signing in.");
          } else {
            setError(error.message);
          }
        }
        // Navigation handled by useEffect when user state updates
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileSubmit = async (data: {
    full_name: string;
    roll_number: string;
    branch: string;
    year: string;
    hostel: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await updateProfile(data);
      if (error) {
        setError(error.message);
      } else {
        navigate("/");
      }
    } finally {
      setIsLoading(false);
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
            {step === "profile" 
              ? "Almost There!" 
              : isSignup 
                ? "Join the DTU Community" 
                : "Welcome Back!"}
          </h1>
          <p className="text-lg text-white/80 max-w-md">
            {step === "profile"
              ? "Complete your profile to start trading with fellow DTU students."
              : isSignup 
                ? "Create your account and start trading with fellow DTU students today."
                : "Sign in to access your marketplace, services, and more."}
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="text-white/90">DTU students only</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Mail className="h-5 w-5 text-white" />
              </div>
              <div className="text-white/90">@dtu.ac.in email required</div>
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
              {step === "auth" && (isSignup ? "Create Account" : "Sign In")}
              {step === "verify" && "Check Your Email"}
              {step === "profile" && "Complete Your Profile"}
            </h2>
            <p className="text-muted-foreground">
              {step === "auth" && "Enter your DTU email to get started"}
              {step === "verify" && `We've sent a verification link to ${signupEmail}`}
              {step === "profile" && "Tell us a bit about yourself"}
            </p>
          </div>

          {/* Auth Step */}
          {step === "auth" && (
            <EmailStep
              isSignup={isSignup}
              onSubmit={handleAuthSubmit}
              isLoading={isLoading}
              error={error}
            />
          )}

          {/* Email Verification Step */}
          {step === "verify" && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  Click the link in your email to verify your account, then come back and sign in.
                </p>
              </div>
              <button
                type="button"
                className="w-full text-center text-primary hover:underline text-sm"
                onClick={() => {
                  setStep("auth");
                  setIsSignup(false);
                }}
              >
                Go to Sign In
              </button>
            </div>
          )}

          {/* Profile Step */}
          {step === "profile" && (
            <ProfileStep
              onSubmit={handleProfileSubmit}
              isLoading={isLoading}
              error={error}
            />
          )}

          {/* Toggle Login/Signup */}
          {step === "auth" && (
            <div className="mt-8 text-center text-sm text-muted-foreground">
              {isSignup ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="text-primary font-medium hover:underline"
                    onClick={() => {
                      setIsSignup(false);
                      setError(null);
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
                      setError(null);
                    }}
                  >
                    Sign up
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
