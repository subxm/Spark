import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Grid3X3,
  List,
  Settings,
  LayoutDashboard,
  Heart,
  Zap,
  Clock,
  ExternalLink,
  Copy,
  Download,
  Trash2,
  Star,
  MoreHorizontal,
  Edit3,
  Plus,
  ArrowLeft,
  Camera,
  Check,
  X,
  FolderOpen,
  Image,
  Calendar,
  BarChart3,
  ChevronDown,
  RefreshCw,
  FolderPlus,
} from "lucide-react";
import {
  getProfileStats,
  getAllGenerations,
  deleteHistory,
  toggleFavourite,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

// ─── Animation Variants ──────────────────────────────────────────────────────

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.06 } },
};

const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

// ─── Skeleton Loaders ────────────────────────────────────────────────────────

function Skeleton({ className = "" }) {
  return <div className={`profile-skeleton ${className}`} />;
}

function StatsSkeleton() {
  return (
    <div className="profile-stats-grid">
      {[0, 1, 2].map((i) => (
        <div key={i} className="profile-stat-card">
          <Skeleton className="skel-icon" />
          <Skeleton className="skel-num" />
          <Skeleton className="skel-label" />
        </div>
      ))}
    </div>
  );
}

function ProjectSkeleton() {
  return (
    <div className="profile-project-card">
      <Skeleton className="skel-thumb" />
      <div className="profile-card-body">
        <Skeleton className="skel-title" />
        <Skeleton className="skel-meta" />
      </div>
    </div>
  );
}

function GenerationSkeleton() {
  return (
    <div className="profile-gen-row">
      <Skeleton className="skel-gen-thumb" />
      <div className="profile-gen-info">
        <Skeleton className="skel-gen-prompt" />
        <Skeleton className="skel-gen-meta" />
      </div>
      <Skeleton className="skel-gen-actions" />
    </div>
  );
}

// ─── Tab Navigation ─────────────────────────────────────────────────────────

const TABS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "projects", label: "My Projects", icon: FolderOpen },
  { id: "generations", label: "All Generations", icon: Zap },
  { id: "settings", label: "Settings", icon: Settings },
];

