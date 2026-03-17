import { useNavigate } from "react-router-dom";
import { ArrowRight, Check, Plus } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [scrollY, setScrollY] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleGetStarted = () => {
    navigate(token ? "/builder" : "/register");
  };

  const handleScrollTo = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#1a1a1a", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" }}>
      {/* Sticky Navigation */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          padding: "1.25rem 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#ffffff",
          borderBottom: scrollY > 50 ? "1px solid #e5e5e5" : "none",
          boxShadow: scrollY > 50 ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
          zIndex: 100,
          transition: "all 0.3s ease"
        }}
      >
        <div style={{
          fontSize: "1.25rem",
          fontWeight: "700",
          color: "#000000",
          letterSpacing: "-0.5px"
        }}>
          Spark
        </div>
        <div style={{ display: "flex", gap: "3rem", alignItems: "center" }}>
          <button onClick={() => handleScrollTo("features")} style={{ color: "#666", textDecoration: "none", cursor: "pointer", background: "none", border: "none", fontSize: "0.95rem", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "#000"} onMouseLeave={(e) => e.target.style.color = "#666"}>Features</button>
          <button onClick={() => handleScrollTo("pricing")} style={{ color: "#666", textDecoration: "none", cursor: "pointer", background: "none", border: "none", fontSize: "0.95rem", fontWeight: "500", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "#000"} onMouseLeave={(e) => e.target.style.color = "#666"}>Pricing</button>
          <button
            onClick={handleGetStarted}
            style={{
              padding: "0.5rem 1.25rem",
              backgroundColor: "#000000",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.375rem",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "0.9rem",
              transition: "all 0.2s",
              opacity: 0.9
            }}
            onMouseEnter={(e) => e.target.style.opacity = "1"}
            onMouseLeave={(e) => e.target.style.opacity = "0.9"}
          >
            Log in
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        paddingTop: "8rem",
        paddingBottom: "6rem",
        backgroundColor: "#ffffff",
        textAlign: "center"
      }}>
        <div style={{
          maxWidth: "900px",
          margin: "0 auto",
          paddingLeft: "2rem",
          paddingRight: "2rem"
        }}>
          <h1 style={{
            fontSize: "4.5rem",
            fontWeight: "800",
            marginBottom: "1.5rem",
            lineHeight: "1.15",
            letterSpacing: "-1.5px",
            color: "#000000"
          }}>
            Build anything<br />with just a prompt.
          </h1>
          <p style={{
            fontSize: "1.25rem",
            color: "#666666",
            marginBottom: "2.5rem",
            maxWidth: "600px",
            margin: "0 auto 2.5rem",
            lineHeight: "1.6"
          }}>
            Powerful AI capabilities packed into a simple, intuitive interface. No learning curve needed.
          </p>
          <div style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "3rem",
            flexWrap: "wrap"
          }}>
            <button
              onClick={handleGetStarted}
              style={{
                padding: "0.875rem 2rem",
                backgroundColor: "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                transition: "all 0.3s",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#1a1a1a";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#000000";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              Get Started Free <ArrowRight size={18} />
            </button>
            <button
              style={{
                padding: "0.875rem 2rem",
                backgroundColor: "#f5f5f5",
                color: "#000000",
                border: "1px solid #e0e0e0",
                borderRadius: "0.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#efefef";
                e.currentTarget.style.borderColor = "#000000";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#f5f5f5";
                e.currentTarget.style.borderColor = "#e0e0e0";
              }}
            >
              Watch Demo
            </button>
          </div>
          <p style={{
            color: "#999",
            fontSize: "0.9rem"
          }}>
            ✓ 12,000+ builders already onboard
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: "6rem 2rem",
        backgroundColor: "#fafafa"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          maxWidth: "600px",
          margin: "0 auto 4rem"
        }}>
          <h2 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000",
            letterSpacing: "-0.5px"
          }}>
            Everything you need to build faster
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "#666666",
            lineHeight: "1.6"
          }}>
            Powerful AI capabilities packed into a simple, intuitive interface. No learning curve needed.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {[
            {
              title: "AI-Powered Generation",
              description: "Describe your vision in natural language. Our AI understands context and builds pixel-perfect interfaces instantly."
            },
            {
              title: "Clean Code Export",
              description: "Export production-ready React, Vue, or HTML code. Clean, semantic, and optimized for performance."
            },
            {
              title: "Instant Deploy",
              description: "One-click deployment to the cloud. Get a live URL in seconds with automatic SSL and global CDN."
            },
            {
              title: "Iterative Editing",
              description: "Refine your app with follow-up prompts. Add features, change styles, or restructure — conversationally."
            },
            {
              title: "Enterprise Security",
              description: "SOC 2 compliant infrastructure. Your data and code are encrypted at rest and in transit, always."
            },
            {
              title: "Team Collaboration",
              description: "Real-time multiplayer editing. Share projects, leave comments, and build together seamlessly."
            }
          ].map((feature, idx) => (
            <div key={idx} style={{
              padding: "2.5rem 2rem",
              border: "1px solid #e5e5e5",
              borderRadius: "0.75rem",
              backgroundColor: "#ffffff",
              transition: "all 0.3s ease",
              cursor: "pointer"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#000000";
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e5e5";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div style={{
                width: "3rem",
                height: "3rem",
                backgroundColor: "#f0f0f0",
                borderRadius: "0.5rem",
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <div style={{
                  width: "1.5rem",
                  height: "1.5rem",
                  backgroundColor: "#d4af37",
                  borderRadius: "0.25rem"
                }}></div>
              </div>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "#000000"
              }}>
                {feature.title}
              </h3>
              <p style={{
                color: "#666666",
                fontSize: "0.95rem",
                lineHeight: "1.6"
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section style={{
        padding: "6rem 2rem",
        backgroundColor: "#ffffff"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          maxWidth: "600px",
          margin: "0 auto 4rem"
        }}>
          <h2 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000",
            letterSpacing: "-0.5px"
          }}>
            Three steps to launch anything
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "#666666",
            lineHeight: "1.6"
          }}>
            From idea to production in minutes, not months.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "3rem",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {[
            {
              num: "1",
              title: "Describe Your Idea",
              description: "Type a prompt like 'Build me a CRM dashboard with contacts and analytics.' Be as detailed as you want."
            },
            {
              num: "2",
              title: "AI Builds Your UI",
              description: "Watch as Spark generates components, layouts, and logic in real-time. Edit inline or refine with follow-up prompts."
            },
            {
              num: "3",
              title: "Export & Deploy",
              description: "Download clean code or deploy with one click. Your app goes live instantly with a shareable URL."
            }
          ].map((step, idx) => (
            <div key={idx} style={{
              padding: "2.5rem",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "0.75rem",
              textAlign: "center"
            }}>
              <div style={{
                fontSize: "3.5rem",
                fontWeight: "800",
                color: "#d4af37",
                marginBottom: "1rem",
                lineHeight: "1"
              }}>
                {step.num}
              </div>
              <h3 style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "#000000"
              }}>
                {step.title}
              </h3>
              <p style={{
                color: "#666666",
                lineHeight: "1.6"
              }}>
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Use Cases */}
      <section style={{
        padding: "6rem 2rem",
        backgroundColor: "#fafafa"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          maxWidth: "600px",
          margin: "0 auto 4rem"
        }}>
          <h2 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000",
            letterSpacing: "-0.5px"
          }}>
            Build anything you imagine
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "#666666"
          }}>
            From quick prototypes to production apps — Spark handles it all.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {[
            { title: "Landing Pages", description: "Beautiful, conversion-optimized landing pages for products, launches, and campaigns. Ready in minutes." },
            { title: "Dashboards", description: "Data-rich admin panels and analytics dashboards with charts, tables, and interactive widgets." },
            { title: "SaaS Applications", description: "Full-featured SaaS products with authentication, billing integration, and scalable architecture." }
          ].map((useCase, idx) => (
            <div key={idx} style={{
              padding: "2.5rem",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e5e5",
              borderRadius: "0.75rem",
              transition: "all 0.3s"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#000000";
                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0,0,0,0.06)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#e5e5e5";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "#000000"
              }}>
                {useCase.title}
              </h3>
              <p style={{
                color: "#666666",
                lineHeight: "1.6"
              }}>
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: "6rem 2rem",
        backgroundColor: "#000000",
        color: "#ffffff"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          maxWidth: "600px",
          margin: "0 auto 4rem"
        }}>
          <h2 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
            letterSpacing: "-0.5px"
          }}>
            Loved by builders worldwide
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {[
            {
              quote: "Spark completely changed how we prototype. What used to take our team a week now takes 15 minutes. The code quality is surprisingly good too.",
              author: "Sarah Lin",
              role: "Product Lead at Vercel"
            },
            {
              quote: "As a non-technical founder, Spark is a game-changer. I built and launched my MVP in a single afternoon without writing a single line of code.",
              author: "Marcus Rivera",
              role: "Founder of NovaPay"
            },
            {
              quote: "We use Spark for rapid prototyping and client demos. The turnaround is insane. Our clients think we have a 50-person engineering team.",
              author: "Aisha Khan",
              role: "CTO at BuildStack"
            }
          ].map((testim, idx) => (
            <div key={idx} style={{
              padding: "2.5rem",
              backgroundColor: "#1a1a1a",
              border: "1px solid #333333",
              borderRadius: "0.75rem",
              transition: "all 0.3s"
            }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "#d4af37";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(212,175,55,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "#333333";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <p style={{
                fontSize: "1rem",
                lineHeight: "1.7",
                marginBottom: "1.5rem",
                color: "#cccccc"
              }}>
                "{testim.quote}"
              </p>
              <div>
                <div style={{
                  fontWeight: "700",
                  marginBottom: "0.25rem"
                }}>
                  {testim.author}
                </div>
                <div style={{
                  fontSize: "0.9rem",
                  color: "#999999"
                }}>
                  {testim.role}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        padding: "6rem 2rem",
        backgroundColor: "#ffffff"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          maxWidth: "600px",
          margin: "0 auto 4rem"
        }}>
          <h2 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000",
            letterSpacing: "-0.5px"
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{
            fontSize: "1.1rem",
            color: "#666666"
          }}>
            Start free. Scale when you're ready. No hidden fees.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          {[
            {
              name: "Starter",
              price: "$0",
              features: ["5 projects", "50 AI generations / mo", "Basic code export", "Community support"],
              cta: "Get Started Free",
              popular: false
            },
            {
              name: "Pro",
              price: "$29",
              features: ["Unlimited projects", "1,000 AI generations / mo", "React & Vue export", "Custom domains", "Priority support"],
              cta: "Start Pro Trial",
              popular: true
            },
            {
              name: "Enterprise",
              price: "$99",
              features: ["Everything in Pro", "Unlimited AI generations", "Team collaboration (10 seats)", "SSO & audit logs", "Dedicated account manager"],
              cta: "Contact Sales",
              popular: false
            }
          ].map((plan, idx) => (
            <div key={idx} style={{
              padding: "3rem 2rem",
              border: plan.popular ? "2px solid #d4af37" : "1px solid #e5e5e5",
              borderRadius: "0.75rem",
              backgroundColor: plan.popular ? "#fffbf0" : "#ffffff",
              position: "relative",
              transition: "all 0.3s",
              transform: plan.popular ? "scale(1.02)" : "scale(1)"
            }}>
              {plan.popular && (
                <div style={{
                  position: "absolute",
                  top: "-0.75rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#d4af37",
                  color: "#000000",
                  padding: "0.375rem 1.25rem",
                  borderRadius: "9999px",
                  fontSize: "0.8rem",
                  fontWeight: "700"
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "1rem",
                color: "#000000"
              }}>
                {plan.name}
              </h3>
              <div style={{
                fontSize: "3rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
                color: "#000000"
              }}>
                {plan.price}
                <span style={{
                  fontSize: "1rem",
                  color: "#666666",
                  fontWeight: "400"
                }}>
                  /month
                </span>
              </div>
              <button
                onClick={handleGetStarted}
                style={{
                  width: "100%",
                  padding: "0.875rem",
                  backgroundColor: plan.popular ? "#000000" : "#f5f5f5",
                  color: plan.popular ? "#ffffff" : "#000000",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontWeight: "600",
                  marginBottom: "2rem",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  if (plan.popular) {
                    e.target.style.backgroundColor = "#1a1a1a";
                  } else {
                    e.target.style.backgroundColor = "#e5e5e5";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = plan.popular ? "#000000" : "#f5f5f5";
                }}
              >
                {plan.cta}
              </button>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem"
              }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    color: "#666666",
                    fontSize: "0.95rem"
                  }}>
                    <Check size={18} style={{ color: "#d4af37", flexShrink: 0, marginTop: "0.125rem" }} />
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        padding: "6rem 2rem",
        backgroundColor: "#fafafa"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem",
          maxWidth: "600px",
          margin: "0 auto 4rem"
        }}>
          <h2 style={{
            fontSize: "3rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000",
            letterSpacing: "-0.5px"
          }}>
            Frequently asked questions
          </h2>
        </div>

        <div style={{
          maxWidth: "700px",
          margin: "0 auto"
        }}>
          {[
            {
              q: "What is Spark and how does it work?",
              a: "Spark is an AI-powered no-code builder that transforms your text prompts into fully functional applications. Simply describe what you want to build — a landing page, dashboard, or full SaaS app — and our AI generates clean, production-ready code in seconds. You can refine with follow-up prompts or export the code."
            },
            {
              q: "Do I need coding experience to use Spark?",
              a: "Not at all! Spark is designed for everyone — from complete beginners to experienced developers. Non-technical users can build with natural language prompts, while developers can use it to accelerate prototyping and quickly scaffold complex applications."
            },
            {
              q: "Can I export the generated code?",
              a: "Yes! On the Pro and Enterprise plans, you can export clean, well-structured code in HTML, React, or Vue.js. The code is production-ready and follows modern best practices. You own 100% of the code you generate."
            },
            {
              q: "Is there a free plan available?",
              a: "Absolutely! Our Starter plan is completely free and includes 5 projects and 50 AI generations per month. It's a great way to explore Spark's capabilities before upgrading. No credit card required to get started."
            },
            {
              q: "What kind of apps can I build with Spark?",
              a: "You can build virtually anything — landing pages, dashboards, SaaS apps, admin panels, portfolios, e-commerce interfaces, internal tools, and more. Spark handles layout, components, styling, and basic interactivity from a single prompt."
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              marginBottom: "1rem",
              border: "1px solid #e5e5e5",
              borderRadius: "0.5rem",
              backgroundColor: "#ffffff",
              overflow: "hidden",
              transition: "all 0.3s"
            }}>
              <button
                style={{
                  width: "100%",
                  padding: "1.5rem 2rem",
                  backgroundColor: "#ffffff",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  transition: "all 0.3s"
                }}
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "#fafafa";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "#ffffff";
                }}
              >
                <span style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#000000",
                  textAlign: "left"
                }}>
                  {item.q}
                </span>
                <Plus
                  size={20}
                  style={{
                    color: "#d4af37",
                    transform: expandedFaq === idx ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.3s",
                    flexShrink: 0
                  }}
                />
              </button>
              {expandedFaq === idx && (
                <div style={{
                  padding: "0 2rem 1.5rem",
                  borderTop: "1px solid #e5e5e5",
                  color: "#666666",
                  lineHeight: "1.7"
                }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section style={{
        padding: "5rem 2rem",
        backgroundColor: "#000000",
        color: "#ffffff",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "3rem",
          fontWeight: "800",
          marginBottom: "1.5rem",
          letterSpacing: "-0.5px"
        }}>
          Start building with AI today
        </h2>
        <p style={{
          fontSize: "1.1rem",
          color: "#cccccc",
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto 2rem"
        }}>
          Join 12,000+ builders who are shipping faster with Spark. No credit card required. Start for free and upgrade when you're ready.
        </p>
        <button
          onClick={handleGetStarted}
          style={{
            padding: "0.875rem 2rem",
            backgroundColor: "#d4af37",
            color: "#000000",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "all 0.3s",
            boxShadow: "0 4px 12px rgba(212,175,55,0.2)"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#e8c547";
            e.currentTarget.style.boxShadow = "0 6px 16px rgba(212,175,55,0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#d4af37";
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(212,175,55,0.2)";
          }}
        >
          Get Started Free <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "3rem 2rem",
        backgroundColor: "#0a0a0a",
        color: "#999999",
        borderTop: "1px solid #1a1a1a"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          {[
            {
              title: "Product",
              links: ["Features", "Pricing", "Changelog", "Documentation"]
            },
            {
              title: "Company",
              links: ["About", "Blog", "Careers", "Contact"]
            },
            {
              title: "Legal",
              links: ["Privacy Policy", "Terms of Service", "Cookie Policy", "Security"]
            }
          ].map((section, idx) => (
            <div key={idx}>
              <h4 style={{
                color: "#ffffff",
                fontWeight: "700",
                marginBottom: "1rem",
                fontSize: "0.95rem"
              }}>
                {section.title}
              </h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {section.links.map((link, idx) => (
                  <li key={idx} style={{ marginBottom: "0.75rem" }}>
                    <a href="#" style={{ color: "#999999", textDecoration: "none", cursor: "pointer", transition: "color 0.2s" }} onMouseEnter={(e) => e.target.style.color = "#d4af37"} onMouseLeave={(e) => e.target.style.color = "#999999"}>{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div style={{
          paddingTop: "2rem",
          borderTop: "1px solid #1a1a1a",
          textAlign: "center",
          fontSize: "0.9rem"
        }}>
          <p>© 2025 Spark AI. All rights reserved.</p>
          <p style={{ marginTop: "0.5rem" }}>All systems operational</p>
        </div>
      </footer>
    </div>
  );
}
