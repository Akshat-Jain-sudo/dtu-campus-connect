import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="relative overflow-hidden rounded-3xl glass-card p-8 sm:p-12 lg:p-16 border-primary/20">
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orb bg-orb-primary opacity-40" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orb bg-orb-secondary opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
          
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/30 text-sm font-medium mb-6 shadow-glow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-foreground">Join 2,500+ DTU Students</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Ready to Start Trading?
            </h2>
            
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your free account today and become part of DTU's largest student marketplace.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="shadow-glow hover:shadow-glow-lg transition-shadow duration-300"
                asChild
              >
                <Link to="/auth?mode=signup">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="xl"
                variant="outline"
                className="border-border/50 hover:bg-accent/50 hover:border-primary/50 transition-all"
                asChild
              >
                <Link to="/marketplace">
                  Browse Marketplace
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
