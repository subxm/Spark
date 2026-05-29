import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  LogOut,
  Sparkles,
  Eye,
  Code2,
  MessageSquare,
  ArrowRight,
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
  PanelRightOpen,
  User,
  Sun,
  Moon,
  Wand2,
  Pencil,
  Plus,
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

// Helper function to split HTML/CSS/JS/React code chunks
const getSplitCode = (code, framework) => {
  if (!code) return { html: "", css: "", js: "", react: "" };
  
  // Extract CSS
  const cssMatch = code.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
  const css = cssMatch ? cssMatch[1].trim() : "";
  
  // Extract JS
  const jsMatch = code.match(/<script[^>]*>([\s\S]*?)<\/script>/i);
  const js = jsMatch ? jsMatch[1].trim() : "";
  
  // Extract HTML body
  const bodyMatch = code.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let html = bodyMatch ? bodyMatch[1].trim() : code;
  
  // Strip style and script tags from HTML preview tab
  html = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.trim();
  
  // Convert HTML class names to JSX syntax
  let jsx = html.replace(/class=/g, 'className=');
  jsx = jsx.replace(/onclick=/g, 'onClick=');
  jsx = jsx.replace(/onchange=/g, 'onChange=');
  jsx = jsx.replace(/for=/g, 'htmlFor=');
  
  const react = `import React from 'react';
${framework === 'tailwind' ? '' : "import './style.css';"}

export default function Component() {
  ${js ? `React.useEffect(() => {
    ${js.split('\n').map(line => '    ' + line).join('\n')}
  }, []);` : ''}

  return (
    <div className="spark-wrapper">
      ${jsx.split('\n').map(line => '      ' + line).join('\n')}
    </div>
  );
}`;
  
  return { html, css, js, react };
};

