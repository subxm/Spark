import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Code2, Rocket, MessageSquare, Lock, Users } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const navigate = useNavigate();
  const { token } = useAuth();

  const handleGetStarted = () => {
    if (token) {
      navigate("/builder");
    } else {
      navigate("/register");
    }
  };

  return (
    <div style={{ backgroundColor: "#ffffff", color: "#1e293b" }}>
      {/* Navigation */}
      <nav style={{
        padding: "1rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0"
      }}>
        <div style={{
          fontSize: "1.5rem",
          fontWeight: "700",
          color: "#000000",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem"
        }}>
          ✨ Spark
        </div>
        <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
          <a href="#features" style={{ color: "#64748b", textDecoration: "none", cursor: "pointer" }}>Features</a>
          <a href="#how-it-works" style={{ color: "#64748b", textDecoration: "none", cursor: "pointer" }}>How It Works</a>
          <a href="#pricing" style={{ color: "#64748b", textDecoration: "none", cursor: "pointer" }}>Pricing</a>
          {token && (
            <button
              onClick={() => navigate("/builder")}
              style={{
                padding: "0.5rem 1.5rem",
                backgroundColor: "#0ea5e9",
                color: "#ffffff",
                border: "none",
                borderRadius: "0.375rem",
                cursor: "pointer",
                fontWeight: "500",
                fontSize: "0.875rem"
              }}
            >
              Go to Builder
            </button>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        padding: "6rem 2rem",
        textAlign: "center",
        backgroundColor: "#000000",
        color: "#ffffff"
      }}>
        <h1 style={{
          fontSize: "3.5rem",
          fontWeight: "800",
          marginBottom: "1rem",
          lineHeight: "1.2"
        }}>
          Build anything with just a prompt.
        </h1>
        <p style={{
          fontSize: "1.25rem",
          color: "#cbd5e1",
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto 2rem"
        }}>
          Transform your ideas into fully functional applications in seconds. No coding required—just describe what you want, and AI handles the rest.
        </p>
        <div style={{
          display: "flex",
          gap: "1rem",
          justifyContent: "center",
          marginBottom: "3rem"
        }}>
          <button
            onClick={handleGetStarted}
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "#0ea5e9",
              color: "#ffffff",
              border: "none",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              transition: "background-color 0.3s"
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = "#0284c7"}
            onMouseLeave={(e) => e.target.style.backgroundColor = "#0ea5e9"}
          >
            Start Building Free <ArrowRight size={18} />
          </button>
          <button
            style={{
              padding: "0.75rem 2rem",
              backgroundColor: "transparent",
              color: "#ffffff",
              border: "1px solid #475569",
              borderRadius: "0.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = "#0ea5e9";
              e.target.style.color = "#0ea5e9";
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = "#475569";
              e.target.style.color = "#ffffff";
            }}
          >
            Watch Demo
          </button>
        </div>
        <p style={{
          color: "#94a3b8",
          fontSize: "0.875rem"
        }}>
          ✨ Join 5,000+ builders shipping faster with Spark
        </p>
      </section>

      {/* Features Section */}
      <section id="features" style={{
        padding: "5rem 2rem",
        backgroundColor: "#ffffff"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000"
          }}>
            Everything you need to build faster
          </h2>
          <p style={{
            fontSize: "1.125rem",
            color: "#64748b",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            Powerful AI capabilities packed into a simple, intuitive interface. No learning curve needed.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          {[
            {
              icon: Zap,
              title: "AI-Powered Generation",
              description: "Describe your vision in natural language. Our AI understands context and builds pixel-perfect interfaces instantly."
            },
            {
              icon: Code2,
              title: "Clean Code Export",
              description: "Export production-ready HTML, React, or Vue code. Clean, semantic, and optimized for performance."
            },
            {
              icon: Rocket,
              title: "Instant Deploy",
              description: "One-click deployment to the cloud. Get a live URL in seconds with automatic SSL and global CDN."
            },
            {
              icon: MessageSquare,
              title: "Iterative Editing",
              description: "Refine your app with follow-up prompts. Add features, change styles, or restructure — conversationally."
            },
            {
              icon: Lock,
              title: "Enterprise Security",
              description: "Your data and code are encrypted at rest and in transit. Enterprise-grade security for peace of mind."
            },
            {
              icon: Users,
              title: "Team Collaboration",
              description: "Share projects and collaborate in real-time. Build together seamlessly with your team."
            }
          ].map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} style={{
                padding: "2rem",
                border: "1px solid #e2e8f0",
                borderRadius: "0.5rem",
                backgroundColor: "#f8fafc",
                transition: "all 0.3s"
              }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "#0ea5e9";
                  e.currentTarget.style.backgroundColor = "#f0f9ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  e.currentTarget.style.backgroundColor = "#f8fafc";
                }}
              >
                <Icon size={32} style={{ color: "#0ea5e9", marginBottom: "1rem" }} />
                <h3 style={{
                  fontSize: "1.25rem",
                  fontWeight: "700",
                  marginBottom: "0.5rem",
                  color: "#000000"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: "#64748b",
                  fontSize: "0.95rem",
                  lineHeight: "1.5"
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" style={{
        padding: "5rem 2rem",
        backgroundColor: "#f1f5f9"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000"
          }}>
            Three steps to launch anything
          </h2>
          <p style={{
            fontSize: "1.125rem",
            color: "#64748b",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            From idea to production in minutes, not months.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "3rem",
          maxWidth: "1000px",
          margin: "0 auto"
        }}>
          {[
            {
              step: "1",
              title: "Describe Your Idea",
              description: "Type a prompt like 'Build me a landing page with pricing tiers and testimonials.' Be as detailed as you want."
            },
            {
              step: "2",
              title: "AI Builds Your UI",
              description: "Watch as Spark generates components, layouts, and styles in real-time. See your vision come to life instantly."
            },
            {
              step: "3",
              title: "Export & Deploy",
              description: "Download clean code or deploy with one click. Your app goes live instantly with a shareable URL."
            }
          ].map((item, idx) => (
            <div key={idx} style={{
              padding: "2rem",
              backgroundColor: "#ffffff",
              borderRadius: "0.5rem",
              border: "1px solid #e2e8f0",
              position: "relative"
            }}>
              <div style={{
                fontSize: "3rem",
                fontWeight: "800",
                color: "#0ea5e9",
                marginBottom: "1rem"
              }}>
                {item.step}
              </div>
              <h3 style={{
                fontSize: "1.25rem",
                fontWeight: "700",
                marginBottom: "0.75rem",
                color: "#000000"
              }}>
                {item.title}
              </h3>
              <p style={{
                color: "#64748b",
                lineHeight: "1.6"
              }}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{
        padding: "5rem 2rem",
        backgroundColor: "#ffffff"
      }}>
        <div style={{
          textAlign: "center",
          marginBottom: "4rem"
        }}>
          <h2 style={{
            fontSize: "2.5rem",
            fontWeight: "800",
            marginBottom: "1rem",
            color: "#000000"
          }}>
            Simple, transparent pricing
          </h2>
          <p style={{
            fontSize: "1.125rem",
            color: "#64748b"
          }}>
            Start free. Scale when you're ready. No hidden fees.
          </p>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "2rem",
          maxWidth: "1100px",
          margin: "0 auto"
        }}>
          {[
            {
              name: "Starter",
              price: "$0",
              period: "/month",
              description: "Perfect for trying out Spark",
              features: ["5 projects", "50 AI generations/mo", "Basic code export", "Community support"],
              cta: "Get Started Free",
              highlighted: false
            },
            {
              name: "Pro",
              price: "$29",
              period: "/month",
              description: "For professionals and small teams",
              features: ["Unlimited projects", "1,000 AI generations/mo", "React & Vue export", "Custom domains", "Priority support"],
              cta: "Start Pro Trial",
              highlighted: true
            },
            {
              name: "Enterprise",
              price: "$99",
              period: "/month",
              description: "For large teams and organizations",
              features: ["Everything in Pro", "Unlimited AI generations", "Team collaboration", "SSO & audit logs", "Dedicated account manager"],
              cta: "Contact Sales",
              highlighted: false
            }
          ].map((plan, idx) => (
            <div key={idx} style={{
              padding: "2.5rem",
              border: plan.highlighted ? "2px solid #0ea5e9" : "1px solid #e2e8f0",
              borderRadius: "0.75rem",
              backgroundColor: plan.highlighted ? "#f0f9ff" : "#ffffff",
              position: "relative"
            }}>
              {plan.highlighted && (
                <div style={{
                  position: "absolute",
                  top: "-0.75rem",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "#0ea5e9",
                  color: "#ffffff",
                  padding: "0.25rem 1rem",
                  borderRadius: "9999px",
                  fontSize: "0.75rem",
                  fontWeight: "700"
                }}>
                  MOST POPULAR
                </div>
              )}
              <h3 style={{
                fontSize: "1.5rem",
                fontWeight: "700",
                marginBottom: "0.5rem",
                color: "#000000"
              }}>
                {plan.name}
              </h3>
              <p style={{
                color: "#64748b",
                fontSize: "0.875rem",
                marginBottom: "1.5rem"
              }}>
                {plan.description}
              </p>
              <div style={{
                fontSize: "2.5rem",
                fontWeight: "800",
                marginBottom: "0.5rem",
                color: "#000000"
              }}>
                {plan.price}
                <span style={{
                  fontSize: "1rem",
                  color: "#64748b",
                  fontWeight: "400"
                }}>
                  {plan.period}
                </span>
              </div>
              <button
                onClick={handleGetStarted}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  backgroundColor: plan.highlighted ? "#0ea5e9" : "#f1f5f9",
                  color: plan.highlighted ? "#ffffff" : "#000000",
                  border: "none",
                  borderRadius: "0.375rem",
                  fontWeight: "600",
                  marginBottom: "2rem",
                  cursor: "pointer",
                  transition: "all 0.3s"
                }}
                onMouseEnter={(e) => {
                  if (plan.highlighted) {
                    e.target.style.backgroundColor = "#0284c7";
                  } else {
                    e.target.style.backgroundColor = "#e2e8f0";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = plan.highlighted ? "#0ea5e9" : "#f1f5f9";
                }}
              >
                {plan.cta}
              </button>
              <div style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem"
              }}>
                {plan.features.map((feature, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    color: "#334155",
                    fontSize: "0.9rem"
                  }}>
                    <span style={{
                      color: "#0ea5e9",
                      fontWeight: "700"
                    }}>✓</span>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section style={{
        padding: "4rem 2rem",
        backgroundColor: "#000000",
        color: "#ffffff",
        textAlign: "center"
      }}>
        <h2 style={{
          fontSize: "2.5rem",
          fontWeight: "800",
          marginBottom: "1rem"
        }}>
          Start building with AI today
        </h2>
        <p style={{
          fontSize: "1.125rem",
          color: "#cbd5e1",
          marginBottom: "2rem",
          maxWidth: "600px",
          margin: "0 auto 2rem"
        }}>
          Join builders shipping faster with Spark. No credit card required. Start for free and upgrade when you're ready.
        </p>
        <button
          onClick={handleGetStarted}
          style={{
            padding: "0.75rem 2rem",
            backgroundColor: "#0ea5e9",
            color: "#ffffff",
            border: "none",
            borderRadius: "0.5rem",
            fontSize: "1rem",
            fontWeight: "600",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            transition: "background-color 0.3s"
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = "#0284c7"}
          onMouseLeave={(e) => e.target.style.backgroundColor = "#0ea5e9"}
        >
          Get Started Free <ArrowRight size={18} />
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        padding: "3rem 2rem",
        backgroundColor: "#0f172a",
        color: "#cbd5e1",
        borderTop: "1px solid #1e293b"
      }}>
        <div style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "2rem",
          marginBottom: "2rem"
        }}>
          <div>
            <h4 style={{
              color: "#ffffff",
              fontWeight: "700",
              marginBottom: "1rem"
            }}>Product</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Features", "Pricing", "Changelog", "Docs"].map((item, idx) => (
                <li key={idx} style={{ marginBottom: "0.5rem" }}>
                  <a href="#" style={{ color: "#cbd5e1", textDecoration: "none", cursor: "pointer" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{
              color: "#ffffff",
              fontWeight: "700",
              marginBottom: "1rem"
            }}>Company</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["About", "Blog", "Careers", "Contact"].map((item, idx) => (
                <li key={idx} style={{ marginBottom: "0.5rem" }}>
                  <a href="#" style={{ color: "#cbd5e1", textDecoration: "none", cursor: "pointer" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 style={{
              color: "#ffffff",
              fontWeight: "700",
              marginBottom: "1rem"
            }}>Legal</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {["Privacy", "Terms", "Security"].map((item, idx) => (
                <li key={idx} style={{ marginBottom: "0.5rem" }}>
                  <a href="#" style={{ color: "#cbd5e1", textDecoration: "none", cursor: "pointer" }}>{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={{
          paddingTop: "2rem",
          borderTop: "1px solid #1e293b",
          textAlign: "center",
          fontSize: "0.875rem"
        }}>
          <p>© 2026 Spark. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
