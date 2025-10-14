import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  waitlistRef: React.RefObject<HTMLDivElement>;
}

const Hero = ({ waitlistRef }: HeroProps) => {
  const handleScrollToWaitlist = () => {
    if (waitlistRef.current) {
      waitlistRef.current.scrollIntoView({ behavior: "smooth" });

      setTimeout(() => {
        const emailInput = waitlistRef.current?.querySelector(
          "input[type='email']"
        ) as HTMLInputElement | null;
        emailInput?.focus();
      }, 600);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 text-center">
        <Badge className="mb-6 bg-accent/10 text-accent border-accent/20">
          Coming Soon
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
          Streamline Your <span className="text-accent">SFG20</span> to{" "}
          <span className="text-accent">Simpro</span> Workflow
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto text-pretty">
          Import maintenance schedules from SFG20, select exactly what you need,
          and export seamlessly to Simpro. Save hours of manual data entry with
          our intelligent integration platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handleScrollToWaitlist}
            size="lg"
            className="px-8 bg-accent hover:bg-accent/90 cursor-pointer"
          >
            Get Early Access
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
