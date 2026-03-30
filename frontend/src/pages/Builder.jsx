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
  Monitor,
  Tablet,
  Smartphone,
  Download,
  ChevronLeft,
  ChevronRight,
  History,
  Library,
  Trash2,
  Heart,
  X,
  Play,
} from "lucide-react";
import {
  generateCode as generateCodeRequest,
  getHistory,
  deleteHistory,
  toggleFavourite,
} from "../services/api";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css"; // We will override the background in CSS for our custom dark theme
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
  const [codeHistory, setCodeHistory] = useState([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const generatedCode = codeHistory[currentHistoryIndex] || "";

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("preview");
  const [viewport, setViewport] = useState("desktop");
  const [copied, setCopied] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(36);
  const [isResizing, setIsResizing] = useState(false);
  const shellRef = useRef(null);
  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await getHistory();
      // Ensure we get an array, fallback if backend returns unexpected object
      setHistoryData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch history", err);
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isHistoryOpen) {
      fetchHistory();
    }
  }, [isHistoryOpen]);

  const handleToggleFavourite = async (item, e) => {
    e.stopPropagation();
    try {
      await toggleFavourite(item.id);
      setHistoryData((prev) =>
        prev.map((h) =>
          h.id === item.id ? { ...h, is_favourite: !h.is_favourite } : h,
        ),
      );
    } catch (err) {
      console.error("Failed to toggle favourite", err);
    }
  };

  const handleDeleteHistory = async (item, e) => {
    e.stopPropagation();
    try {
      if (!confirm("Delete this saved generation?")) return;
      await deleteHistory(item.id);
      setHistoryData((prev) => prev.filter((h) => h.id !== item.id));
    } catch (err) {
      console.error("Failed to delete history", err);
    }
  };

  const handleLoadHistory = (item) => {
    setChatMessages([
      {
        id: `loaded-${item.id}`,
        role: "user",
        text: item.prompt,
      },
      {
        id: `loaded-res-${item.id}`,
        role: "assistant",
        text: "I've restored this previous generation for you.",
      },
    ]);
    setCodeHistory([item.generated_code]);
    setCurrentHistoryIndex(0);
    setActiveTab("preview");
    setIsHistoryOpen(false);
  };

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
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);
    setError("");

    try {
      const res = await generateCodeRequest(trimmedPrompt);
      const data = res.data;

      setCodeHistory((prev) => [
        ...prev.slice(0, currentHistoryIndex + 1),
        data.code,
      ]);
      setCurrentHistoryIndex((prev) => prev + 1);

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

  const handleDownloadCode = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "spark-ui.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setPrompt("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    setCodeHistory([]);
    setCurrentHistoryIndex(-1);
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

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, parseInt(getComputedStyle(textareaRef.current).maxHeight)) || textareaRef.current.scrollHeight}px`;
    }
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

  useEffect(() => {
    if (activeTab === "code") {
      Prism.highlightAll();
    }
  }, [generatedCode, activeTab]);

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
      {/* History Sidebar */}
      <div className={`history-sidebar ${isHistoryOpen ? "is-open" : ""}`}>
        <div className="history-sidebar-head">
          <div className="head-title">
            <Library size={18} />
            <h2>Library</h2>
          </div>
          <button className="icon-btn" onClick={() => setIsHistoryOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <div className="history-sidebar-content">
          {historyLoading ? (
            <div className="history-loading">
              <span className="spinner"></span>
            </div>
          ) : !Array.isArray(historyData) || historyData.length === 0 ? (
            <div className="history-empty">
              <History size={32} />
              <p>No saved projects yet.</p>
              <span>Generations will appear here.</span>
            </div>
          ) : (
            <div className="history-grid">
              {historyData.map((item) => (
                <div
                  key={item.id}
                  className="history-card"
                  onClick={() => handleLoadHistory(item)}
                >
                  <div className="history-card-head">
                    <span className="history-date">
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    <div className="history-actions">
                      <button
                        className={`action-btn ${item.is_favourite ? "active" : ""}`}
                        onClick={(e) => handleToggleFavourite(item, e)}
                        title="Toggle Favourite"
                      >
                        <Heart
                          size={14}
                          className={item.is_favourite ? "filled" : ""}
                        />
                      </button>
                      <button
                        className="action-btn delete-btn"
                        onClick={(e) => handleDeleteHistory(item, e)}
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="history-prompt">{item.prompt}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Overlay to close sidebar on click */}
      {isHistoryOpen && (
        <div
          className="history-overlay"
          onClick={() => setIsHistoryOpen(false)}
        ></div>
      )}

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
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                className="builder-header-btn"
                onClick={() => setIsHistoryOpen(true)}
                title="Projects Library"
              >
                <Library size={16} />
              </button>
              <button
                className="builder-header-btn logout-btn"
                onClick={logout}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
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
                ref={textareaRef}
                value={prompt}
                onChange={handlePromptChange}
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
            <div className="builder-workspace-header">
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

              {codeHistory.length > 1 && (
                <div className="builder-version-control">
                  <button
                    onClick={() =>
                      setCurrentHistoryIndex((prev) => Math.max(0, prev - 1))
                    }
                    disabled={currentHistoryIndex === 0}
                    className="version-btn"
                    title="Previous Version"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="version-badge">
                    <History size={12} />v{currentHistoryIndex + 1}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentHistoryIndex((prev) =>
                        Math.min(codeHistory.length - 1, prev + 1),
                      )
                    }
                    disabled={currentHistoryIndex === codeHistory.length - 1}
                    className="version-btn"
                    title="Next Version"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              )}

              {activeTab === "preview" && (
                <div className="builder-viewport-toggles">
                  <button
                    className={`viewport-btn ${viewport === "desktop" ? "active" : ""}`}
                    onClick={() => setViewport("desktop")}
                    title="Desktop view"
                  >
                    <Monitor size={14} />
                  </button>
                  <button
                    className={`viewport-btn ${viewport === "tablet" ? "active" : ""}`}
                    onClick={() => setViewport("tablet")}
                    title="Tablet view"
                  >
                    <Tablet size={14} />
                  </button>
                  <button
                    className={`viewport-btn ${viewport === "mobile" ? "active" : ""}`}
                    onClick={() => setViewport("mobile")}
                    title="Mobile view"
                  >
                    <Smartphone size={14} />
                  </button>
                </div>
              )}
            </div>
          )}

          {!generatedCode && !loading ? (
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
          ) : !generatedCode && loading ? (
            <div className="builder-preview-wrap is-generating builder-first-gen">
              <div className="builder-preview-overlay">
                <div className="builder-shimmer"></div>
              </div>
              <div className="builder-generating-first-msg">
                <Sparkles size={28} className="builder-pulse-icon" />
                <h3>Crafting UI</h3>
                <p>Give Spark a few moments to assemble your code...</p>
              </div>
            </div>
          ) : activeTab === "preview" ? (
            <div
              className={`builder-preview-wrap viewport-${viewport} ${loading ? "is-generating" : ""}`.trim()}
            >
              <iframe
                title="Generated output preview"
                className="builder-preview-frame"
                srcDoc={previewDoc}
                sandbox="allow-scripts allow-same-origin allow-forms allow-modals"
              />
              {loading && (
                <div className="builder-preview-overlay">
                  <div className="builder-shimmer"></div>
                </div>
              )}
            </div>
          ) : (
            <div className="builder-code-wrap">
              <div className="builder-code-head">
                <span>Generated Code</span>
                <div className="builder-code-actions">
                  <button
                    onClick={handleCopyCode}
                    className={`builder-copy-btn ${copied ? "copied" : ""}`.trim()}
                  >
                    <Copy size={12} />
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button
                    onClick={handleDownloadCode}
                    className="builder-copy-btn"
                  >
                    <Download size={12} />
                    Download
                  </button>
                </div>
              </div>
              <pre
                className={`builder-code-block ${loading ? "is-generating" : ""}`.trim()}
              >
                <code className="language-html">{generatedCode}</code>
                {loading && (
                  <div className="builder-preview-overlay">
                    <div className="builder-shimmer-dark"></div>
                  </div>
                )}
              </pre>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
