import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  LogOut,
  Sparkles,
  Eye,
  Code2,
  ArrowRight,
  Send,
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
  PanelLeftOpen,
  PanelLeftClose,
  Search,
} from "lucide-react";
import {
  generateCode as generateCodeRequest,
  getHistory,
  deleteHistory,
  toggleFavourite,
  getProjectByShareId,
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
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const { shareId } = useParams();
  const [loadedShareId, setLoadedShareId] = useState(null);

  useEffect(() => {
    if (theme !== "dark" && typeof toggleTheme === "function") {
      toggleTheme();
    }
  }, [theme, toggleTheme]);
  
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
  const isGeneratingRef = useRef(false);

  const [isHistoryOpen, setIsHistoryOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [historyData, setHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [projectName, setProjectName] = useState("Untitled Project");
  const [activeCodeTab, setActiveCodeTab] = useState("html");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleLogout = () => {
    logout();
    addToast("Signed out successfully", "success");
    navigate("/login");
  };

  const handleNewChat = useCallback(() => {
    setPrompt("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    setCodeHistory([]);
    setCurrentHistoryIndex(-1);
    setError("");
    setActiveTab("preview");
    setIsActive(false);
    setConsoleLogs([]);
    setProjectName("Untitled Project");
    setLoadedShareId(null);
    setChatMessages([
      {
        id: "assistant-welcome",
        role: "assistant",
        text: "Describe what you want to build, and I'll generate the UI code for you.",
      },
    ]);
    if (window.location.pathname !== "/builder") {
      navigate("/builder");
    }
  }, [navigate]);

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

  // Load project by shareId from URL on mount or URL change
  useEffect(() => {
    if (shareId) {
      if (shareId === loadedShareId) return;

      const loadProject = async () => {
        try {
          setLoading(true);
          const res = await getProjectByShareId(shareId);
          const project = res.data;

          setIsActive(true);
          setChatMessages([
            { id: `loaded-${project.id}`, role: "user", text: project.prompt },
            { id: `loaded-res-${project.id}`, role: "assistant", text: "I've restored this project for you." },
          ]);
          setCodeHistory([project.generated_code]);
          setCurrentHistoryIndex(0);
          setLoadedShareId(project.share_id);
          setProjectName(project.prompt.length > 30 ? project.prompt.substring(0, 30) + "..." : project.prompt);
          setActiveTab("preview");
          setConsoleLogs([]);
        } catch (err) {
          console.error("Failed to load project", err);
          setError("Failed to load project or project not found.");
          navigate("/builder");
        } finally {
          setLoading(false);
        }
      };
      loadProject();
    } else {
      if (loadedShareId) {
        handleNewChat();
      }
    }
  }, [shareId, loadedShareId, handleNewChat, navigate]);

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

  const handleDeleteHistory = (item, e) => {
    e.stopPropagation();
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteHistory(itemToDelete.id);
      setHistoryData((prev) => prev.filter((h) => h.id !== itemToDelete.id));
      addToast("Project deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete history", err);
      addToast("Failed to delete project", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
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
    setLoadedShareId(item.share_id);
    setProjectName(item.prompt.length > 30 ? item.prompt.substring(0, 30) + "..." : item.prompt);
    setActiveTab("preview");
    setConsoleLogs([]);
    setIsHistoryOpen(false);
    navigate(`/builder/${item.share_id}`);
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
    if (loading || isGeneratingRef.current) return;
    const trimmedPrompt = promptText.trim();
    if (!trimmedPrompt) {
      setError("Please enter a prompt");
      return;
    }

    if (!isActive) {
      setIsActive(true);
    }

    isGeneratingRef.current = true;
    const timestamp = Date.now();

    setChatMessages((prev) => [
      ...prev,
      { id: `user-${timestamp}`, role: "user", text: trimmedPrompt },
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

      if (data.shareId) {
        setLoadedShareId(data.shareId);
        navigate(`/builder/${data.shareId}`, { replace: true });
      }

      if (projectName === "Untitled Project") {
        setProjectName(trimmedPrompt.length > 30 ? trimmedPrompt.substring(0, 30) + "..." : trimmedPrompt);
      }

      setChatMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: "Done! You can preview the result or ask for changes." }
      ]);
    } catch (err) {
      const errorMessage = err?.response?.data?.message || err?.message || "Failed to generate. Try again.";
      setError(errorMessage);
      setChatMessages((prev) => [
        ...prev,
        { id: `assistant-${Date.now()}`, role: "assistant", text: errorMessage }
      ]);
    } finally {
      isGeneratingRef.current = false;
      setLoading(false);
    }
  };

  const handleCenterSubmit = () => {
    if (prompt.trim() && !loading) {
      handleGenerate();
    }
  };

  const handleCenterKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!loading) {
        handleCenterSubmit();
      }
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
      if (!loading) {
        handleGenerate();
      }
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
      {/* Main Shell */}
      <motion.div
        className={`builder-shell ${!isActive ? "is-empty" : "is-active"} ${isHistoryOpen ? "has-sidebar" : ""}`}
        ref={shellRef}
        style={{ "--builder-left-width": `${leftPaneWidth}%` }}
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* Collapsible Left Library Sidebar */}
        <aside className={`library-sidebar ${!isHistoryOpen ? "is-collapsed" : ""}`}>
          <div className="library-sidebar-head">
            <div className="head-title">
              <Sparkles size={16} className="sparkles-icon" />
              <h2>Library</h2>
            </div>
            <button 
              className="icon-btn sidebar-toggle-close" 
              onClick={() => setIsHistoryOpen(false)}
              title="Close Sidebar"
            >
              <PanelLeftClose size={16} />
            </button>
          </div>

          <div className="library-sidebar-actions">
            <button className="library-new-btn liquid-glass" onClick={handleNewChat}>
              <Plus size={14} />
              <span>New Project</span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="library-search-wrap">
            <Search size={13} className="search-icon" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="library-search-input"
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery("")}>
                <X size={10} />
              </button>
            )}
          </div>

          <div className="library-sidebar-tabs">
            <button
              className={`library-sidebar-tab ${libraryTab === "all" ? "active" : ""}`}
              onClick={() => setLibraryTab("all")}
            >
              All
            </button>
            <button
              className={`library-sidebar-tab ${libraryTab === "liked" ? "active" : ""}`}
              onClick={() => setLibraryTab("liked")}
            >
              Liked
            </button>
          </div>

          <div className="library-sidebar-content">
            {historyLoading ? (
              <div className="library-loading">
                <span className="library-spinner-glow"></span>
              </div>
            ) : (() => {
              const filtered = libraryTab === "all"
                ? historyData
                : historyData.filter((item) => item.is_favourite);

              const filteredHistory = filtered.filter((item) =>
                item.prompt.toLowerCase().includes(searchQuery.toLowerCase())
              );

              if (!Array.isArray(filteredHistory) || filteredHistory.length === 0) {
                return (
                  <div className="library-empty">
                    {libraryTab === "all" ? (
                      <>
                        <History size={24} />
                        <p>No saved projects.</p>
                      </>
                    ) : (
                      <>
                        <Heart size={24} />
                        <p>No liked projects.</p>
                      </>
                    )}
                  </div>
                );
              }

              return (
                <div className="library-list">
                  {filteredHistory.map((item, index) => (
                    <motion.div
                      key={item.id}
                      className="library-item"
                      onClick={() => handleLoadHistory(item)}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                    >
                      <div className="library-item-content">
                        <span className="library-item-prompt">{item.prompt}</span>
                        <span className="library-item-date">
                          {new Date(item.created_at).toLocaleDateString(undefined, {
                            month: "short", day: "numeric"
                          })}
                        </span>
                      </div>
                      <div className="library-item-actions">
                        <button className="action-btn" onClick={(e) => handleToggleFavourite(item, e)}>
                          <Heart size={12} className={item.is_favourite ? "filled" : ""} />
                        </button>
                        <button className="action-btn delete-btn" onClick={(e) => handleDeleteHistory(item, e)}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Sidebar Profile Footer */}
          <div className="library-sidebar-footer">
            <div className="library-profile-info" onClick={() => navigate("/profile")}>
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt="Profile" className="library-avatar-img" />
              ) : user?.name ? (
                <span className="library-avatar-initial">{user.name.charAt(0).toUpperCase()}</span>
              ) : (
                <div className="library-avatar-icon"><User size={13} /></div>
              )}
              <div className="library-profile-text">
                <span className="library-profile-name">{user?.name || "Builder"}</span>
                <span className="library-profile-email">{user?.email || "builder@spark.sh"}</span>
              </div>
            </div>
            <button className="library-logout-btn icon-btn" onClick={handleLogout} title="Sign Out">
              <LogOut size={14} />
            </button>
          </div>
        </aside>

        {/* ===== INITIAL STATE: CENTERED CHAT ===== */}
        {!isActive && (
          <div className="builder-center-chat-container">
            {!isHistoryOpen && (
              <button 
                className="floating-sidebar-toggle-btn icon-btn" 
                onClick={() => setIsHistoryOpen(true)}
                title="Open Sidebar"
              >
                <PanelLeftOpen size={16} />
              </button>
            )}
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
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4), 0 0 45px rgba(255, 255, 255, 0.05)",
                    borderColor: "var(--builder-border)"
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
                      className={`center-chat-send ${prompt.trim() ? "has-text" : ""}`}
                      onClick={handleCenterSubmit}
                      disabled={loading || !prompt.trim()}
                      animate={
                        prompt.trim()
                          ? {
                              boxShadow: "0 0 0 3.5px rgba(255, 255, 255, 0.45), 0 0 16px rgba(255, 255, 255, 0.45)",
                              scale: 1.02,
                            }
                          : {
                              boxShadow: "0 0 0 0px rgba(255, 255, 255, 0), 0 4px 10px rgba(0, 0, 0, 0.15)",
                              scale: 1,
                            }
                      }
                      whileHover={!loading && prompt.trim() ? { scale: 1.08, boxShadow: "0 0 0 4.5px rgba(255, 255, 255, 0.55), 0 0 22px rgba(255, 255, 255, 0.55)" } : {}}
                      whileTap={!loading && prompt.trim() ? { scale: 0.95 } : {}}
                    >
                      {loading ? <span className="center-chat-spinner" /> : <Send size={15} style={{ transform: "translate(0.5px, -0.5px)" }} />}
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
          </div>
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
                  {!isHistoryOpen && (
                    <button 
                      className="sidebar-toggle-open-btn icon-btn" 
                      onClick={() => setIsHistoryOpen(true)}
                      title="Open Sidebar"
                    >
                      <PanelLeftOpen size={15} />
                    </button>
                  )}
                  <div className="builder-project-name-wrapper">
                    <input
                      ref={projectNameInputRef}
                      type="text"
                      className="builder-project-name"
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
                      <Pencil size={11} className="project-name-edit-icon" />
                    </button>
                  </div>
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
                    <div />
                    <div className="builder-compose-submit">
                      <motion.button
                        className={`builder-send-btn ${prompt.trim() ? "has-text" : ""}`}
                        onClick={() => handleGenerate()}
                        disabled={loading || !prompt.trim()}
                        animate={
                          prompt.trim()
                            ? {
                                boxShadow: "0 0 0 3px rgba(255, 255, 255, 0.45), 0 0 12px rgba(255, 255, 255, 0.45)",
                                scale: 1.02,
                              }
                            : {
                                boxShadow: "0 0 0 0px rgba(255, 255, 255, 0), 0 4px 8px rgba(0, 0, 0, 0.15)",
                                scale: 1,
                              }
                        }
                        whileHover={!loading && prompt.trim() ? { scale: 1.08, boxShadow: "0 0 0 4px rgba(255, 255, 255, 0.55), 0 0 18px rgba(255, 255, 255, 0.55)" } : {}}
                        whileTap={!loading && prompt.trim() ? { scale: 0.95 } : {}}
                      >
                        {loading ? <span className="builder-spinner" /> : <Send size={13} style={{ transform: "translate(0.5px, -0.5px)" }} />}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
                {error && !error.toLowerCase().includes("quota") && (
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

      {/* Custom Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmOpen && (
          <div className="modal-overlay">
            <motion.div 
              className="modal-card"
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="modal-head">
                <Trash2 size={20} className="modal-danger-icon" />
                <h3>Delete Project</h3>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this project? This action cannot be undone.</p>
              </div>
              <div className="modal-actions">
                <button 
                  className="modal-btn secondary" 
                  onClick={() => {
                    setDeleteConfirmOpen(false);
                    setItemToDelete(null);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="modal-btn danger" 
                  onClick={handleConfirmDelete}
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}