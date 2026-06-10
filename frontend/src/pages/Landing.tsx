import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Code2,
  MessageSquareText,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users2,
} from "lucide-react";
// @ts-ignore
import { useAuth } from "../context/AuthContext";

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Generation",
    description:
      "Describe your vision in natural language. Our AI understands context and builds pixel-perfect interfaces instantly.",
  },
  {
    icon: Code2,
    title: "Clean Code Export",
    description:
      "Export production-ready React, Vue, or HTML code. Clean, semantic, and optimized for performance.",
  },
  {
    icon: Rocket,
    title: "Instant Deploy",
    description:
      "One-click deployment to the cloud. Get a live URL in seconds with automatic SSL and global CDN.",
  },
  {
    icon: MessageSquareText,
    title: "Iterative Editing",
    description:
      "Refine your app with follow-up prompts. Add features, change styles, or restructure conversationally.",
  },
  {
    icon: ShieldCheck,
    title: "Enterprise Security",
    description:
      "SOC 2 compliant infrastructure. Your data and code are encrypted at rest and in transit, always.",
  },
  {
    icon: Users2,
    title: "Team Collaboration",
    description:
      "Real-time multiplayer editing. Share projects, leave comments, and build together seamlessly.",
  },
];

const steps = [
  {
    title: "Describe Your Idea",
    description:
      'Type a prompt like "Build me a CRM dashboard with contacts and analytics." Be as detailed as you want.',
  },
  {
    title: "AI Builds Your UI",
    description:
      "Watch as Spark generates components, layouts, and logic in real-time. Edit inline or refine with follow-up prompts.",
  },
  {
    title: "Export & Deploy",
    description:
      "Download clean code or deploy with one-click. Your app goes live instantly with a shareable URL.",
  },
];

const useCases = [
  {
    preview: "landing",
    title: "Landing Pages",
    description:
      "Beautiful, conversion-optimized landing pages for products, launches, and campaigns. Ready in minutes.",
  },
  {
    preview: "dashboard",
    title: "Dashboards",
    description:
      "Data-rich admin panels and analytics dashboards with charts, tables, and interactive widgets.",
  },
  {
    preview: "saas",
    title: "SaaS Applications",
    description:
      "Full-featured SaaS products with authentication, billing integration, and scalable architecture.",
  },
];


interface RevealProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType;
}

function Reveal({ as: Tag = "div", className = "", children, ...props }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isVisible) return;

    if (!("IntersectionObserver" in window)) {
      setTimeout(() => setIsVisible(true), 0);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [isVisible]);

  return (
    <Tag
      ref={elementRef}
      className={`reveal ${isVisible ? "is-visible" : ""} ${className}`.trim()}
      {...props}
    >
      {children}
    </Tag>
  );
}


