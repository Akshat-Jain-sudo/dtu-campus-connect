import { UserPlus, Search, MessageSquare, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "Sign Up with DTU Email",
    description: "Register using your @dtu.ac.in email. We'll verify you're a real DTU student.",
  },
  {
    icon: Search,
    title: "Browse or List",
    description: "Explore listings or post your own items, services, or resources.",
  },
  {
    icon: MessageSquare,
    title: "Connect & Chat",
    description: "Message sellers directly. Negotiate and finalize deals within the platform.",
  },
  {
    icon: CheckCircle,
    title: "Meet & Trade",
    description: "Meet on campus for safe, quick transactions. Rate your experience.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-background" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-orb bg-orb-accent opacity-30" />
      
      <div className="container relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Getting started is easy. Here's how you can join the DTU Multimart community.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative text-center group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-px bg-gradient-to-r from-border to-border/30" />
              )}
              
              {/* Step Number & Icon */}
              <div className="relative z-10 mx-auto w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-glow group-hover:shadow-glow-lg transition-shadow duration-300">
                <step.icon className="h-9 w-9 text-primary-foreground" />
              </div>

              {/* Step Number Badge */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass border-2 border-primary flex items-center justify-center shadow-glow-sm">
                <span className="text-sm font-bold text-primary">{index + 1}</span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
