"use client";
import Header from "@/components/landing/header";
import Footer from "@/components/landing/footer";
import WaitlistCta from "@/components/landing/waitlist-cta";
import Hero from "@/components/landing/hero";
import Features from "@/components/landing/features";
import HowItWorks from "@/components/landing/how-it-works";
import SocialProof from "@/components/landing/social-proof";
import { useRef } from "react";
import Partners from "@/components/landing/partners";

export default function LandingPage() {
  const waitlistRef = useRef<HTMLDivElement>(null);
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}

      <Header />
      {/* Hero Section */}
      <Hero waitlistRef={waitlistRef} />

      {/* Features Section */}
      <Features />

      {/* How It Works */}
      <HowItWorks />

      {/* Partners/Integrations Section */}
      <Partners />

      {/* Social Proof */}
      <SocialProof />

      {/* Waitlist CTA */}
      <WaitlistCta ref={waitlistRef} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