export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 14);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetStarted = () => {
    const isAuthenticated = token && token !== "undefined" && token !== "null";
    navigate(isAuthenticated ? "/builder" : "/register");
  };

  const handleScrollTo = (id: string) => {
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="landing-page relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden pb-12 select-none">
      {/* Fullscreen Looping Background Video */}


      {/* Sticky Glassmorphic Navigation Bar */}
      <header
        className={`landing-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
          isScrolled
            ? "bg-slate-950/75 border-b border-white/10 backdrop-blur-lg shadow-lg"
            : "bg-transparent border-b border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex flex-row items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleScrollTo("top")}
            className="text-3xl tracking-tight text-foreground bg-transparent border-0 cursor-pointer"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Spark
          </button>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleScrollTo("features")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer"
            >
              Features
            </button>
            <button
              onClick={() => handleScrollTo("how")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={() => handleScrollTo("usecases")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer"
            >
              Showcase
            </button>

          </nav>

          {/* CTA */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors bg-transparent border-0 cursor-pointer"
            >
              Log in
            </button>
            <button
              onClick={handleGetStarted}
              className="liquid-glass rounded-full px-6 py-2.5 text-sm font-medium text-foreground transition-transform duration-200 hover:scale-[1.03]"
            >
              Begin Journey
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Sections */}
      <main className="relative z-10 w-full flex-grow" id="top">
        {/* Hero Section Container (Video constrained to this fold) */}
        <div className="relative w-full overflow-hidden min-h-[90vh] md:min-h-screen flex items-start justify-center pt-32 md:pt-40">
          {/* Background Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
          >
            <source
              src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
              type="video/mp4"
            />
          </video>
          {/* Ambient Overlay */}
          <div className="absolute inset-0 bg-slate-950/45 z-0 pointer-events-none" />

          {/* Centered Hero Content */}
          <section className="max-w-4xl mx-auto px-8 w-full relative z-10 flex flex-col items-center text-center">
            <h1
              className="text-5xl sm:text-7xl md:text-[5.4rem] tracking-[-2.46px] font-normal leading-[0.95] text-foreground animate-fade-rise"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Code is <em className="not-italic text-muted-foreground">optional.</em> Ideas <em className="not-italic text-muted-foreground">aren't.</em>
            </h1>
            <button
              onClick={handleGetStarted}
              className="liquid-glass rounded-full px-10 py-5 text-base font-medium text-foreground mt-12 cursor-pointer transition-transform duration-200 hover:scale-[1.03] animate-fade-rise-delay flex items-center gap-2"
            >
              <span>Begin Journey</span>
              <ArrowRight size={18} />
            </button>
          </section>
        </div>

        {/* Features Section */}
        <div className="relative w-full overflow-hidden border-t border-white/[0.03] bg-slate-950/20">
          <div className="bg-grid" />
          <section id="features" className="max-w-7xl mx-auto px-8 py-28 relative z-10">
            <Reveal className="section-title text-center max-w-2xl mx-auto mb-20">
              <h2
                className="text-4xl md:text-5.5xl font-normal tracking-tight text-white"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Everything you need to{" "}
                <em className="not-italic text-muted-foreground">
                  build faster.
                </em>
              </h2>
              <p className="text-muted-foreground text-base mt-4 leading-relaxed max-w-xl mx-auto">
                High-performance systems designed to translate thoughts into beautiful, structural layouts instantly.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <Reveal
                    key={feature.title}
                    className="liquid-glass border border-white/5 p-7 rounded-2xl flex flex-col items-start transition-all duration-300 shadow-sm group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white/10 to-white/0 border border-white/10 flex items-center justify-center text-white/90 shadow-sm mb-5 transition-colors group-hover:border-white/20">
                      <Icon size={18} />
                    </div>
                    <h3
                      className="text-xl font-normal text-white font-medium"
                      style={{ fontFamily: "'Instrument Serif', serif" }}
                    >
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mt-2.5">
                      {feature.description}
                    </p>
                  </Reveal>
                );
              })}
            </div>
          </section>
        </div>

        {/* How It Works Section */}
        <div className="relative w-full overflow-hidden border-t border-white/[0.03]">
          <div className="bg-grid" />
          <section id="how" className="max-w-7xl mx-auto px-8 py-28 relative z-10">
            <Reveal className="section-title text-center max-w-2xl mx-auto mb-20">
              <h2
                className="text-4xl md:text-5.5xl font-normal tracking-tight text-white"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Three steps to{" "}
                <em className="not-italic text-muted-foreground">
                  launch anything.
                </em>
              </h2>
              <p className="text-muted-foreground text-base mt-4 leading-relaxed max-w-xl mx-auto">
                Our automated deployment cycle abstracts the backend, letting you focus strictly on design intent.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <Reveal
                  key={step.title}
                  className="liquid-glass border border-white/5 p-8 rounded-2xl flex flex-col items-start transition-all duration-300 group"
                >
                  <span className="text-xs font-bold w-8 h-8 flex items-center justify-center rounded-full bg-white/10 border border-white/10 text-white mb-5 transition-all group-hover:scale-110 group-hover:bg-white/15">
                    {idx + 1}
                  </span>
                  <h3
                    className="text-2.5xl font-normal text-white"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-3 leading-relaxed">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* Use Cases Section (Showcase) */}
        <div className="relative w-full overflow-hidden border-t border-white/[0.03] bg-slate-950/10">
          <div className="bg-grid" />
          <section id="usecases" className="max-w-7xl mx-auto px-8 py-28 relative z-10">
            <Reveal className="section-title text-center max-w-2xl mx-auto mb-20">
              <h2
                className="text-4xl md:text-5.5xl font-normal tracking-tight text-white"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Build anything you{" "}
                <em className="not-italic text-muted-foreground">
                  imagine.
                </em>
              </h2>
              <p className="text-muted-foreground text-base mt-4 leading-relaxed max-w-xl mx-auto">
                Optimized architectures tuned specifically for multiple structural app form factors.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {useCases.map((item) => (
                <Reveal
                  key={item.title}
                  className="liquid-glass border border-white/5 p-6 rounded-2xl flex flex-col transition-all duration-300"
                >
                  {/* Simulated Thumbnail UI Graphics (Redesigned as rich high-fidelity glass components) */}
                  <div className="w-full mb-6 relative z-10" aria-hidden="true">
                    {item.preview === "landing" && (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-slate-950/40 p-4 flex flex-col gap-2 transition-all duration-300 group-hover:border-white/20 group-hover:bg-slate-950/60 shadow-inner">
                        {/* Browser Window Header */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#ed6a5e]/70" />
                            <span className="w-2 h-2 rounded-full bg-[#f4bf4f]/70" />
                            <span className="w-2 h-2 rounded-full bg-[#61c554]/70" />
                          </div>
                          <span className="text-[9px] text-muted-foreground/45 font-mono">spark.sh/landing</span>
                          <div className="w-5" />
                        </div>
                        {/* Landing Page Content */}
                        <div className="flex-grow flex flex-col justify-center items-center text-center px-4 relative">
                          <div className="absolute inset-0 bg-gradient-to-tr from-violet-500/10 via-transparent to-cyan-500/10 pointer-events-none" />
                          <span className="text-[8px] tracking-wider uppercase font-semibold text-cyan-400 mb-1">Creative Suite</span>
                          <h4 className="text-xs font-semibold text-white leading-snug max-w-[200px]" style={{ fontFamily: "'Instrument Serif', serif" }}>
                            Design in the fourth dimension.
                          </h4>
                          <p className="text-[7px] text-muted-foreground mt-1 max-w-[150px] leading-normal">The world's first interactive spatial website generator.</p>
                          <div className="mt-3 px-3 py-1 text-[8px] font-medium text-white bg-gradient-to-r from-violet-600 to-cyan-600 rounded-full shadow-lg shadow-violet-500/20 transform transition-transform group-hover:scale-105">
                            Launch Project
                          </div>
                        </div>
                      </div>
                    )}

                    {item.preview === "dashboard" && (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-slate-950/40 p-4 flex gap-3 transition-all duration-300 group-hover:border-white/20 group-hover:bg-slate-950/60 shadow-inner">
                        {/* Sidebar */}
                        <div className="w-12 border-r border-white/5 pr-2 flex flex-col gap-2.5 pt-0.5">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-md">S</div>
                          <div className="flex flex-col gap-1.5">
                            <span className="w-full h-1.5 rounded bg-white/15" />
                            <span className="w-4/5 h-1.5 rounded bg-white/5" />
                            <span className="w-5/6 h-1.5 rounded bg-white/5" />
                          </div>
                        </div>
                        {/* Main Dashboard Panel */}
                        <div className="flex-1 flex flex-col gap-2">
                          {/* Header */}
                          <div className="flex items-center justify-between">
                            <span className="text-[9px] font-semibold text-white">Analytics Overview</span>
                            <span className="text-[7px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded-full font-mono">+12.4%</span>
                          </div>
                          {/* Stats Cards */}
                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col">
                              <span className="text-[6px] text-muted-foreground uppercase tracking-wider font-semibold">Revenue</span>
                              <span className="text-xs font-bold text-white mt-0.5">$48,250</span>
                            </div>
                            <div className="p-2 rounded-lg bg-white/[0.02] border border-white/5 flex flex-col">
                              <span className="text-[6px] text-muted-foreground uppercase tracking-wider font-semibold">Active Users</span>
                              <span className="text-xs font-bold text-white mt-0.5">3,892</span>
                            </div>
                          </div>
                          {/* Chart */}
                          <div className="flex-1 bg-white/[0.01] border border-white/5 rounded-lg p-2 flex items-end gap-1.5">
                            <div className="flex-1 bg-gradient-to-t from-violet-600 to-cyan-500 rounded-t-[3px] transition-all duration-500 group-hover:h-[45%]" style={{ height: "35%" }} />
                            <div className="flex-1 bg-gradient-to-t from-violet-600 to-cyan-500 rounded-t-[3px] transition-all duration-500 group-hover:h-[70%]" style={{ height: "60%" }} />
                            <div className="flex-1 bg-gradient-to-t from-violet-600 to-cyan-500 rounded-t-[3px] transition-all duration-500 group-hover:h-[55%]" style={{ height: "45%" }} />
                            <div className="flex-1 bg-gradient-to-t from-violet-600 to-cyan-500 rounded-t-[3px] transition-all duration-500 group-hover:h-[95%]" style={{ height: "80%" }} />
                            <div className="flex-1 bg-gradient-to-t from-violet-600 to-cyan-500 rounded-t-[3px] transition-all duration-500 group-hover:h-[65%]" style={{ height: "55%" }} />
                          </div>
                        </div>
                      </div>
                    )}

                    {item.preview === "saas" && (
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10 bg-slate-950/40 p-4 flex flex-col gap-2.5 transition-all duration-300 group-hover:border-white/20 group-hover:bg-slate-950/60 shadow-inner">
                        {/* Workspace Topbar */}
                        <div className="flex items-center justify-between border-b border-white/5 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-violet-500 shadow-md shadow-violet-500/50 animate-pulse" />
                            <span className="text-[9px] font-semibold text-white">Production Cluster</span>
                          </div>
                          {/* Avatar stack */}
                          <div className="flex -space-x-1.5">
                            <span className="w-4 h-4 rounded-full bg-cyan-600 border border-slate-950 text-[6px] flex items-center justify-center font-bold text-white shadow-sm">A</span>
                            <span className="w-4 h-4 rounded-full bg-violet-600 border border-slate-950 text-[6px] flex items-center justify-center font-bold text-white shadow-sm">B</span>
                            <span className="w-4 h-4 rounded-full bg-emerald-600 border border-slate-950 text-[6px] flex items-center justify-center font-bold text-white shadow-sm">C</span>
                          </div>
                        </div>
                        {/* Kanban Columns */}
                        <div className="flex-1 grid grid-cols-3 gap-2">
                          {/* Column 1 */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[6px] text-muted-foreground uppercase tracking-wider font-semibold">Backlog</span>
                            <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex flex-col gap-1.5">
                              <span className="w-full h-1 bg-white/20 rounded" />
                              <span className="w-4/5 h-1 bg-white/5 rounded" />
                            </div>
                            <div className="p-1.5 rounded bg-white/[0.02] border border-white/5 flex flex-col gap-1">
                              <span className="w-full h-1 bg-white/15 rounded" />
                            </div>
                          </div>
                          {/* Column 2 */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[6px] text-cyan-400 uppercase tracking-wider font-semibold">Active Run</span>
                            <div className="p-1.5 rounded bg-cyan-500/5 border border-cyan-500/15 flex flex-col gap-1.5 shadow-sm shadow-cyan-500/5">
                              <span className="w-full h-1 bg-cyan-400/30 rounded" />
                              <span className="w-3/5 h-1 bg-cyan-400/15 rounded" />
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping mt-0.5" />
                            </div>
                          </div>
                          {/* Column 3 */}
                          <div className="flex flex-col gap-1.5">
                            <span className="text-[6px] text-emerald-400 uppercase tracking-wider font-semibold">Completed</span>
                            <div className="p-1.5 rounded bg-emerald-500/5 border border-emerald-500/10 flex flex-col gap-1">
                              <span className="w-full h-1 bg-emerald-400/20 rounded line-through opacity-40" />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <h3
                    className="text-2.5xl font-normal text-white mt-2"
                    style={{ fontFamily: "'Instrument Serif', serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </section>
        </div>

        {/* Final CTA Section */}
        <div className="relative w-full overflow-hidden border-t border-white/[0.03]">
          <div className="bg-grid" />
          <section className="max-w-4xl mx-auto px-8 py-32 text-center relative z-10">
            <Reveal className="flex flex-col items-center">
              <h2
                className="text-5xl md:text-6.5xl font-normal tracking-tight text-white leading-[1.05]"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                Start building with{" "}
                <em className="not-italic text-muted-foreground">
                  AI today.
                </em>
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg max-w-xl mt-5 leading-relaxed">
                Go from idea to interface in seconds — no setup, no config, no code required.
              </p>
              <button
                onClick={handleGetStarted}
                className="liquid-glass rounded-full px-12 py-5 text-base font-medium text-foreground mt-12 cursor-pointer transition-transform duration-200 hover:scale-[1.03] flex items-center gap-2"
              >
                <span>Begin Journey</span>
                <ArrowRight size={18} />
              </button>
            </Reveal>
          </section>
        </div>

      </main>

      {/* Footer Section */}
      <footer className="relative z-10 max-w-7xl mx-auto px-8 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/30">
        <div>© 2026 Spark. All rights reserved.</div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-white/50 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white/50 transition-colors">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
