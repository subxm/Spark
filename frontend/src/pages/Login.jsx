import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser, loginWithGoogle } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FormInput from "../components/FormInput";
import { Mail, Lock, ArrowRight, Check } from "lucide-react";
import "./Auth.css";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/builder";

  const handleGoogleLogin = () => {
    if (window.google) {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: "760547749668-4pf9lr6htg3mib4mqkapu3j87qrer04o.apps.googleusercontent.com",
        scope: "openid profile email",
        callback: async (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            try {
              const res = await loginWithGoogle(tokenResponse.access_token);
              setSuccess(true);
              addToast("Signed in successfully. Redirecting...", "success");
              setTimeout(() => {
                login(res.data.user, res.data.token);
                navigate(from);
              }, 150);
            } catch (err) {
              addToast(err.response?.data?.message || "Google Sign-in failed. Try again.", "error");
              setLoading(false);
            }
          }
        },
      });
      tokenClient.requestAccessToken();
    }
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

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

    setLoading(true);
    setSuccess(false);

    try {
      const res = await loginUser(form);
      setSuccess(true);
      addToast("Signed in successfully. Redirecting...", "success");
      setTimeout(() => {
        login(res.data.user, res.data.token);
        navigate(from);
      }, 150);
    } catch (err) {
      addToast(err.response?.data?.message || "Login failed. Try again.", "error");
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

          <div className="auth-brand-content">
            <h1>Welcome back. Continue from where your ideas paused.</h1>

            <div className="auth-highlights">
              {highlights.map((item) => (
                <div key={item} className="auth-highlight">
                  <span className="auth-highlight-mark">
                    <Check size={12} strokeWidth={3} />
                  </span>
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
          </div>

          <div className="google-oauth-section">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="google-icon-only-btn"
              title="Sign in with Google"
              disabled={loading}
            >
              <svg viewBox="0 0 24 24" width="22" height="22">
                <g transform="matrix(1, 0, 0, 1, 0, 0)">
                  <path d="M21.35,11.1H12v2.7h5.38c-0.24,1.28 -0.96,2.37 -2.04,3.1v2.57h3.3c1.93,-1.78 3.04,-4.4 3.04,-7.48C21.68,11.75 21.56,11.4 21.35,11.1z" fill="#4285F4" />
                  <path d="M12,20.88c2.43,0 4.47,-0.8 5.96,-2.18l-3.3,-2.57c-0.91,0.61 -2.08,0.98 -2.66,0.98c-2.36,0 -4.36,-1.59 -5.07,-3.72H3.53v2.66C5.01,18.99 8.28,20.88 12,20.88z" fill="#34A853" />
                  <path d="M6.93,12.97C6.78,12.52 6.7,12.05 6.7,11.58c0,-0.47 0.08,-0.94 0.23,-1.39V7.53H3.53C3.03,8.53 2.75,9.65 2.75,10.83c0,1.18 0.28,2.3 0.78,3.3v-2.66H6.93z" fill="#FBBC05" />
                  <path d="M12,5.22c1.32,0 2.51,0.45 3.44,1.35l2.58,-2.58C16.46,2.54 14.43,1.75 12,1.75c-3.72,0 -6.99,1.89 -8.47,4.89l3.4,2.66C7.64,6.81 9.64,5.22 12,5.22z" fill="#EA4335" />
                </g>
              </svg>
            </button>
          </div>

          <div className="auth-divider">
            <span>or sign in with email</span>
          </div>



          <form onSubmit={handleSubmit} className={`auth-form ${loading ? "is-submitting" : ""} ${success ? "is-success" : ""}`}>
            <FormInput
              label="Email"
              name="email"
              type="email"
              placeholder="your@email.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              icon={Mail}
              disabled={loading}
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
              disabled={loading}
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
      className={`auth-submit-btn ${loading ? "is-loading" : ""} ${success ? "is-success" : ""}`.trim()}
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
