import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Sandbox } from "@/components/Sandbox";
import { Workflows } from "@/components/Workflows";
import { QuickStart } from "@/components/QuickStart";
import { OneApiCall } from "@/components/OneApiCall";
import { Testimonials } from "@/components/Testimonials";
import { Comparison } from "@/components/Comparison";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="bg-[#faf9f5] text-zinc-900 min-h-screen font-sans antialiased selection:bg-teal-100 selection:text-teal-900 relative overflow-hidden">
      <style>{`
        @keyframes flow-dash {
          from {
            stroke-dashoffset: 20;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .animate-flow-line {
          stroke-dasharray: 6, 4;
          stroke-dashoffset: 0;
          animation: flow-dash 1s linear infinite !important;
        }
      `}</style>

      {/* Background gradients and blobs for attractive design */}
      <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-br from-teal-200/20 to-emerald-250/15 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[20%] right-[-10%] w-[45%] h-[45%] rounded-full bg-gradient-to-br from-amber-100/35 to-teal-100/10 blur-[100px] pointer-events-none -z-10" />

      <Navbar />

      <main className="space-y-6">
        <Hero />
        <Sandbox />
        <Workflows />
        <QuickStart />
        <OneApiCall />
        <Testimonials />
        <Comparison />
      </main>

      <Footer />
    </div>
  );
}
