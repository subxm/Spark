import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  LogOut,
  Sparkles,
  Eye,
  Code2,
  MessageSquare,
  Mic,
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
  FileCode,
  Code,
  FileText,
  Share2,
  Plus,
  PanelRightOpen,
} from "lucide-react";
import {
  generateCode as generateCodeRequest,
  getHistory,
  deleteHistory,
  toggleFavourite,
} from "../services/api";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "./Builder.css";

export default function Builder() {
  const { user, logout } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [chatMessages, setChatMessages] = useState([
    {
      id: "assistant-welcome",
      role: "assistant",
      text: "Describe what you want to build, and I'll generate the UI code for you.",
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
  const [leftPaneWidth, setLeftPaneWidth] = useState(38);
  const [isResizing, setIsResizing] = useState(false);
  const shellRef = useRef(null);
  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);
  const centerTextareaRef = useRef(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [projectName, setProjectName] = useState("Untitled Project");
  const [activeCodeTab, setActiveCodeTab] = useState("html");

  const fetchHistory = async () => {
    try {
      setHistoryLoading(true);
      const res = await getHistory();
      setHistoryData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Failed to fetch history", err);
      setHistoryData([]);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    if (isHistoryOpen) fetchHistory();
  }, [isHistoryOpen]);

  const handleToggleFavourite = async (item, e) => {
    e.stopPropagation();
    try {
      await toggleFavourite(item.id);
      setHistoryData((prev) =>
        prev.map((h) => h.id === item.id ? { ...h, is_favourite: !h.is_favourite } : h)
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
    setIsActive(true);
    setChatMessages([
      { id: `loaded-${item.id}`, role: "user", text: item.prompt },
      { id: `loaded-res-${item.id}`, role: "assistant", text: "I've restored this previous generation for you." },
    ]);
    setCodeHistory([item.generated_code]);
    setCurrentHistoryIndex(0);
    setActiveTab("preview");
    setIsHistoryOpen(false);
  };

  const promptIdeas = [
    "A modern SaaS pricing page",
    "A task dashboard with kanban",
    "A portfolio with hero section",
  ];

  const handleGenerate = async (promptText = prompt) => {
    if (loading) return;
    const trimmedPrompt = promptText.trim();
    if (!trimmedPrompt) {
      setError("Please enter a prompt");
      return;
    }

    if (!isActive) {
      setIsActive(true);
    }

    const timestamp = Date.now();
    const pendingId = `assistant-pending-${timestamp}`;

    setChatMessages((prev) => [
      ...prev,
      { id: `user-${timestamp}`, role: "user", text: trimmedPrompt },
      { id: pendingId, role: "assistant", text: "Generating your UI..." },
    ]);
    setPrompt("");

    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (centerTextareaRef.current) centerTextareaRef.current.style.height = "auto";

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

      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId
            ? { ...msg, text: "Done! You can preview the result or ask for changes." }
            : msg
        )
      );
      setLoading(false);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to generate. Try again.";
      setError(errorMessage);
      setChatMessages((prev) =>
        prev.map((msg) =>
          msg.id === pendingId ? { ...msg, text: errorMessage } : msg
        )
      );
      setLoading(false);
    }
  };

  const handleCenterSubmit = () => {
    if (prompt.trim()) {
      handleGenerate();
    }
  };

  const handleCenterKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleCenterSubmit();
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

  const handleExportHTML = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCodeSandbox = () => {
    const sandboxCode = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName}</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script type="text/babel">
${generatedCode}
  </script>
</body>
</html>`;
    const blob = new Blob([sandboxCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "codesandbox.html";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleShareProject = async () => {
    const shareUrl = `${window.location.origin}/builder?project=${encodeURIComponent(projectName)}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to clipboard!");
    } catch {
      prompt("Copy this link to share your project:", shareUrl);
    }
  };

  const handleClear = () => {
    setPrompt("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setCodeHistory([]);
    setCurrentHistoryIndex(-1);
    setError("");
    setActiveTab("preview");
    setIsActive(false);
    setProjectName("Untitled Project");
    setChatMessages([
      {
        id: "assistant-welcome",
        role: "assistant",
        text: "Describe what you want to build, and I'll generate the UI code for you.",
      },
    ]);
  };

  const handleNewProject = () => {
    if (confirm("Start a new project? Current work will be lost.")) {
      handleClear();
    }
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const handleCenterPromptChange = (e) => {
    setPrompt(e.target.value);
    if (centerTextareaRef.current) {
      centerTextareaRef.current.style.height = "auto";
      centerTextareaRef.current.style.height = `${Math.min(centerTextareaRef.current.scrollHeight, 180)}px`;
    }
  };

  const handlePromptKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleResizeStart = () => {
    if (window.innerWidth <= 900) return;
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;
    const handleMouseMove = (e) => {
      if (!shellRef.current) return;
      const rect = shellRef.current.getBoundingClientRect();
      const next = ((e.clientX - rect.left) / rect.width) * 100;
      const clamped = Math.min(55, Math.max(30, next));
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
    if (activeTab === "code") Prism.highlightAll();
  }, [generatedCode, activeTab]);

  const previewDoc = (() => {
    if (!generatedCode) return "";
    const frameReset = "<style>html,body{margin:0 !important;padding:0 !important;min-height:100%;}body{box-sizing:border-box;}</style>";
    if (/<head[\s>]/i.test(generatedCode)) {
      return generatedCode.replace(/<head([^>]*)>/i, `<head$1>${frameReset}`);
    }
    return `<!doctype html><html><head>${frameReset}</head><body>${generatedCode}</body></html>`;
  })();

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const centerChatVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const splitViewVariants = {
    initial: { opacity: 0, x: -30 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "easeOut" } }
  };

  return (
    <div className="builder-page">
      {/* Top Navbar */}
      <motion.nav
        className="builder-topnav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="topnav-left">
          <div className="topnav-logo">
            <Sparkles size={18} />
            <span>Spark</span>
          </div>
        </div>
        <div className="topnav-center">
          <input
            type="text"
            className="topnav-project-name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="Project name..."
          />
        </div>
        <div className="topnav-right">
          <motion.button
            className="topnav-btn"
            onClick={handleNewProject}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus size={15} /> New
          </motion.button>
          {generatedCode && (
            <>
              <motion.button
                className="topnav-btn"
                onClick={handleExportHTML}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={15} /> Export
              </motion.button>
              <motion.button
                className="topnav-btn"
                onClick={handleShareProject}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 size={15} /> Share
              </motion.button>
            </>
          )}
          <motion.button
            className="topnav-btn icon-only"
            onClick={() => setIsHistoryOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <PanelRightOpen size={16} />
          </motion.button>
        </div>
      </motion.nav>

      {/* History Sidebar */}
      <AnimatePresence>
        {isHistoryOpen && (
          <>
            <motion.div
              className="history-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsHistoryOpen(false)}
            />
            <motion.div
              className="history-sidebar"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
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
                    {historyData.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="history-card"
                        onClick={() => handleLoadHistory(item)}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="history-card-head">
                          <span className="history-date">
                            {new Date(item.created_at).toLocaleDateString(undefined, {
                              month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                            })}
                          </span>
                          <div className="history-actions">
                            <button className="action-btn" onClick={(e) => handleToggleFavourite(item, e)}>
                              <Heart size={14} className={item.is_favourite ? "filled" : ""} />
                            </button>
                            <button className="action-btn delete-btn" onClick={(e) => handleDeleteHistory(item, e)}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        <p className="history-prompt">{item.prompt}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Shell */}
      <motion.div
        className={`builder-shell ${!isActive ? "is-empty" : "is-active"}`}
        ref={shellRef}
        style={{ "--builder-left-width": `${leftPaneWidth}%` }}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* ===== INITIAL STATE: CENTERED CHAT ===== */}
        {!isActive && (
          <motion.div
            className="builder-center-chat"
            variants={centerChatVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div className="center-chat-header" variants={itemVariants}>
              <motion.div
                className="center-chat-logo"
                whileHover={{ scale: 1.05, boxShadow: "0 12px 32px rgba(20, 17, 13, 0.3)" }}
                transition={{ duration: 0.2 }}
              >
                <Sparkles size={28} />
              </motion.div>
              <motion.h1
                className="center-chat-title"
                variants={itemVariants}
              >
                What will you build today?
              </motion.h1>
              <motion.p
                className="center-chat-subtitle"
                variants={itemVariants}
              >
                Create stunning UIs and websites by chatting with AI.
              </motion.p>
            </motion.div>

            <motion.div
              className="center-chat-input-wrap"
              variants={itemVariants}
            >
              <motion.div
                className="center-chat-input-container"
                whileFocus={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <textarea
                  ref={centerTextareaRef}
                  value={prompt}
                  onChange={handleCenterPromptChange}
                  onKeyDown={handleCenterKeyDown}
                  placeholder="A modern landing page with hero, features, and pricing sections..."
                  className="center-chat-textarea"
                />
                <div className="center-chat-actions">
                  <div className="center-chat-tools">
                    <motion.button
                      className="center-chat-tool"
                      title="Voice input"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Mic size={16} />
                    </motion.button>
                  </div>
                  <motion.button
                    className="center-chat-send"
                    onClick={handleCenterSubmit}
                    disabled={loading || !prompt.trim()}
                    whileHover={!loading && !prompt.trim() ? {} : { scale: 1.05 }}
                    whileTap={!loading && !prompt.trim() ? {} : { scale: 0.95 }}
                  >
                    {loading ? <span className="center-chat-spinner" /> : <ArrowUp size={18} />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="center-chat-ideas"
                variants={itemVariants}
              >
                {promptIdeas.map((idea, index) => (
                  <motion.button
                    key={idea}
                    className="center-chat-idea"
                    onClick={() => setPrompt(idea)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {idea}
                  </motion.button>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* ===== ACTIVE STATE: SPLIT VIEW ===== */}
        {isActive && (
          <>
            <motion.aside
              className="builder-left-panel"
              variants={splitViewVariants}
              initial="initial"
              animate="animate"
            >
              <motion.div
                className="builder-left-head"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <div>
                  <h1>Spark Builder</h1>
                  <p>Welcome, {user?.name || "Builder"}</p>
                </div>
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  <motion.button
                    className="builder-header-btn"
                    onClick={() => setIsHistoryOpen(true)}
                    title="Projects Library"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Library size={16} />
                  </motion.button>
                  <motion.button
                    className="builder-header-btn"
                    onClick={logout}
                    title="Logout"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <LogOut size={16} />
                  </motion.button>
                </div>
              </motion.div>

              <div className="builder-upper-area">
                <section className="builder-chat-panel" ref={chatScrollRef}>
                  <AnimatePresence>
                    {chatMessages.map((message, index) => (
                      <motion.article
                        key={message.id}
                        className={`builder-chat-item ${message.role === "user" ? "user" : "assistant"}`}
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                      >
                        <span className="builder-chat-role">{message.role === "user" ? "You" : "Spark"}</span>
                        <p>{message.text}</p>
                      </motion.article>
                    ))}
                  </AnimatePresence>
                  {loading && (
                    <motion.div
                      className="builder-chat-typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      Spark is thinking
                    </motion.div>
                  )}
                </section>
              </div>

              <div className="builder-bottom-area">
                <motion.div
                  className="builder-input-label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  UI Prompt
                </motion.div>
                <motion.div
                  className="builder-ideas"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                >
                  {promptIdeas.map((idea) => (
                    <motion.button
                      key={idea}
                      className="builder-idea-chip"
                      onClick={() => setPrompt(idea)}
                      whileHover={{ scale: 1.03, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {idea}
                    </motion.button>
                  ))}
                </motion.div>
                <motion.div
                  className="builder-compose"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <textarea
                    ref={textareaRef}
                    value={prompt}
                    onChange={handlePromptChange}
                    onKeyDown={handlePromptKeyDown}
                    placeholder="Ask Spark to create..."
                    className="builder-compose-input"
                  />
                  <div className="builder-compose-actions">
                    <div className="builder-compose-tools">
                      <motion.button
                        className="builder-tool-btn"
                        aria-label="Message mode"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <MessageSquare size={15} />
                      </motion.button>
                      <motion.button
                        className="builder-tool-btn"
                        aria-label="Voice"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Mic size={15} />
                      </motion.button>
                    </div>
                    <div className="builder-compose-submit">
                      {generatedCode && (
                        <motion.button
                          className="builder-clear-link"
                          onClick={handleClear}
                          whileHover={{ color: "#d8a141" }}
                        >
                          Clear
                        </motion.button>
                      )}
                      <motion.button
                        className="builder-send-btn"
                        onClick={() => handleGenerate()}
                        disabled={loading}
                        whileHover={!loading ? { scale: 1.05 } : {}}
                        whileTap={!loading ? { scale: 0.95 } : {}}
                      >
                        {loading ? <span className="builder-spinner" /> : <ArrowUp size={16} />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                {error && (
                  <motion.div
                    className="builder-alert error"
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </motion.aside>

            <div
              className={`builder-resizer ${isResizing ? "is-active" : ""}`}
              onMouseDown={handleResizeStart}
            />

            <section className="builder-right-panel">
              <motion.div
                className="builder-right-head"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <h2>Preview</h2>
                <div className="builder-right-head-actions">
                  {generatedCode && (
                    <>
                      <motion.button
                        className="builder-right-head-btn"
                        onClick={handleCopyCode}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Copy size={14} /> {copied ? "Copied" : "Copy"}
                      </motion.button>
                      <motion.button
                        className="builder-right-head-btn"
                        onClick={handleExportHTML}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Download size={14} /> HTML
                      </motion.button>
                      <motion.button
                        className="builder-right-head-btn"
                        onClick={() => alert("React export coming soon!")}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Code size={14} /> React
                      </motion.button>
                      <motion.button
                        className="builder-right-head-btn"
                        onClick={handleExportCodeSandbox}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <FileCode size={14} /> CodeSandbox
                      </motion.button>
                    </>
                  )}
                </div>
              </motion.div>

              {generatedCode && (
                <motion.div
                  className="builder-workspace-header"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="builder-tabs">
                    <motion.button
                      className={`builder-tab ${activeTab === "preview" ? "active" : ""}`}
                      onClick={() => setActiveTab("preview")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye size={14} /> Preview
                    </motion.button>
                    <motion.button
                      className={`builder-tab ${activeTab === "code" ? "active" : ""}`}
                      onClick={() => setActiveTab("code")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Code2 size={14} /> Code
                    </motion.button>
                    <motion.button
                      className={`builder-tab ${activeTab === "console" ? "active" : ""}`}
                      onClick={() => setActiveTab("console")}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FileText size={14} /> Console
                    </motion.button>
                  </div>

                  {codeHistory.length > 1 && (
                    <div className="builder-version-control">
                      <button
                        onClick={() => setCurrentHistoryIndex((prev) => Math.max(0, prev - 1))}
                        disabled={currentHistoryIndex === 0}
                        className="version-btn"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <span className="version-badge"><History size={12} />v{currentHistoryIndex + 1}</span>
                      <button
                        onClick={() => setCurrentHistoryIndex((prev) => Math.min(codeHistory.length - 1, prev + 1))}
                        disabled={currentHistoryIndex === codeHistory.length - 1}
                        className="version-btn"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}

                  {activeTab === "preview" && (
                    <div className="builder-viewport-toggles">
                      <motion.button
                        className={`viewport-btn ${viewport === "desktop" ? "active" : ""}`}
                        onClick={() => setViewport("desktop")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Monitor size={14} />
                      </motion.button>
                      <motion.button
                        className={`viewport-btn ${viewport === "tablet" ? "active" : ""}`}
                        onClick={() => setViewport("tablet")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Tablet size={14} />
                      </motion.button>
                      <motion.button
                        className={`viewport-btn ${viewport === "mobile" ? "active" : ""}`}
                        onClick={() => setViewport("mobile")}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <Smartphone size={14} />
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              )}

              {!generatedCode && !loading && (
                <motion.div
                  className="builder-empty-state"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="builder-empty-icon">
                    <Sparkles size={26} />
                  </div>
                  <h3>Ready to create?</h3>
                  <p>Enter a prompt in the chat to generate your UI.</p>
                </motion.div>
              )}

              {!generatedCode && loading && (
                <motion.div
                  className="builder-preview-wrap is-generating builder-first-gen"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="builder-preview-overlay">
                    <div className="builder-shimmer" />
                  </div>
                  <div className="builder-generating-first-msg">
                    <Sparkles size={28} className="builder-pulse-icon" />
                    <h3>Crafting UI</h3>
                    <p>Give Spark a few moments to assemble your code...</p>
                  </div>
                </motion.div>
              )}

              {generatedCode && activeTab === "preview" && (
                <motion.div
                  className={`builder-preview-wrap viewport-${viewport} ${loading ? "is-generating" : ""}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <iframe
                    title="Preview"
                    className="builder-preview-frame"
                    srcDoc={previewDoc}
                    sandbox="allow-scripts allow-same-origin allow-forms"
                  />
                  {loading && (
                    <div className="builder-preview-overlay">
                      <div className="builder-shimmer" />
                    </div>
                  )}
                </motion.div>
              )}

              {generatedCode && activeTab === "code" && (
                <motion.div
                  className="builder-code-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="code-tabs-container">
                    <div className="code-tabs">
                      <button
                        className={`code-tab ${activeCodeTab === "html" ? "active" : ""}`}
                        onClick={() => setActiveCodeTab("html")}
                      >
                        <FileCode size={14} /> HTML
                      </button>
                      <button
                        className={`code-tab ${activeCodeTab === "css" ? "active" : ""}`}
                        onClick={() => setActiveCodeTab("css")}
                      >
                        <Code size={14} /> CSS
                      </button>
                      <button
                        className={`code-tab ${activeCodeTab === "js" ? "active" : ""}`}
                        onClick={() => setActiveCodeTab("js")}
                      >
                        <FileText size={14} /> JS
                      </button>
                      <button
                        className={`code-tab ${activeCodeTab === "react" ? "active" : ""}`}
                        onClick={() => setActiveCodeTab("react")}
                      >
                        <Code size={14} /> React
                      </button>
                    </div>
                    <div className="code-tab-actions">
                      <button className="code-action-btn" onClick={handleCopyCode}>
                        <Copy size={14} /> {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                  </div>
                  <pre className={`builder-code-block ${loading ? "is-generating" : ""}`}>
                    <code className="language-html">{generatedCode}</code>
                  </pre>
                </motion.div>
              )}

              {generatedCode && activeTab === "console" && (
                <motion.div
                  className="builder-console-wrap"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="console-header">
                    <div className="console-title">
                      <FileText size={14} /> Console
                    </div>
                  </div>
                  <div className="console-output">
                    <div className="console-line info">
                      <span className="console-time">[{new Date().toLocaleTimeString()}]</span>
                      <span>Application started successfully</span>
                    </div>
                    <div className="console-line info">
                      <span className="console-time">[{new Date().toLocaleTimeString()}]</span>
                      <span>UI components loaded: {chatMessages.length - 1} interactions</span>
                    </div>
                    <div className="console-line success">
                      <span className="console-time">[{new Date().toLocaleTimeString()}]</span>
                      <span>Ready for input</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </section>
          </>
        )}
      </motion.div>
    </div>
  );
}