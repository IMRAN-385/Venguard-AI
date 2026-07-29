import { Hero } from "@/components/Hero";
import { StatsMarquee } from "@/components/StatsMarquee";
import { FeaturedAssets } from "@/components/FeaturedAssets";
import { AutonomousFeatures } from "@/components/AutonomousFeatures";
import { LiveAgentFeed } from "@/components/LiveAgentFeed";
import { SectorChartSection } from "@/components/SectorChartSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FaqAccordion } from "@/components/FaqAccordion";
import { NewsletterCallToAction } from "@/components/NewsletterCallToAction";
import { CopilotFAB } from "@/components/CopilotFAB";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsMarquee />
      <FeaturedAssets />
      <AutonomousFeatures />
      <LiveAgentFeed />
      <SectorChartSection />
      <TestimonialsSection />
      <FaqAccordion />
      <NewsletterCallToAction />
      <CopilotFAB />
    </>
  );
}