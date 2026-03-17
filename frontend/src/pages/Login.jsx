import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import { Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError("");
    setLoading(true);
    setSuccess(false);

    try {
      const res = await loginUser(form);
      setSuccess(true);
      setTimeout(() => {
        login(res.data.user, res.data.token);
        navigate("/builder");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
        position: "fixed",
        top: 0,
        left: 0,
        background: "#ffffff",
      }}
    >
      {/* ── LEFT PANEL ── */}
      <div
        style={{
          width: "50%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          padding: "48px 40px",
          justifyContent: "space-between",
          borderRight: "1px solid #1a1f2e",
        }}
      >
        {/* Logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          <img
            src="/logo.jpeg"
            alt="Spark Agency Logo"
            style={{
              height: 150,
              objectFit: "contain",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h1
            style={{
              fontSize: 42,
              fontWeight: 700,
              color: "#ffffff",
              lineHeight: 1.2,
              margin: 0,
              marginBottom: 20,
              letterSpacing: "-1px",
            }}
          >
            Welcome back.
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "#a0aec0",
              lineHeight: 1.6,
              margin: 0,
              maxWidth: "85%",
            }}
          >
            Continue building amazing things with Spark. Enterprise-grade tools
            for modern teams.
          </p>

          {/* Features */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              marginTop: 48,
            }}
          >
            {[
              { title: "Secure & Reliable", desc: "Bank-level encryption" },
              { title: "Lightning Fast", desc: "Global CDN coverage" },
              { title: "Always Available", desc: "99.9% uptime SLA" },
            ].map((feature, i) => (
              <div key={i} style={{ display: "flex", gap: 12 }}>
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background: "#0ea5e9",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#ffffff",
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  ✓
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "#ffffff",
                      marginBottom: 2,
                    }}
                  >
                    {feature.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#64748b" }}>
                    {feature.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ fontSize: 13, color: "#64748b" }}>
          © 2026 Spark. All rights reserved.
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          width: "50%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 44px",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          {/* Tabs */}
          <div style={{ marginBottom: 32 }}>
            <div
              style={{
                display: "flex",
                gap: 1,
                borderBottom: "1px solid #e2e8f0",
                marginBottom: 24,
              }}
            >
              {[
                { label: "Sign in", to: "/login", active: true },
                { label: "Create account", to: "/register", active: false },
              ].map((t) => (
                <Link
                  key={t.to}
                  to={t.to}
                  style={{
                    padding: "12px 0",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    color: t.active ? "#1e293b" : "#cbd5e1",
                    borderBottom: t.active
                      ? "2px solid #0ea5e9"
                      : "2px solid transparent",
                    marginBottom: -1,
                    transition: "all 0.2s ease",
                    paddingBottom: "calc(12px - 2px)",
                    marginRight: 24,
                  }}
                >
                  {t.label}
                </Link>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#0f1419",
                  marginBottom: 8,
                  letterSpacing: "-0.5px",
                }}
              >
                Sign in
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: "#64748b",
                  margin: 0,
                }}
              >
                Access your Spark workspace.
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                fontSize: 13,
                borderRadius: 6,
                padding: "12px 14px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "slideDown 0.3s ease",
              }}
            >
              <span>⚠</span>
              {error}
            </div>
          )}

          {success && (
            <div
              style={{
                background: "#dcfce7",
                border: "1px solid #bbf7d0",
                color: "#166534",
                fontSize: 13,
                borderRadius: 6,
                padding: "12px 14px",
                marginBottom: 20,
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "slideDown 0.3s ease",
              }}
            >
              <span>✓</span>
              Signed in successfully! Redirecting...
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
            />

            <FormInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
            />

            <BtnSubmit
              loading={loading}
              success={success}
              label="Sign In"
              loadingLabel="Signing in..."
              successLabel="Signed In!"
            />
          </form>

          <div
            style={{
              fontSize: 13,
              color: "#64748b",
              textAlign: "center",
              marginTop: 20,
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#0ea5e9",
                textDecoration: "none",
                fontWeight: 500,
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.color = "#0284c7")}
              onMouseLeave={(e) => (e.target.style.color = "#0ea5e9")}
            >
              Create account
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

function BtnSubmit({ loading, success, label, loadingLabel, successLabel }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      type="submit"
      disabled={loading || success}
      onMouseEnter={() => !loading && !success && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        background: success ? "#dcfce7" : hovered ? "#0284c7" : "#0ea5e9",
        color: success ? "#166534" : "#ffffff",
        fontSize: 14,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 600,
        padding: "10px 16px",
        borderRadius: 6,
        border: "none",
        cursor: loading || success ? "not-allowed" : "pointer",
        letterSpacing: "-0.2px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "all 0.2s ease",
      }}
    >
      {loading ? (
        <>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              border: "2px solid rgba(14, 165, 233, 0.3)",
              borderTopColor: "#0ea5e9",
              animation: "spin 0.8s linear infinite",
            }}
          />
          {loadingLabel}
        </>
      ) : success ? (
        <>
          <span>✓</span>
          {successLabel}
        </>
      ) : (
        <>
          {label}
          <ArrowRight size={16} style={{ transition: "transform 0.2s" }} />
        </>
      )}
    </button>
  );
}