export default function Builder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  
  const [prompt, setPrompt] = useState("");
  const [isActive, setIsActive] = useState(false);
  const framework = "css"; // 'css' or 'tailwind'
  const [consoleLogs, setConsoleLogs] = useState([]);

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
  const [libraryTab, setLibraryTab] = useState("all");
  const viewport = "desktop";
  const [copied, setCopied] = useState(false);
  const [leftPaneWidth, setLeftPaneWidth] = useState(38);
  const [isResizing, setIsResizing] = useState(false);
  
  const shellRef = useRef(null);
  const chatScrollRef = useRef(null);
  const textareaRef = useRef(null);
  const centerTextareaRef = useRef(null);
  const projectNameInputRef = useRef(null);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [projectName, setProjectName] = useState("Untitled Project");
  const [activeCodeTab, setActiveCodeTab] = useState("html");

  // Setup iframe console messages listener
  useEffect(() => {
    const handleIframeMessage = (event) => {
      if (event.data && event.data.type === "IFRAME_CONSOLE_LOG") {
        setConsoleLogs((prev) => [
          ...prev,
          {
            type: event.data.logType,
            message: event.data.message,
            time: new Date().toLocaleTimeString(),
          },
        ]);
      }
    };
    window.addEventListener("message", handleIframeMessage);
    return () => window.removeEventListener("message", handleIframeMessage);
  }, []);

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
    setConsoleLogs([]);
    setIsHistoryOpen(false);
  };

  const promptIdeas = [
    {
      label: "A modern SaaS pricing page",
      full: "Create a modern SaaS pricing page with three tiers: Free, Pro, and Enterprise. Each tier should have a card with a title, price, feature list with checkmarks, and a call-to-action button. Use a clean layout with subtle gradients, hover effects on cards, and a highlighted 'Most Popular' badge on the Pro tier. Include a toggle to switch between monthly and annual billing."
    },
    {
      label: "A task dashboard with kanban",
      full: "Build a task management dashboard with a kanban board layout. Include three columns: To Do, In Progress, and Done. Each column should have draggable task cards showing a title, priority label (High/Medium/Low with color coding), assignee avatar, and due date. Add a top bar with a search input, filter dropdowns, and a 'New Task' button. Use a clean modern design with rounded corners and subtle shadows."
    },
    {
      label: "A portfolio with hero section",
      full: "Design a personal portfolio page with a full-width hero section featuring a large heading with the name, a short tagline, and a call-to-action button. Below the hero, include a grid of project cards with thumbnail images, project titles, short descriptions, and tech stack tags. Add a skills section with progress bars or icon badges, and a contact form at the bottom with name, email, and message fields. Use smooth scroll animations and a dark modern aesthetic."
    },
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
    setConsoleLogs([]); // Reset console logs for a new generation

    if (textareaRef.current) textareaRef.current.style.height = "auto";
    if (centerTextareaRef.current) centerTextareaRef.current.style.height = "auto";

    setLoading(true);
    setError("");

    try {
      // Send the current code block context to backend if it exists
      const res = await generateCodeRequest(trimmedPrompt, generatedCode || null, framework);
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



  const handleExportHTML = () => {
    const blob = new Blob([generatedCode], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, '-').toLowerCase()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };


  const handleNewChat = () => {
    setPrompt("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setCodeHistory([]);
    setCurrentHistoryIndex(-1);
    setError("");
    setActiveTab("preview");
    setIsActive(false);
    setConsoleLogs([]);
    setProjectName("Untitled Project");
    setChatMessages([
      {
        id: "assistant-welcome",
        role: "assistant",
        text: "Describe what you want to build, and I'll generate the UI code for you.",
      },
    ]);
  };

  const handleFocusProjectName = () => {
    if (projectNameInputRef.current) {
      projectNameInputRef.current.focus();
      projectNameInputRef.current.select();
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
      centerTextareaRef.current.style.height = `${Math.min(centerTextareaRef.current.scrollHeight, 350)}px`;
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
  }, [generatedCode, activeTab, activeCodeTab]);

  // Console logging interceptor script injected into the iframe
  const consoleInterceptor = `
    <script>
      (function() {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        
        const sendLog = (type, args) => {
          window.parent.postMessage({
            type: 'IFRAME_CONSOLE_LOG',
            logType: type,
            message: Array.from(args).map(arg => {
              if (typeof arg === 'object') {
                try { return JSON.stringify(arg); } catch (e) { return String(arg); }
              }
              return String(arg);
            }).join(' ')
          }, '*');
        };
        
        console.log = function() {
          sendLog('log', arguments);
          originalLog.apply(console, arguments);
        };
        console.error = function() {
          sendLog('error', arguments);
          originalError.apply(console, arguments);
        };
        console.warn = function() {
          sendLog('warn', arguments);
          originalWarn.apply(console, arguments);
        };
        
        window.addEventListener('error', function(e) {
          sendLog('error', [e.message + ' at ' + e.filename + ':' + e.lineno]);
        });
      })();
    </script>
  `;

  const previewDoc = (() => {
    if (!generatedCode) return "";
    const frameReset = "<style>html,body{margin:0 !important;padding:0 !important;min-height:100%;}body{box-sizing:border-box;}</style>";
    const injectedScripts = frameReset + consoleInterceptor;
    if (/<head[\s>]/i.test(generatedCode)) {
      return generatedCode.replace(/<head([^>]*)>/i, `<head$1>${injectedScripts}`);
    }
    return `<!doctype html><html><head>${injectedScripts}</head><body>${generatedCode}</body></html>`;
  })();

  // Code tab splitting
  const splitCode = getSplitCode(generatedCode, framework);
  
  const codeToDisplay = (() => {
    if (activeCodeTab === "html") return splitCode.html || generatedCode;
    if (activeCodeTab === "css") return splitCode.css || "/* No custom CSS in this component */";
    if (activeCodeTab === "js") return splitCode.js || "// No custom JavaScript in this component";
    if (activeCodeTab === "react") return splitCode.react;
    return generatedCode;
  })();

  const displayLanguage = (() => {
    if (activeCodeTab === "html") return "html";
    if (activeCodeTab === "css") return "css";
    if (activeCodeTab === "js") return "javascript";
    if (activeCodeTab === "react") return "jsx";
    return "html";
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
          <div className="topnav-logo" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
            <span>Spark</span>
          </div>
        </div>
        <div className="topnav-center">
          <div className="topnav-project-name-wrapper">
            <input
              ref={projectNameInputRef}
              type="text"
              className="topnav-project-name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project name..."
            />
            <button
              type="button"
              className="project-name-edit-btn"
              onClick={handleFocusProjectName}
              title="Rename Project"
            >
              <Pencil size={12} className="project-name-edit-icon" />
            </button>
          </div>
        </div>
        <div className="topnav-right">
          {generatedCode && (
            <motion.button
              className="topnav-btn"
              onClick={handleExportHTML}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download size={15} /> Export
            </motion.button>
          )}
          
          <motion.button
            className="topnav-btn icon-only"
            onClick={toggleTheme}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="Toggle Theme"
          >
            {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
          </motion.button>

          <motion.button
            className="topnav-btn icon-only profile-avatar-nav-btn"
            onClick={() => navigate("/profile")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            title="My Profile"
          >
            {user?.avatar_url ? (
              <img src={user.avatar_url} alt="Profile" className="nav-avatar-img" />
            ) : user?.name ? (
              <span className="nav-avatar-initial">{user.name.charAt(0).toUpperCase()}</span>
            ) : (
              <User size={16} />
            )}
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
              <div className="history-sidebar-tabs">
                <button
                  className={`history-sidebar-tab ${libraryTab === "all" ? "active" : ""}`}
                  onClick={() => setLibraryTab("all")}
                >
                  All
                </button>
                <button
                  className={`history-sidebar-tab ${libraryTab === "liked" ? "active" : ""}`}
                  onClick={() => setLibraryTab("liked")}
                >
                  Liked
                </button>
              </div>
              <div className="history-sidebar-content">
                {historyLoading ? (
                  <div className="history-loading">
                    <span className="spinner"></span>
                  </div>
                ) : (() => {
                  const filtered = libraryTab === "all"
                    ? historyData
                    : historyData.filter((item) => item.is_favourite);

                  if (!Array.isArray(filtered) || filtered.length === 0) {
                    return (
                      <div className="history-empty">
                        {libraryTab === "all" ? (
                          <>
                            <History size={32} />
                            <p>No saved projects yet.</p>
                            <span>Generations will appear here.</span>
                          </>
                        ) : (
                          <>
                            <Heart size={32} />
                            <p>No liked projects yet.</p>
                            <span>Click the heart icon on any project to see it here.</span>
                          </>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div className="history-grid">
                      {filtered.map((item, index) => (
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
                  );
                })()}
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
                whileHover={{
                  scale: 1.05,
                  boxShadow: theme === "dark"
                    ? "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 45px rgba(216, 161, 65, 0.15)"
                    : "0 10px 30px rgba(185, 134, 48, 0.12), 0 0 45px var(--accent-soft)",
                  borderColor: "var(--builder-accent)"
                }}
                transition={{ duration: 0.2 }}
              >
                <Wand2 size={28} />
              </motion.div>
              <motion.h1 className="center-chat-title" variants={itemVariants}>
                What will you build today?
              </motion.h1>
              <motion.p className="center-chat-subtitle" variants={itemVariants}>
                Create stunning UIs with AI.
              </motion.p>
            </motion.div>

            <motion.div className="center-chat-input-wrap" variants={itemVariants}>
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
                  </div>
                  <motion.button
                    className="center-chat-send"
                    onClick={handleCenterSubmit}
                    disabled={loading || !prompt.trim()}
                    whileHover={!loading && !prompt.trim() ? {} : { scale: 1.05 }}
                    whileTap={!loading && !prompt.trim() ? {} : { scale: 0.95 }}
                  >
                    {loading ? <span className="center-chat-spinner" /> : <ArrowRight size={18} />}
                  </motion.button>
                </div>
              </motion.div>

              <motion.div className="center-chat-ideas" variants={itemVariants}>
                {promptIdeas.map((idea, index) => (
                  <motion.button
                    key={idea.label}
                    className="center-chat-idea"
                    onClick={() => setPrompt(idea.full)}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {idea.label}
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
                <div className="builder-left-head-title-wrap">
                  <span className="active-dot" />
                  <p className="welcome-text">Welcome, {user?.name || "Builder"}</p>
                </div>
                <div style={{ display: "flex", gap: "0.45rem" }}>
                  <motion.button
                    className="builder-header-btn"
                    onClick={handleNewChat}
                    title="New Chat"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Plus size={16} />
                  </motion.button>
                </div>
              </motion.div>

              <div className="builder-upper-area">
                <section className="builder-chat-panel" ref={chatScrollRef}>
                  <AnimatePresence>
                    {chatMessages.map((message, index) => {
                      const isUser = message.role === "user";
                      return (
                        <motion.article
                          key={message.id}
                          className={`builder-chat-item ${isUser ? "user" : "assistant"}`}
                          initial={{ opacity: 0, y: 10, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ duration: 0.3, delay: index * 0.02 }}
                        >
                          <div className="builder-chat-avatar-wrap">
                            {isUser ? (
                              user?.avatar_url ? (
                                <img src={user.avatar_url} alt="You" className="chat-avatar-img" />
                              ) : (
                                <div className="chat-avatar-initial">
                                  {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                                </div>
                              )
                            ) : (
                              <div className="chat-avatar-spark">
                                <Sparkles size={13} />
                              </div>
                            )}
                          </div>
                          <div className="builder-chat-content">
                            <span className="builder-chat-role">{isUser ? "You" : "Spark"}</span>
                            <p className="builder-chat-text">{message.text}</p>
                          </div>
                        </motion.article>
                      );
                    })}
                  </AnimatePresence>
                  {loading && (
                    <motion.div
                      className="builder-chat-item assistant typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <div className="builder-chat-avatar-wrap">
                        <div className="chat-avatar-spark">
                          <Sparkles size={13} />
                        </div>
                      </div>
                      <div className="builder-chat-content">
                        <span className="builder-chat-role">Spark</span>
                        <div className="typing-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </section>
              </div>

              <div className="builder-bottom-area">
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
                    placeholder="Ask Spark to edit or create..."
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
                    </div>
                    <div className="builder-compose-submit">
                      {generatedCode && (
                        <motion.button
                          className="builder-clear-link"
                          onClick={handleNewChat}
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
                        {loading ? <span className="builder-spinner" /> : <ArrowRight size={16} />}
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
                <h2>Preview & Workspace</h2>
                <div className="builder-right-head-actions">
                  {generatedCode && (
                    <>
                      <motion.button
                        className="builder-right-head-btn"
                        onClick={handleCopyCode}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Copy size={14} /> {copied ? "Copied" : "Copy Full Code"}
                      </motion.button>
                      <motion.button
                        className="builder-right-head-btn"
                        onClick={handleExportHTML}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <Download size={14} /> Export
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
                      <button className="code-action-btn" onClick={() => {
                        navigator.clipboard.writeText(codeToDisplay);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}>
                        <Copy size={14} /> {copied ? "Copied!" : "Copy Section"}
                      </button>
                    </div>
                  </div>
                  <pre className={`builder-code-block ${loading ? "is-generating" : ""}`}>
                    <code className={`language-${displayLanguage}`}>{codeToDisplay}</code>
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
                      <FileText size={14} /> Console Logs
                    </div>
                    <button className="console-clear-btn" onClick={() => setConsoleLogs([])}>
                      Clear
                    </button>
                  </div>
                  <div className="console-output">
                    {consoleLogs.length === 0 ? (
                      <div className="console-empty">
                        <span className="console-time">[{new Date().toLocaleTimeString()}]</span>
                        <span className="console-msg-info">Console is clean. No errors or logs captured from the preview.</span>
                      </div>
                    ) : (
                      consoleLogs.map((log, index) => (
                        <div key={index} className={`console-line ${log.type}`}>
                          <span className="console-time">[{log.time}]</span>
                          <span className="console-msg">{log.message}</span>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </section>
          </>
        )}
      </motion.div>

      {/* Floating Library Button - Bottom Left */}
      <motion.button
        className="builder-floating-library"
        onClick={() => setIsHistoryOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        title="Projects Library"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Library size={20} />
      </motion.button>
    </div>
  );
}