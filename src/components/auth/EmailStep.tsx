import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Loader2 } from "lucide-react";

interface EmailStepProps {
  isSignup: boolean;
  onSubmit: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export function EmailStep({ isSignup, onSubmit, isLoading, error }: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);

  const isOwnerEmail = email === "akshat.jain0411@gmail.com";
  const isValidEmail = isOwnerEmail || email.endsWith("@dtu.ac.in");
  const passwordsMatch = password === confirmPassword;
  const isPasswordValid = password.length >= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (!isValidEmail) {
      setLocalError("Please use your @dtu.ac.in email");
      return;
    }

    if (!isPasswordValid) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    if (isSignup && !passwordsMatch) {
      setLocalError("Passwords do not match");
      return;
    }

    await onSubmit(email, password);
  };

  const displayError = error || localError;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            disabled={isLoading}
          />
        </div>
        {email && !isValidEmail && (
          <p className="text-sm text-destructive">Please use your @dtu.ac.in email</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />
        {password && !isPasswordValid && (
          <p className="text-sm text-muted-foreground">
            Password must be at least 6 characters
          </p>
        )}
      </div>

      {isSignup && (
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-destructive">Passwords do not match</p>
          )}
        </div>
      )}

      {displayError && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          {displayError}
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!isValidEmail || !isPasswordValid || (isSignup && !passwordsMatch) || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {isSignup ? "Creating account..." : "Signing in..."}
          </>
        ) : (
          isSignup ? "Create Account" : "Sign In"
        )}
      </Button>
    </form>
  );
}
