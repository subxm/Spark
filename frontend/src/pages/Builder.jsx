import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Send, Copy, RotateCcw, LogOut } from "lucide-react";

export default function Builder() {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedCode("");

    try {
      // Placeholder API call - hook up to your backend later
      // const res = await fetch("/api/generate", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ prompt }),
      // });
      // const data = await res.json();
      // setGeneratedCode(data.code);

      // For now, simulate a response
      setTimeout(() => {
        setGeneratedCode(`<div style="padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; text-align: center; font-family: 'Inter', sans-serif; min-height: 400px; display: flex; align-items: center; justify-content: center;">
  <div>
    <h1 style="margin: 0; font-size: 48px; font-weight: 700; margin-bottom: 16px;">✨ AI Generated</h1>
    <p style="margin: 0; font-size: 18px; opacity: 0.9;">Your prompt: "${prompt}"</p>
    <p style="margin-top: 20px; font-size: 14px; opacity: 0.7;">Backend integration coming soon!</p>
  </div>
</div>`);
        setLoading(false);
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to generate. Try again.");
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setPrompt("");
    setGeneratedCode("");
    setError("");
    setActiveTab("preview");
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
      {/* ── LEFT PANEL: INPUT ── */}
      <div
        style={{
          width: "35%",
          height: "100%",
          background: "#000000",
          display: "flex",
          flexDirection: "column",
          padding: "32px 28px",
          borderRight: "1px solid #1a1f2e",
          overflowY: "auto",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#ffffff",
                marginBottom: 4,
              }}
            >
              Spark Builder
            </div>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              Welcome, {user?.name || "Builder"}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: "transparent",
              border: "1px solid #404854",
              color: "#e0e0e0",
              padding: "8px 12px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 12,
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: 6,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "#1a1f2e";
              e.target.style.borderColor = "#0ea5e9";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
              e.target.style.borderColor = "#404854";
            }}
          >
            <LogOut size={14} />
            Logout
          </button>
        </div>

        {/* Prompt Input */}
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#cbd5e1",
              textTransform: "uppercase",
              letterSpacing: "0.4px",
              marginBottom: 12,
            }}
          >
            UI Prompt
          </div>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the UI you want to build... e.g., 'A pricing page with 3 tiers and comparison table'"
            style={{
              width: "100%",
              height: 240,
              background: "#0f1419",
              border: "1px solid #404854",
              color: "#e0e0e0",
              fontSize: 13,
              fontFamily: "'Inter', sans-serif",
              padding: "14px",
              borderRadius: 8,
              outline: "none",
              boxSizing: "border-box",
              resize: "none",
              transition: "all 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#0ea5e9";
              e.target.style.boxShadow = "0 0 0 3px rgba(14, 165, 233, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#404854";
              e.target.style.boxShadow = "none";
            }}
          />

          {error && (
            <div
              style={{
                background: "#fee2e2",
                border: "1px solid #fecaca",
                color: "#991b1b",
                fontSize: 12,
                borderRadius: 6,
                padding: "10px 12px",
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>⚠</span>
              {error}
            </div>
          )}

          {generatedCode && (
            <div
              style={{
                background: "#dcfce7",
                border: "1px solid #bbf7d0",
                color: "#166534",
                fontSize: 12,
                borderRadius: 6,
                padding: "10px 12px",
                marginTop: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>✓</span>
              Code generated successfully!
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              flex: 1,
              background: loading ? "#404854" : "#0ea5e9",
              color: "#ffffff",
              border: "none",
              padding: "12px 16px",
              borderRadius: 6,
              fontSize: 13,
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              transition: "all 0.2s",
              fontFamily: "'Inter', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.background = "#0284c7";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.background = "#0ea5e9";
            }}
          >
            {loading ? (
              <>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)",
                    borderTopColor: "#ffffff",
                    animation: "spin 0.8s linear infinite",
                  }}
                />
                Generating...
              </>
            ) : (
              <>
                <Send size={14} />
                Generate
              </>
            )}
          </button>

          {generatedCode && (
            <button
              onClick={handleClear}
              style={{
                background: "#404854",
                color: "#e0e0e0",
                border: "none",
                padding: "12px 16px",
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                transition: "all 0.2s",
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.target.style.background = "#505860";
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "#404854";
              }}
            >
              <RotateCcw size={14} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* ── RIGHT PANEL: PREVIEW & CODE ── */}
      <div
        style={{
          width: "65%",
          height: "100%",
          background: "#ffffff",
          display: "flex",
          flexDirection: "column",
          padding: "32px",
          overflowY: "auto",
        }}
      >
        {/* Tabs */}
        {generatedCode && (
          <div style={{ marginBottom: 24 }}>
            <div
              style={{
                display: "flex",
                gap: 1,
                borderBottom: "1px solid #e2e8f0",
                marginBottom: 0,
              }}
            >
              {[
                { id: "preview", label: "Preview" },
                { id: "code", label: "Code" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  style={{
                    padding: "12px 0",
                    fontSize: 13,
                    fontWeight: 500,
                    textDecoration: "none",
                    color: activeTab === tab.id ? "#1e293b" : "#cbd5e1",
                    borderBottom:
                      activeTab === tab.id
                        ? "2px solid #0ea5e9"
                        : "2px solid transparent",
                    marginBottom: -1,
                    transition: "all 0.2s ease",
                    paddingBottom: "calc(12px - 2px)",
                    marginRight: 24,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {!generatedCode ? (
          <div
            style={{
              flex: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "#94a3b8",
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
              Ready to create?
            </div>
            <div style={{ fontSize: 14 }}>
              Enter a prompt and click Generate to see the magic happen
            </div>
          </div>
        ) : activeTab === "preview" ? (
          <div
            style={{
              flex: 1,
              background: "#f8fafc",
              borderRadius: 8,
              border: "1px solid #e2e8f0",
              overflow: "auto",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: generatedCode }}
              style={{
                width: "100%",
                height: "100%",
              }}
            />
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <div style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                Generated Code
              </div>
              <button
                onClick={handleCopyCode}
                style={{
                  background: copied ? "#dcfce7" : "#f1f5f9",
                  color: copied ? "#166534" : "#475569",
                  border: "1px solid #e2e8f0",
                  padding: "6px 12px",
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  transition: "all 0.2s",
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={(e) => {
                  if (!copied) {
                    e.target.style.background = "#e2e8f0";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!copied) {
                    e.target.style.background = "#f1f5f9";
                  }
                }}
              >
                <Copy size={12} />
                {copied ? "Copied!" : "Copy Code"}
              </button>
            </div>
            <pre
              style={{
                flex: 1,
                background: "#0f1419",
                color: "#e0e0e0",
                padding: "16px",
                borderRadius: 8,
                overflow: "auto",
                margin: 0,
                fontSize: 12,
                fontFamily: "'Fira Code', monospace",
                lineHeight: 1.5,
              }}
            >
              <code>{generatedCode}</code>
            </pre>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
