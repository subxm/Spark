import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/FormInput";
import { Mail, Lock, ArrowRight } from "lucide-react";
import "./Auth.css";

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
      }, 150);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Try again.");
      setLoading(false);
    }
  };

  const highlights = [
    "Encrypted sessions with guarded access",
    "Generation pipelines tuned for speed",
    "Real-time project memory across prompts",
  ];

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-brand-panel">
          <Link to="/" className="auth-logo-wrap">
            <strong>Spark</strong>
          </Link>

          <div className="auth-brand-content">
            <h1>Welcome back. Continue from where your ideas paused.</h1>

            <div className="auth-highlights">
              {highlights.map((item) => (
                <div key={item} className="auth-highlight">
                  <span className="auth-highlight-mark">+</span>
                  <span className="auth-highlight-text">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        <section className="auth-form-panel">
          <div className="auth-tabs">
            <Link to="/login" className="auth-tab active">
              Sign in
            </Link>
            <Link to="/register" className="auth-tab">
              Create account
            </Link>
          </div>

          <div className="auth-headline">
            <h2>Sign in to Spark</h2>
            <p>Access your builder workspace and generation history.</p>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {success && (
            <div className="auth-alert success">
              Signed in successfully. Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
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
              successLabel="Signed In"
            />
          </form>

          <p className="auth-switch">
            Don&apos;t have an account?{" "}
            <Link to="/register">Create account</Link>
          </p>
        </section>
      </div>
    </div>
  );
}

function BtnSubmit({ loading, success, label, loadingLabel, successLabel }) {
  return (
    <button
      type="submit"
      disabled={loading || success}
      className={`auth-submit-btn ${success ? "is-success" : ""}`.trim()}
    >
      {loading ? (
        <>
          <span className="auth-spinner" />
          {loadingLabel}
        </>
      ) : success ? (
        <>
          <span>Done</span>
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
