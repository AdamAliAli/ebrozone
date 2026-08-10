import type { Metadata } from "next";
import { SiteHeader } from "../components/marketing/site-header";
import { HeroSection } from "../components/marketing/hero-section";
import { WhyEbroZoneSection } from "../components/marketing/why-ebrozone-section";
import { CoursesSection } from "../components/marketing/courses-section";
import { FinalCtaSection } from "../components/marketing/final-cta-section";
import { SiteFooter } from "../components/marketing/site-footer";

export const metadata: Metadata = {
  title: "EbroZone — Confidence-First English Learning",
  description:
    "Welcome to the Ebro Zone. Confidence-first, one-to-one English lessons with Ebro.",
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <HeroSection />
        <WhyEbroZoneSection />
        <CoursesSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
