import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import FormInput, { getPasswordStrength } from "../components/FormInput";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import "./Auth.css";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const passwordStrength = getPasswordStrength(form.password);

  const validateForm = () => {
    const newErrors = {};
    if (form.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
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
      const res = await registerUser(form);
      setSuccess(true);
      setTimeout(() => {
        login(res.data.user, res.data.token);
        navigate("/builder");
      }, 800);
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Try again.",
      );
      setLoading(false);
    }
  };

  const highlights = [
    "Ship your first generated brief in minutes",
    "Built-in auth, generation, and history flow",
    "Scales from solo idea to team workflow",
  ];

  return (
    <div className="auth-page">
      <div className="auth-shell">
        <aside className="auth-brand-panel">
          <Link to="/" className="auth-logo-wrap">
            <strong>Spark</strong>
          </Link>

          <div className="auth-brand-content">
            <h1>Start your workspace. Build faster with less friction.</h1>

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
            <Link to="/login" className="auth-tab">
              Sign in
            </Link>
            <Link to="/register" className="auth-tab active">
              Create account
            </Link>
          </div>

          <div className="auth-headline">
            <h2>Create your account</h2>
            <p>Start free and launch your first workflow in minutes.</p>
          </div>

          {error && <div className="auth-alert error">{error}</div>}
          {success && (
            <div className="auth-alert success">
              Account created. Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <FormInput
              label="Full Name"
              name="name"
              type="text"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
              icon={User}
            />

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
              placeholder="Min. 6 characters"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              icon={Lock}
              strength={passwordStrength}
            />

            <BtnSubmit
              loading={loading}
              success={success}
              label="Create Account"
              loadingLabel="Creating..."
              successLabel="Account Created"
            />
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
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
