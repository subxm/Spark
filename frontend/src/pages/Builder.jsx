import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Copy,
  LogOut,
  Sparkles,
  Eye,
  Code2,
  Mic,
  MessageSquare,
  ArrowUp,
} from "lucide-react";
import { generateCode as generateCodeRequest } from "../services/api";
import "./Builder.css";

export default function Builder() {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: "Describe what you want to build, then keep refining with follow-up prompts.",
    },
  ]);
  const [generatedCode, setGeneratedCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [copied, setCopied] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(36);
  const [isResizing, setIsResizing] = useState(false);
  const shellRef = useRef(null);
  const chatScrollRef = useRef(null);

  const promptIdeas = [
    "A modern SaaS pricing page with annual toggle",
    "A task dashboard with kanban and analytics cards",
    "A portfolio site with hero, projects, and contact form",
  ];

  const handleGenerate = async () => {
    if (loading) return;
    const trimmedPrompt = prompt.trim();

    if (!trimmedPrompt) {
      setError("Please enter a prompt");
      return;
    }

    const timestamp = Date.now();
    const pendingId = `assistant-pending-${timestamp}`;

    setChatMessages((previous) => [
      ...previous,
      { id: `user-${timestamp}`, role: "user", text: trimmedPrompt },
      {
        id: pendingId,
        role: "assistant",
        text: "Generating updated output...",
      },
    ]);
    setPrompt("");

    setLoading(true);
    setError("");
    setGeneratedCode("");

    try {
      const res = await generateCodeRequest(trimmedPrompt);
      const data = res.data;

      setGeneratedCode(data.code);
      setChatMessages((previous) =>
        previous.map((message) =>
          message.id === pendingId
            ? {
                ...message,
                text: "Output updated. Keep going with your next refinement.",
              }
            : message,
        ),
      );
      setLoading(false);
    } catch (err) {
      const errorMessage =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to generate. Try again.";
      setError(errorMessage);
      setChatMessages((previous) =>
        previous.map((message) =>
          message.id === pendingId
            ? {
                ...message,
                text: errorMessage,
              }
            : message,
        ),
      );
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
    setChatMessages((previous) => [
      ...previous,
      {
        id: `assistant-clear-${Date.now()}`,
        role: "assistant",
        text: "Cleared current output. Prompt again to generate a fresh version.",
      },
    ]);
  };

  const handlePromptKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleGenerate();
    }
  };

  const handleResizeStart = () => {
    if (window.innerWidth <= 1040) return;
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (event) => {
      if (!shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      const next = ((event.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(58, Math.max(28, next));
      setLeftPaneWidth(clamped);
    };

    const stopResize = () => setIsResizing(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [chatMessages]);

  const previewDoc = (() => {
    if (!generatedCode) return "";
    const frameReset =
      "<style>html,body{margin:0 !important;padding:0 !important;min-height:100%;}body{box-sizing:border-box;}</style>";

    if (/<head[\s>]/i.test(generatedCode)) {
      return generatedCode.replace(/<head([^>]*)>/i, `<head$1>${frameReset}`);
    }

    return `<!doctype html><html><head>${frameReset}</head><body>${generatedCode}</body></html>`;
  })();

  return (
    <div className="builder-page">
      <div
        className="builder-shell"
        ref={shellRef}
        style={{ "--builder-left-width": `${leftPaneWidth}%` }}
      >
        <aside className="builder-left-panel">
          <div className="builder-left-head">
            <div>
              <h1>Spark Builder</h1>
              <p>Welcome, {user?.name || "Builder"}</p>
            </div>
            <button className="builder-logout" onClick={logout}>
              <LogOut size={14} />
              Logout
            </button>
          </div>

          <div className="builder-upper-area">
            <section className="builder-chat-panel" ref={chatScrollRef}>
              {chatMessages.map((message) => (
                <article
                  key={message.id}
                  className={`builder-chat-item ${message.role === "user" ? "user" : "assistant"}`}
                >
                  <span className="builder-chat-role">
                    {message.role === "user" ? "You" : "Spark"}
                  </span>
                  <p>{message.text}</p>
                </article>
              ))}
              {loading && (
                <div className="builder-chat-typing">Spark is thinking...</div>
              )}
            </section>
          </div>

          <div className="builder-bottom-area">
            <div className="builder-input-label">UI Prompt</div>

            <div className="builder-ideas">
              {promptIdeas.map((idea) => (
                <button
                  key={idea}
                  type="button"
                  className="builder-idea-chip"
                  onClick={() => setPrompt(idea)}
                >
                  {idea}
                </button>
              ))}
            </div>

            <div className="builder-compose">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handlePromptKeyDown}
                placeholder="Ask Spark to create a web app that..."
                className="builder-compose-input"
              />

              <div className="builder-compose-actions">
                <div className="builder-compose-tools">
                  <button
                    type="button"
                    className="builder-tool-btn"
                    aria-label="Prompt mode"
                  >
                    <MessageSquare size={15} />
                  </button>
                  <button
                    type="button"
                    className="builder-tool-btn"
                    aria-label="Voice prompt"
                  >
                    <Mic size={15} />
                  </button>
                </div>

                <div className="builder-compose-submit">
                  {generatedCode && (
                    <button
                      type="button"
                      className="builder-clear-link"
                      onClick={handleClear}
                    >
                      Clear
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={handleGenerate}
                    disabled={loading}
                    className="builder-send-btn"
                    aria-label="Generate output"
                  >
                    {loading ? (
                      <span className="builder-spinner" />
                    ) : (
                      <ArrowUp size={16} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {error && <div className="builder-alert error">{error}</div>}
          </div>
        </aside>

        <div
          className={`builder-resizer ${isResizing ? "is-active" : ""}`.trim()}
          onMouseDown={handleResizeStart}
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize builder panels"
        />

        <section className="builder-right-panel">
          <div className="builder-right-head">
            <h2>Output Workspace</h2>
            <p>Preview and inspect the generated result instantly.</p>
          </div>

          {generatedCode && (
            <div className="builder-tabs">
              <button
                className={`builder-tab ${activeTab === "preview" ? "active" : ""}`.trim()}
                onClick={() => setActiveTab("preview")}
              >
                <Eye size={14} />
                Preview
              </button>
              <button
                className={`builder-tab ${activeTab === "code" ? "active" : ""}`.trim()}
                onClick={() => setActiveTab("code")}
              >
                <Code2 size={14} />
                Code
              </button>
            </div>
          )}

          {!generatedCode ? (
            <div className="builder-empty-state">
              <div className="builder-empty-icon">
                <Sparkles size={26} />
              </div>
              <h3>Ready to create?</h3>
              <p>
                Enter a prompt and click Generate to turn your idea into usable
                UI code.
              </p>
            </div>
          ) : activeTab === "preview" ? (
            <div className="builder-preview-wrap">
              <iframe
                title="Generated output preview"
                className="builder-preview-frame"
                srcDoc={previewDoc}
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
              />
            </div>
          ) : (
            <div className="builder-code-wrap">
              <div className="builder-code-head">
                <span>Generated Code</span>
                <button
                  onClick={handleCopyCode}
                  className={`builder-copy-btn ${copied ? "copied" : ""}`.trim()}
                >
                  <Copy size={12} />
                  {copied ? "Copied" : "Copy Code"}
                </button>
              </div>
              <pre className="builder-code-block">
                <code>{generatedCode}</code>
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
