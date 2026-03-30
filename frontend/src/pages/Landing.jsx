import { useEffect, useRef, useState } from "react";
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
import { useAuth } from "../context/AuthContext";
import "./Landing.css";

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
      "Download clean code or deploy with one click. Your app goes live instantly with a shareable URL.",
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

const faqs = [
  {
    question: "What is Spark and how does it work?",
    answer:
      "Spark is an AI-powered no-code builder that transforms your text prompts into fully functional applications. Simply describe what you want to build, and Spark generates clean, production-ready code in seconds.",
  },
  {
    question: "Do I need coding experience to use Spark?",
    answer:
      "Not at all. Spark is designed for everyone, from complete beginners to experienced developers. Non-technical users can build with prompts, while developers can accelerate prototyping.",
  },
  {
    question: "Can I export the generated code?",
    answer:
      "Yes. On the Pro and Enterprise plans, you can export clean, well-structured code in HTML, React, or Vue. You own 100% of the code you generate.",
  },
  {
    question: "Is there a free plan available?",
    answer:
      "Absolutely. The Starter plan is free and includes 5 projects with 50 AI generations per month. No credit card required.",
  },
  {
    question: "What kind of apps can I build with Spark?",
    answer:
      "You can build landing pages, dashboards, SaaS apps, admin panels, portfolios, internal tools, and more from a single prompt.",
  },
];

function Reveal({ as: Tag = "div", className = "", children, ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || isVisible) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
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
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px",
      },
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

