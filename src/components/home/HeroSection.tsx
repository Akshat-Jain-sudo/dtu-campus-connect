import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, Zap } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />

      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium mb-6 animate-fade-in-up">
              <ShieldCheck className="h-4 w-4" />
              Exclusively for DTU Students
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6 animate-fade-in-up animation-delay-100">
              Your Campus.
              <br />
              <span className="text-gradient">Your Marketplace.</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 mb-8 animate-fade-in-up animation-delay-200">
              Buy, sell, learn, and connect with fellow DTU students. The trusted platform built by students, for students.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up animation-delay-300">
              <Button variant="hero" size="xl" asChild>
                <Link to="/auth?mode=signup">
                  Join Now
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/marketplace">Explore Listings</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 mt-12 animate-fade-in-up animation-delay-400">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">2,500+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">10,000+</div>
                <div className="text-sm text-muted-foreground">Listings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">₹5L+</div>
                <div className="text-sm text-muted-foreground">Traded</div>
              </div>
            </div>
          </div>

          {/* Right Content - Feature Cards */}
          <div className="relative hidden lg:block">
            <div className="grid gap-4">
              {/* Feature Card 1 */}
              <div className="category-card ml-auto max-w-xs animate-slide-in-right">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Trusted Community</h3>
                    <p className="text-sm text-muted-foreground">Verified DTU students only</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 2 */}
              <div className="category-card mr-auto max-w-xs animate-slide-in-left animation-delay-100">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center">
                    <Zap className="h-6 w-6 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Quick Trades</h3>
                    <p className="text-sm text-muted-foreground">Meet on campus, trade instantly</p>
                  </div>
                </div>
              </div>

              {/* Feature Card 3 */}
              <div className="category-card ml-auto max-w-xs animate-slide-in-right animation-delay-200">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <ShieldCheck className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Safe & Secure</h3>
                    <p className="text-sm text-muted-foreground">Moderated by admins</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
