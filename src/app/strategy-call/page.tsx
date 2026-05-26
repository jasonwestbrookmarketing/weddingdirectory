import Marquee from "@/components/strategy-call/Marquee";
import StrategyNav from "@/components/strategy-call/StrategyNav";
import Hero from "@/components/strategy-call/Hero";
import LogoWall from "@/components/strategy-call/LogoWall";
import RealProblem from "@/components/strategy-call/RealProblem";
import Cascade from "@/components/strategy-call/Cascade";
import ProofDrop from "@/components/strategy-call/ProofDrop";
import MathSection from "@/components/strategy-call/MathSection";
import Differentiation from "@/components/strategy-call/Differentiation";
import Guarantee from "@/components/strategy-call/Guarantee";
import FinalCTA from "@/components/strategy-call/FinalCTA";
import PageFooter from "@/components/strategy-call/PageFooter";
import StrategyCallModal from "@/components/strategy-call/StrategyCallModal";
import ScrollToTop from "@/components/marketing/ScrollToTop";

export const dynamic = "force-static";

export default function StrategyCallPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-bg">
      {/* Sticky shell — marquee + nav scroll together */}
      <div className="sticky top-0 z-40">
        <Marquee />
        <StrategyNav />
      </div>

      <main className="flex-1">
        <Hero />
        <LogoWall />
        <RealProblem />
        <Cascade />
        <ProofDrop />
        <MathSection />
        <Differentiation />
        <Guarantee />
        <FinalCTA />
      </main>

      <PageFooter />

      {/* Always-mounted modal — pre-loads calendar iframe silently */}
      <StrategyCallModal />
      <ScrollToTop />
    </div>
  );
}