function TabNav({ activeTab, onTabChange }) {
  return (
    <motion.div
      className="profile-tab-nav"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <motion.button
            key={tab.id}
            className={`profile-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon size={15} />
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                className="profile-tab-indicator"
                layoutId="tab-indicator"
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

// ─── Stats Cards ─────────────────────────────────────────────────────────────

function StatsCards({ stats, loading }) {
  const cards = [
    {
      label: "Total Generations",
      value: stats?.totalGenerations ?? 0,
      icon: Zap,
      color: "#d8a141",
      bg: "rgba(216,161,65,0.1)",
    },
    {
      label: "Projects",
      value: stats?.projects ?? 0,
      icon: FolderOpen,
      color: "#7db8d4",
      bg: "rgba(125,184,212,0.1)",
    },
    {
      label: "Favorites",
      value: stats?.favorites ?? 0,
      icon: Heart,
      color: "#d47f8a",
      bg: "rgba(212,127,138,0.1)",
    },
  ];

  if (loading) return <StatsSkeleton />;

  return (
    <motion.div
      className="profile-stats-grid"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {cards.map((card, i) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.label}
            className="profile-stat-card"
            variants={fadeUp}
            whileHover={{ y: -3, transition: { duration: 0.2 } }}
          >
            <div
              className="profile-stat-icon"
              style={{ background: card.bg, color: card.color }}
            >
              <Icon size={18} />
            </div>
            <div className="profile-stat-body">
              <span className="profile-stat-value">{card.value}</span>
              <span className="profile-stat-label">{card.label}</span>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

// ─── Mini Preview ────────────────────────────────────────────────────────────

function MiniPreview({ code }) {
  const frameRef = useRef(null);

  useEffect(() => {
    if (!frameRef.current || !code) return;
    try {
      const reset =
        "<style>html,body{margin:0!important;padding:0!important;overflow:hidden;height:100%;}*{box-sizing:border-box}</style>";
      if (/<head[\s>]/i.test(code)) {
        frameRef.current.srcdoc = code.replace(
          /<head([^>]*)>/i,
          `<head$1>${reset}`,
        );
      } else {
        frameRef.current.srcdoc = `<!doctype html><html><head>${reset}</head><body>${code}</body></html>`;
      }
    } catch {
      // fallback - silent
    }
  }, [code]);

  return (
    <div className="profile-card-preview">
      <iframe
        ref={frameRef}
        title="preview"
        sandbox="allow-scripts"
        className="profile-preview-frame"
      />
      <div className="profile-preview-overlay" />
    </div>
  );
}

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({ item, onLoad, onDelete, onFav, onRename, onExport }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [renameVal, setRenameVal] = useState(item.prompt);
  const menuRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleRenameConfirm = () => {
    if (renameVal.trim()) {
      onRename(item, renameVal.trim());
    }
    setRenaming(false);
  };

  return (
    <motion.div
      className="profile-project-card"
      variants={fadeUp}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      layout
    >
      <div className="profile-card-thumb-wrap" onClick={() => onLoad(item)}>
        {item.generated_code ? (
          <MiniPreview code={item.generated_code} />
        ) : (
          <div className="profile-card-thumb-placeholder">
            <Sparkles size={20} />
          </div>
        )}
        <div className="profile-card-thumb-overlay">
          <ExternalLink size={16} />
          <span>Open</span>
        </div>
        {item.is_favourite && (
          <div className="profile-card-fav-badge">
            <Heart size={12} className="filled" />
          </div>
        )}
      </div>

      <div className="profile-card-body">
        {renaming ? (
          <div className="profile-rename-row">
            <input
              autoFocus
              value={renameVal}
              onChange={(e) => setRenameVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRenameConfirm();
                if (e.key === "Escape") setRenaming(false);
              }}
              className="profile-rename-input"
            />
            <button className="rename-confirm" onClick={handleRenameConfirm}>
              <Check size={12} />
            </button>
            <button className="rename-cancel" onClick={() => setRenaming(false)}>
              <X size={12} />
            </button>
          </div>
        ) : (
          <p className="profile-card-title" title={item.prompt}>
            {item.prompt}
          </p>
        )}
        <div className="profile-card-meta">
          <span className="meta-item">
            <Clock size={11} />
            {new Date(item.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      <div className="profile-card-actions" ref={menuRef}>
        <motion.button
          className="card-action-btn"
          onClick={() => setMenuOpen((o) => !o)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <MoreHorizontal size={15} />
        </motion.button>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="profile-card-menu"
              initial={{ opacity: 0, scale: 0.92, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: -4 }}
              transition={{ duration: 0.15 }}
            >
              <button onClick={() => { onLoad(item); setMenuOpen(false); }}>
                <ExternalLink size={13} /> Open in Builder
              </button>
              <button onClick={() => { onExport(item); setMenuOpen(false); }}>
                <Download size={13} /> Export HTML
              </button>
              <button
                onClick={() => {
                  onFav(item);
                  setMenuOpen(false);
                }}
              >
                <Heart size={13} className={item.is_favourite ? "filled" : ""} />
                {item.is_favourite ? "Unfavorite" : "Favorite"}
              </button>
              <button
                onClick={() => {
                  setRenaming(true);
                  setMenuOpen(false);
                }}
              >
                <Edit3 size={13} /> Rename
              </button>
              <button
                className="danger"
                onClick={() => {
                  onDelete(item);
                  setMenuOpen(false);
                }}
              >
                <Trash2 size={13} /> Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Generation Card (List view) ─────────────────────────────────────────────

function GenerationCard({ item, onLoad, onDelete, onFav, onExport }) {
  return (
    <motion.div
      className="profile-gen-row"
      variants={fadeUp}
      whileHover={{ x: 3, transition: { duration: 0.18 } }}
      layout
    >
      <div className="profile-gen-thumb-wrap" onClick={() => onLoad(item)}>
        {item.generated_code ? (
          <MiniPreview code={item.generated_code} />
        ) : (
          <div className="profile-gen-thumb-placeholder">
            <Sparkles size={14} />
          </div>
        )}
      </div>

      <div className="profile-gen-info" onClick={() => onLoad(item)}>
        <p className="profile-gen-prompt">{item.prompt}</p>
        <div className="profile-gen-meta">
          <span className="meta-item">
            <Calendar size={11} />
            {new Date(item.created_at).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          <span className="meta-item">
            <Zap size={11} />
            Gemini 2.5 Flash
          </span>
        </div>
      </div>

      <div className="profile-gen-actions">
        <motion.button
          className="gen-action-btn"
          title="Open in Builder"
          onClick={() => onLoad(item)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ExternalLink size={14} />
        </motion.button>
        <motion.button
          className={`gen-action-btn ${item.is_favourite ? "faved" : ""}`}
          title={item.is_favourite ? "Unfavorite" : "Favorite"}
          onClick={() => onFav(item)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart size={14} className={item.is_favourite ? "filled" : ""} />
        </motion.button>
        <motion.button
          className="gen-action-btn"
          title="Export"
          onClick={() => onExport(item)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Copy size={14} />
        </motion.button>
        <motion.button
          className="gen-action-btn danger"
          title="Delete"
          onClick={() => onDelete(item)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Trash2 size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ─── Empty States ────────────────────────────────────────────────────────────

function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="profile-empty-state"
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="profile-empty-icon">
        <Icon size={28} />
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action && (
        <motion.button
          className="profile-empty-cta"
          onClick={action.onClick}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {action.icon && <action.icon size={15} />}
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
}

// ─── Tab Panels ─────────────────────────────────────────────────────────────

function OverviewTab({ stats, recentItems, onLoadItem }) {
  return (
    <motion.div
      className="profile-tab-panel"
      key="overview"
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <div className="profile-section-head">
        <h2>
          <BarChart3 size={18} /> Stats Overview
        </h2>
      </div>
      <StatsCards stats={stats} loading={false} />

      <div className="profile-section-head" style={{ marginTop: "2rem" }}>
        <h2>
          <Clock size={18} /> Recent Activity
        </h2>
      </div>
      {recentItems.length === 0 ? (
        <EmptyState
          icon={Zap}
          title="No recent activity"
          description="Your recent generations will appear here."
        />
      ) : (
        <div className="profile-recent-list">
          {recentItems.slice(0, 5).map((item) => (
            <motion.div
              key={item.id}
              className="profile-recent-item"
              onClick={() => onLoadItem(item)}
              whileHover={{ x: 3 }}
            >
              <div className="recent-thumb">
                {item.generated_code ? (
                  <MiniPreview code={item.generated_code} />
                ) : (
                  <div className="recent-thumb-placeholder">
                    <Sparkles size={12} />
                  </div>
                )}
              </div>
              <div className="recent-info">
                <p className="recent-prompt">{item.prompt}</p>
                <span className="recent-time">
                  {new Date(item.created_at).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              {item.is_favourite && (
                <Heart size={12} className="recent-fav filled" />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function ProjectsTab({
  items,
  loading,
  onLoad,
  onDelete,
  onFav,
  onRename,
  onExport,
  onNewProject,
}) {
  if (loading) {
    return (
      <div className="profile-grid">
        {[0, 1, 2, 3, 4, 5].map((i) => <ProjectSkeleton key={i} />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={FolderOpen}
        title="No projects yet"
        description="Your generated projects will appear here as cards. Start building!"
        action={{ label: "Create New Project", icon: Plus, onClick: onNewProject }}
      />
    );
  }

  return (
    <div className="profile-grid">
      {items.map((item) => (
        <ProjectCard
          key={item.id}
          item={item}
          onLoad={onLoad}
          onDelete={onDelete}
          onFav={onFav}
          onRename={onRename}
          onExport={onExport}
        />
      ))}
    </div>
  );
}

function GenerationsTab({
  items,
  loading,
  viewMode,
  onViewModeChange,
  onLoad,
  onDelete,
  onFav,
  onExport,
}) {
  if (loading) {
    return (
      <div className="profile-gen-list">
        {[0, 1, 2, 3, 4].map((i) => <GenerationSkeleton key={i} />)}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={Zap}
        title="No generations yet"
        description="Your generation history will appear here. Start by building something!"
      />
    );
  }

  return (
    <motion.div
      className="profile-tab-panel"
      key="generations"
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <div className="profile-gen-header">
        <span className="profile-gen-count">
          {items.length} generation{items.length !== 1 ? "s" : ""}
        </span>
        <div className="profile-view-toggle">
          <motion.button
            className={viewMode === "grid" ? "active" : ""}
            onClick={() => onViewModeChange("grid")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Grid3X3 size={14} />
          </motion.button>
          <motion.button
            className={viewMode === "list" ? "active" : ""}
            onClick={() => onViewModeChange("list")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <List size={14} />
          </motion.button>
        </div>
      </div>

      <div className={viewMode === "grid" ? "profile-grid" : "profile-gen-list"}>
        {items.map((item) =>
          viewMode === "grid" ? (
            <ProjectCard
              key={item.id}
              item={item}
              onLoad={onLoad}
              onDelete={onDelete}
              onFav={onFav}
              onRename={() => {}}
              onExport={onExport}
            />
          ) : (
            <GenerationCard
              key={item.id}
              item={item}
              onLoad={onLoad}
              onDelete={onDelete}
              onFav={onFav}
              onExport={onExport}
            />
          ),
        )}
      </div>
    </motion.div>
  );
}

function SettingsTab() {
  return (
    <motion.div
      className="profile-tab-panel"
      key="settings"
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <div className="profile-settings-wrap">
        <div className="profile-settings-section">
          <h3>Account Settings</h3>
          <p className="profile-settings-note">
            <Settings size={14} />
            Account settings are coming soon. You can manage your profile
            details below.
          </p>
        </div>
        <div className="profile-settings-placeholder">
          <div className="settings-placeholder-icon">
            <Settings size={24} />
          </div>
          <p>More settings will be available soon</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Profile Header ─────────────────────────────────────────────────────────

function ProfileHeader({ user }) {
  const joinDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })
    : "Recently";

  return (
    <motion.div
      className="profile-header"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <motion.button
        className="profile-back-btn"
        onClick={() => window.history.back()}
        whileHover={{ scale: 1.05, x: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <ArrowLeft size={16} />
      </motion.button>

      <motion.div
        className="profile-avatar-wrap"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.2 }}
      >
        <div className="profile-avatar">
          {user?.name ? (
            <span>{user.name.charAt(0).toUpperCase()}</span>
          ) : (
            <Camera size={22} />
          )}
        </div>
        <div className="profile-avatar-badge">
          <Camera size={11} />
        </div>
      </motion.div>

      <div className="profile-user-info">
        <h1 className="profile-user-name">
          {user?.name || "Spark Builder"}
        </h1>
        <p className="profile-user-email">{user?.email || ""}</p>
        <div className="profile-user-meta">
          <span className="meta-item">
            <Calendar size={12} />
            Joined {joinDate}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Profile Page ──────────────────────────────────────────────────────

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("projects");
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState(null);
  const [generations, setGenerations] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingGen, setLoadingGen] = useState(true);

  // Fetch stats
  useEffect(() => {
    getProfileStats()
      .then((res) => setStats(res.data))
      .catch(() => setStats({ totalGenerations: 0, projects: 0, favorites: 0 }))
      .finally(() => setLoadingStats(false));
  }, []);

  // Fetch all generations
  useEffect(() => {
    getAllGenerations()
      .then((res) => setGenerations(Array.isArray(res.data) ? res.data : []))
      .catch(() => setGenerations([]))
      .finally(() => setLoadingGen(false));
  }, []);

  const handleLoadItem = (item) => {
    // Navigate to builder with the generation loaded
    navigate("/builder", {
      state: {
        loadedGeneration: {
          id: item.id,
          prompt: item.prompt,
          code: item.generated_code,
        },
      },
    });
  };

  const handleDelete = async (item) => {
    if (!confirm("Delete this generation? This cannot be undone.")) return;
    try {
      await deleteHistory(item.id);
      setGenerations((prev) => prev.filter((g) => g.id !== item.id));
      if (stats) {
        setStats((s) => ({
          ...s,
          totalGenerations: Math.max(0, s.totalGenerations - 1),
          favorites: item.is_favourite
            ? Math.max(0, s.favorites - 1)
            : s.favorites,
        }));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleFav = async (item) => {
    try {
      await toggleFavourite(item.id);
      setGenerations((prev) =>
        prev.map((g) =>
          g.id === item.id ? { ...g, is_favourite: !g.is_favourite } : g,
        ),
      );
      if (stats) {
        setStats((s) => ({
          ...s,
          favorites: item.is_favourite
            ? Math.max(0, s.favorites - 1)
            : s.favorites + 1,
        }));
      }
    } catch (err) {
      console.error("Fav toggle failed:", err);
    }
  };

  const handleRename = (item, newTitle) => {
    // Optimistic update for now (backend rename endpoint can be added later)
    setGenerations((prev) =>
      prev.map((g) => (g.id === item.id ? { ...g, prompt: newTitle } : g)),
    );
  };

  const handleExport = (item) => {
    if (!item.generated_code) return;
    const blob = new Blob([item.generated_code], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.prompt.replace(/\s+/g, "-").substring(0, 40)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleNewProject = () => navigate("/builder");

  const recentItems = generations.slice(0, 10);

  return (
    <motion.div
      className="profile-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Page Nav */}
      <motion.nav
        className="profile-nav"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="profile-nav-left">
          <div className="profile-nav-logo">
            <Sparkles size={18} />
            <span>Spark</span>
          </div>
        </div>
        <div className="profile-nav-center" />
        <div className="profile-nav-right">
          <motion.button
            className="profile-nav-btn"
            onClick={() => navigate("/builder")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <Sparkles size={14} />
            Builder
          </motion.button>
          <motion.button
            className="profile-nav-btn"
            onClick={() => navigate("/")}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            <ArrowLeft size={14} />
            Home
          </motion.button>
        </div>
      </motion.nav>

      <div className="profile-content">
        {/* Sidebar / Header Area */}
        <aside className="profile-sidebar">
          <ProfileHeader user={user} />
          <StatsCards stats={stats} loading={loadingStats} />
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab
                key="overview"
                stats={stats}
                recentItems={recentItems}
                onLoadItem={handleLoadItem}
              />
            )}

            {activeTab === "projects" && (
              <ProjectsTab
                key="projects"
                items={generations}
                loading={loadingGen}
                onLoad={handleLoadItem}
                onDelete={handleDelete}
                onFav={handleFav}
                onRename={handleRename}
                onExport={handleExport}
                onNewProject={handleNewProject}
              />
            )}

            {activeTab === "generations" && (
              <GenerationsTab
                key="generations"
                items={generations}
                loading={loadingGen}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onLoad={handleLoadItem}
                onDelete={handleDelete}
                onFav={handleFav}
                onExport={handleExport}
              />
            )}

            {activeTab === "settings" && <SettingsTab key="settings" />}
          </AnimatePresence>
        </main>
      </div>
    </motion.div>
  );
}