function HeroConsole() {
  const [hasTyped, setHasTyped] = useState(false);
  const [typedText, setTypedText] = useState("");
  const fullText =
    "Build me a beautiful SaaS dashboard with a dark mode sidebar, revenue charts, and a user activity table.";

  useEffect(() => {
    let currentText = "";
    let currentIndex = 0;

    const timeout = setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (currentIndex < fullText.length) {
          currentText += fullText[currentIndex];
          setTypedText(currentText);
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setTimeout(() => setHasTyped(true), 800);
        }
      }, 45);
      return () => clearInterval(typeInterval);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="hero-console animated-console">
      <div className="console-head">
        <div className="console-dots">
          <span className="dot red"></span>
          <span className="dot yellow"></span>
          <span className="dot green"></span>
        </div>
        <span>spark-builder-v2</span>
        <div className="console-spacer"></div>
      </div>

      {!hasTyped ? (
        <div className="console-body">
          <div className="prompt-container">
            <Sparkles size={16} className="prompt-icon" />
            <p className="prompt-typing">
              {typedText}
              <span className="cursor">|</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="console-body is-generating">
          <div className="prompt-container static">
            <Sparkles size={16} className="prompt-icon" />
            <p className="prompt-typing">{fullText}</p>
          </div>

          <div className="console-progress-group">
            <div className="progress-line fade-in-1">
              <span className="check">✓</span> Analyzing layout structure...
            </div>
            <div className="progress-line fade-in-2">
              <span className="check">✓</span> Assembling Tailwind components...
            </div>
            <div className="progress-line fade-in-3">
              <span className="spinner"></span> Generating code...
            </div>
          </div>

          <div className="console-preview-reveal">
            <div className="mock-ui">
              <div className="mock-sidebar"></div>
              <div className="mock-main">
                <div className="mock-header"></div>
                <div className="mock-cards">
                  <div className="mock-card card-1"></div>
                  <div className="mock-card card-2"></div>
                  <div className="mock-card card-3"></div>
                </div>
                <div className="mock-chart"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 14);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleGetStarted = () => {
    const isAuthenticated = token && token !== "undefined" && token !== "null";
    navigate(isAuthenticated ? "/builder" : "/register");
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="landing-page">
      <header className={`landing-nav ${isScrolled ? "is-scrolled" : ""}`}>
        <div className="landing-nav-inner">
          <button className="brand" onClick={() => handleScrollTo("top")}>
            Spark
          </button>
          <div className="nav-links">
            <button onClick={() => handleScrollTo("features")}>Features</button>
            <button onClick={() => handleScrollTo("how")}>How It Works</button>
          </div>
          <div className="nav-actions">
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button className="btn btn-dark" onClick={handleGetStarted}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero section">
          <Reveal as="div" className="hero-copy">
            <h1>Code is optional. Ideas aren't.</h1>
            <p>
              Transform your ideas into fully functional web applications. Just
              describe what you want, and watch Spark build clean,
              production-ready code in seconds.
            </p>
            <div className="hero-actions">
              <button
                className="btn btn-dark btn-lg"
                onClick={handleGetStarted}
              >
                Start Building Free <ArrowRight size={18} />
              </button>
            </div>
            <small>
              No credit card required. Generate your first UI in seconds.
            </small>
          </Reveal>

          <Reveal as="div">
            <HeroConsole />
          </Reveal>
        </section>

        <section id="features" className="section section-alt">
          <Reveal as="div" className="section-title">
            <h2>Everything you need to build faster</h2>
            <p>
              Powerful AI capabilities packed into a simple, intuitive
              interface. No learning curve needed.
            </p>
          </Reveal>
          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <Reveal
                  key={feature.title}
                  as="article"
                  className="feature-card"
                >
                  <div className="icon-wrap">
                    <Icon size={18} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </Reveal>
              );
            })}
          </div>
        </section>

        <section id="how" className="section">
          <Reveal as="div" className="section-title">
            <h2>Three steps to launch anything</h2>
            <p>From idea to production in minutes, not months.</p>
          </Reveal>
          <div className="steps-grid">
            {steps.map((step, idx) => (
              <Reveal key={step.title} as="article" className="step-card">
                <span className="step-number">{idx + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section section-alt">
          <Reveal as="div" className="section-title">
            <h2>Build anything you imagine</h2>
            <p>
              From quick prototypes to production apps, Spark handles it all.
            </p>
          </Reveal>
          <div className="usecase-grid">
            {useCases.map((item) => (
              <Reveal key={item.title} as="article" className="usecase-card">
                <div
                  className={`thumb thumb-${item.preview}`}
                  aria-hidden="true"
                >
                  {item.preview === "landing" && (
                    <>
                      <div className="thumb-topbar" />
                      <div className="thumb-title" />
                      <div className="thumb-line" />
                      <div className="thumb-line short" />
                      <div className="thumb-cta" />
                    </>
                  )}

                  {item.preview === "dashboard" && (
                    <>
                      <div className="dash-head" />
                      <div className="dash-grid">
                        <span />
                        <span />
                        <span />
                      </div>
                      <div className="dash-chart">
                        <b />
                        <b />
                        <b />
                        <b />
                        <b />
                      </div>
                    </>
                  )}

                  {item.preview === "saas" && (
                    <>
                      <div className="saas-head" />
                      <div className="saas-cols">
                        <span />
                        <span />
                      </div>
                      <div className="saas-footer" />
                    </>
                  )}
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="section section-alt">
          <Reveal as="div" className="section-title">
            <h2>Frequently asked questions</h2>
          </Reveal>
          <div className="faq-wrap">
            {faqs.map((faq, idx) => {
              const open = openFaq === idx;
              return (
                <Reveal
                  key={faq.question}
                  as="article"
                  className={`faq-item ${open ? "open" : ""}`}
                >
                  <button onClick={() => setOpenFaq(open ? null : idx)}>
                    <span>{faq.question}</span>
                    <Plus size={18} />
                  </button>
                  {open && <p>{faq.answer}</p>}
                </Reveal>
              );
            })}
          </div>
        </section>

        <section className="section cta-section dark-section">
          <Reveal as="div" className="section-title">
            <h2>Start building with AI today</h2>
            <p>
              Join 12,000+ builders who are shipping faster with Spark. No
              credit card required. Start free and upgrade when you are ready.
            </p>
          </Reveal>
          <button className="btn btn-accent" onClick={handleGetStarted}>
            Get Started Free <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-profile">
          <h4>Built by Subham Singh Negi</h4>
          <p>Connect with me</p>
          <div className="footer-links">
            <a
              href="https://github.com/subxm/"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/subxm/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn
            </a>
            <a href="mailto:subhamsinghnegi03@gmail.com">Email</a>
            <a href="https://www.subxm.me/" target="_blank" rel="noreferrer">
              Portfolio
            </a>
          </div>
        </div>
        <div className="footer-meta">
          <p>© 2026 Subham Singh Negi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
