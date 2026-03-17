import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
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
      "Type a prompt like \"Build me a CRM dashboard with contacts and analytics.\" Be as detailed as you want.",
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
    title: "Landing Pages",
    description:
      "Beautiful, conversion-optimized landing pages for products, launches, and campaigns. Ready in minutes.",
  },
  {
    title: "Dashboards",
    description:
      "Data-rich admin panels and analytics dashboards with charts, tables, and interactive widgets.",
  },
  {
    title: "SaaS Applications",
    description:
      "Full-featured SaaS products with authentication, billing integration, and scalable architecture.",
  },
];

const testimonials = [
  {
    quote:
      "Spark completely changed how we prototype. What used to take our team a week now takes 15 minutes. The code quality is surprisingly good too.",
    author: "Sarah Lin",
    role: "Product Lead at Vercel",
  },
  {
    quote:
      "As a non-technical founder, Spark is a game-changer. I built and launched my MVP in a single afternoon without writing a single line of code.",
    author: "Marcus Rivera",
    role: "Founder of NovaPay",
  },
  {
    quote:
      "We use Spark for rapid prototyping and client demos. The turnaround is insane. Our clients think we have a 50-person engineering team.",
    author: "Aisha Khan",
    role: "CTO at BuildStack",
  },
];

const pricing = [
  {
    name: "Starter",
    price: "$0",
    description: "Perfect for trying out Spark.",
    cta: "Get Started Free",
    features: [
      "5 projects",
      "50 AI generations / mo",
      "Basic code export",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$29",
    description: "For professionals and small teams.",
    cta: "Start Pro Trial",
    popular: true,
    features: [
      "Unlimited projects",
      "1,000 AI generations / mo",
      "React and Vue export",
      "Custom domains",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: "$99",
    description: "For large teams and organizations.",
    cta: "Contact Sales",
    features: [
      "Everything in Pro",
      "Unlimited AI generations",
      "Team collaboration (10 seats)",
      "SSO and audit logs",
      "Dedicated account manager",
    ],
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
    navigate(token ? "/builder" : "/register");
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
          <button className="brand" onClick={() => handleScrollTo("top")}>Spark</button>
          <div className="nav-links">
            <button onClick={() => handleScrollTo("features")}>Features</button>
            <button onClick={() => handleScrollTo("how")}>How It Works</button>
            <button onClick={() => handleScrollTo("pricing")}>Pricing</button>
          </div>
          <div className="nav-actions">
            <button className="btn btn-ghost" onClick={() => navigate("/login")}>Log in</button>
            <button className="btn btn-dark" onClick={handleGetStarted}>Get Started</button>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="hero section">
          <div className="hero-copy reveal">
            <span className="beta-pill">Now in Public Beta - Try it Free</span>
            <h1>
              Build anything
              <br />
              with just a prompt.
            </h1>
            <p>
              Spark transforms your ideas into fully functional apps, websites, and tools.
              Just describe what you want, and watch AI build it in seconds.
            </p>
            <div className="hero-actions">
              <button className="btn btn-dark" onClick={handleGetStarted}>
                Start Building Free <ArrowRight size={18} />
              </button>
              <button className="btn btn-soft" onClick={() => handleScrollTo("how")}>Watch Demo</button>
            </div>
            <small>12,000+ builders already onboard</small>
          </div>

          <div className="hero-console reveal">
            <div className="console-head">
              <span>spark-builder</span>
            </div>
            <div className="console-body">
              <p className="prompt">Build me a SaaS dashboard with user analytics, revenue charts, and sidebar navigation.</p>
              <div className="progress-line"><span /> Layout structure generated</div>
              <div className="progress-line"><span /> Components built</div>
              <div className="progress-line"><span /> Charts and data visualized</div>
              <div className="console-status">Deploying to preview...</div>
            </div>
          </div>
        </section>

        <section className="trusted section-tight reveal">
          <p>Trusted by teams at</p>
          <div>
            {"Google Meta Stripe Vercel Shopify Notion".split(" ").map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </section>

        <section id="features" className="section section-alt">
          <div className="section-title reveal">
            <h2>Everything you need to build faster</h2>
            <p>Powerful AI capabilities packed into a simple, intuitive interface. No learning curve needed.</p>
          </div>
          <div className="feature-grid">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.title} className="feature-card reveal">
                  <div className="icon-wrap">
                    <Icon size={18} />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="how" className="section">
          <div className="section-title reveal">
            <h2>Three steps to launch anything</h2>
            <p>From idea to production in minutes, not months.</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, idx) => (
              <article key={step.title} className="step-card reveal">
                <span className="step-number">{idx + 1}</span>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-alt">
          <div className="section-title reveal">
            <h2>Build anything you imagine</h2>
            <p>From quick prototypes to production apps, Spark handles it all.</p>
          </div>
          <div className="usecase-grid">
            {useCases.map((item) => (
              <article key={item.title} className="usecase-card reveal">
                <div className="thumb" />
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="section dark-section">
          <div className="section-title reveal">
            <h2>Loved by builders worldwide</h2>
          </div>
          <div className="testimonial-grid">
            {testimonials.map((item) => (
              <article key={item.author} className="testimonial-card reveal">
                <p>"{item.quote}"</p>
                <div>
                  <strong>{item.author}</strong>
                  <span>{item.role}</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="pricing" className="section">
          <div className="section-title reveal">
            <h2>Simple, transparent pricing</h2>
            <p>Start free. Scale when you are ready. No hidden fees.</p>
          </div>
          <div className="pricing-grid">
            {pricing.map((plan) => (
              <article key={plan.name} className={`price-card ${plan.popular ? "popular" : ""} reveal`}>
                {plan.popular && <span className="popular-tag">Most Popular</span>}
                <h3>{plan.name}</h3>
                <p className="price">
                  {plan.price}
                  <span>/month</span>
                </p>
                <p className="price-desc">{plan.description}</p>
                <button className={`btn ${plan.popular ? "btn-dark" : "btn-soft"}`} onClick={handleGetStarted}>
                  {plan.cta}
                </button>
                <ul>
                  {plan.features.map((feature) => (
                    <li key={feature}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="section section-alt">
          <div className="section-title reveal">
            <h2>Frequently asked questions</h2>
          </div>
          <div className="faq-wrap">
            {faqs.map((faq, idx) => {
              const open = openFaq === idx;
              return (
                <article key={faq.question} className={`faq-item ${open ? "open" : ""} reveal`}>
                  <button onClick={() => setOpenFaq(open ? null : idx)}>
                    <span>{faq.question}</span>
                    <Plus size={18} />
                  </button>
                  {open && <p>{faq.answer}</p>}
                </article>
              );
            })}
          </div>
        </section>

        <section className="section cta-section dark-section">
          <div className="section-title reveal">
            <h2>Start building with AI today</h2>
            <p>
              Join 12,000+ builders who are shipping faster with Spark. No credit card required.
              Start free and upgrade when you are ready.
            </p>
          </div>
          <button className="btn btn-accent" onClick={handleGetStarted}>
            Get Started Free <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="footer-grid">
          <div>
            <h4>Product</h4>
            <a href="#features">Features</a>
            <a href="#pricing">Pricing</a>
            <a href="#top">Changelog</a>
            <a href="#top">Documentation</a>
          </div>
          <div>
            <h4>Company</h4>
            <a href="#top">About</a>
            <a href="#top">Blog</a>
            <a href="#top">Careers</a>
            <a href="#top">Contact</a>
          </div>
          <div>
            <h4>Legal</h4>
            <a href="#top">Privacy Policy</a>
            <a href="#top">Terms of Service</a>
            <a href="#top">Cookie Policy</a>
            <a href="#top">Security</a>
          </div>
        </div>
        <div className="footer-meta">
          <p>© 2025 Spark AI. All rights reserved.</p>
          <small>All systems operational</small>
        </div>
      </footer>
    </div>
  );
}
