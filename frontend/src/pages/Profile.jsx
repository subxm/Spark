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
  Sun,
  Moon,
  Code2,
  LogOut,
} from "lucide-react";
import {
  getProfileStats,
  getAllGenerations,
  deleteHistory,
  toggleFavourite,
  updateProfile,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
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
  { id: "projects", label: "Projects", icon: FolderOpen },
  { id: "liked", label: "Liked", icon: Heart },
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
      color: "#ffffff",
      bg: "rgba(255, 255, 255, 0.08)",
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
      {cards.map((card) => {
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
      <div className="profile-gen-thumb-icon-wrap" onClick={() => onLoad(item)}>
        <Code2 size={16} />
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

function ActivityChart({ data }) {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className="profile-chart-card">
      <div className="profile-chart-head">
        <div>
          <h3>Generation Velocity</h3>
          <p className="section-subtitle" style={{ margin: 0 }}>Weekly UI building frequency</p>
        </div>
        <div className="profile-chart-summary">
          <span className="summary-value">{data.reduce((acc, d) => acc + d.count, 0)}</span>
          <span className="summary-label">this week</span>
        </div>
      </div>
      
      <div className="profile-chart-body">
        <div className="chart-y-axis">
          <span>{maxCount}</span>
          <span>{Math.round(maxCount / 2)}</span>
          <span>0</span>
        </div>
        
        <div className="chart-grid">
          {data.map((day, idx) => {
            const heightPercent = (day.count / maxCount) * 100;
            return (
              <div key={idx} className="chart-col">
                <div className="chart-bar-wrap">
                  <motion.div 
                    className="chart-bar"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max(heightPercent, 4)}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05, ease: "easeOut" }}
                  />
                  {day.count > 0 && (
                    <span className="chart-bar-tooltip">{day.count} UI{day.count > 1 ? 's' : ''}</span>
                  )}
                </div>
                <span className="chart-col-label">{day.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ recentItems, onLoadItem, onNewProject, activityData }) {
  return (
    <motion.div
      className="profile-tab-panel"
      key="overview"
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <ActivityChart data={activityData} />


      <div className="profile-section-head" style={{ marginTop: "1rem" }}>
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
              <div className="recent-thumb-icon">
                <Code2 size={16} />
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

function GenerationsTab({
  items,
  loading,
  viewMode,
  onViewModeChange,
  onLoad,
  onDelete,
  onFav,
  onExport,
  isLikedOnly = false,
  onNewProject,
  onRename,
}) {
  if (loading) {
    return (
      <div className={viewMode === "grid" ? "profile-grid" : "profile-gen-list"}>
        {[0, 1, 2, 3, 4, 5].map((i) =>
          viewMode === "grid" ? <ProjectSkeleton key={i} /> : <GenerationSkeleton key={i} />
        )}
      </div>
    );
  }

  if (items.length === 0) {
    return isLikedOnly ? (
      <EmptyState
        icon={Heart}
        title="No liked projects yet"
        description="Projects you favorite will appear here."
      />
    ) : (
      <EmptyState
        icon={FolderOpen}
        title="No projects yet"
        description="Your generated projects will appear here. Start building!"
        action={{ label: "Create New Project", icon: Plus, onClick: onNewProject }}
      />
    );
  }

  return (
    <motion.div
      className="profile-tab-panel"
      key={isLikedOnly ? "liked" : "projects"}
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <div className="profile-gen-header">
        <span className="profile-gen-count">
          {items.length} {isLikedOnly ? "liked project" : "project"}{items.length !== 1 ? "s" : ""}
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
              onRename={onRename}
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

function SettingsTab({ user, updateUser }) {
  const [username, setUsername] = useState(user?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const { addToast } = useToast();

  // Presets of beautiful avatars
  const PRESET_AVATARS = [
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Aneka",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Jack",
    "https://api.dicebear.com/7.x/pixel-art/svg?seed=Nala",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Sparky",
    "https://api.dicebear.com/7.x/bottts/svg?seed=Robo",
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      addToast("Image size must be under 2MB.", "error");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    if (newPassword && newPassword !== confirmPassword) {
      addToast("New passwords do not match.", "error");
      setSubmitting(false);
      return;
    }

    try {
      const payload = {
        name: username,
        avatar_url: avatarUrl,
      };

      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await updateProfile(payload);
      
      updateUser(res.data.user);
      addToast(res.data.message || "Profile updated successfully.", "success");
      
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error(err);
      addToast(
        err.response?.data?.message || "Failed to update profile. Please try again.",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      className="profile-tab-panel"
      key="settings"
      variants={fadeUp}
      initial="initial"
      animate="animate"
    >
      <form className="profile-settings-form" onSubmit={handleSave}>
        <div className="profile-settings-layout">
          
          {/* Avatar Section */}
          <div className="profile-settings-section card">
            <h3>Avatar Settings</h3>
            
            <div className="settings-avatar-flex">
              <div className="settings-avatar-preview-wrap">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar Preview" className="settings-avatar-preview" />
                ) : (
                  <div className="settings-avatar-placeholder">
                    {username ? username.charAt(0).toUpperCase() : "?"}
                  </div>
                )}
                {avatarUrl && (
                  <button 
                    type="button" 
                    className="delete-avatar-btn" 
                    onClick={() => setAvatarUrl("")}
                    title="Delete Avatar"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>

              <div className="settings-avatar-upload-box">
                <p>Upload a custom image or choose a preset</p>
                <div className="avatar-action-row">
                  <label className="settings-upload-btn">
                    <Camera size={14} />
                    <span>Upload Image</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileUpload} 
                      style={{ display: "none" }} 
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="presets-container">
              <span className="presets-label">Preset Avatars:</span>
              <div className="presets-grid">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`preset-btn ${avatarUrl === url ? "selected" : ""}`}
                    onClick={() => setAvatarUrl(url)}
                  >
                    <img src={url} alt={`Preset ${idx + 1}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Profile Details Section */}
          <div className="profile-settings-section card">
            <h3>Profile Details</h3>
            
            <div className="settings-fields-grid">
              <div className="settings-field-group">
                <label>Username</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="settings-input"
                />
              </div>

              <div className="settings-field-group">
                <label>Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="settings-input disabled"
                  title="Email cannot be changed"
                />
              </div>
            </div>
          </div>

          {/* Password Section */}
          <div className="profile-settings-section card">
            <h3>Change Password</h3>
            <p className="section-subtitle">Leave blank if you don't want to change your password</p>
            
            <div className="settings-fields-grid">
              <div className="settings-field-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="settings-input"
                />
              </div>

              <div className="settings-field-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="settings-input"
                />
              </div>

              <div className="settings-field-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="settings-input"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Save button */}
        <div className="settings-footer">
          <motion.button
            type="submit"
            disabled={submitting}
            className="settings-submit-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting ? (
              <>
                <RefreshCw size={14} className="spin-loader" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </motion.button>
        </div>

      </form>
    </motion.div>
  );
}

// ─── Profile Header ─────────────────────────────────────────────────────────

function ProfileHeader({ user }) {
  const navigate = useNavigate();
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
      <div className="profile-header-top-row">
        <motion.button
          className="profile-back-icon-btn"
          onClick={() => navigate("/builder")}
          whileHover={{ scale: 1.08, x: -2 }}
          whileTap={{ scale: 0.95 }}
          title="Back to Builder"
        >
          <ArrowLeft size={18} />
        </motion.button>
      </div>


      <motion.div
        className="profile-avatar-wrap"
        whileHover={{ scale: 1.04 }}
        transition={{ duration: 0.2 }}
      >
        <div className="profile-avatar">
          {user?.avatar_url ? (
            <img src={user.avatar_url} alt="Avatar" className="profile-avatar-img" />
          ) : user?.name ? (
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
  const { user, updateUser, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [viewMode, setViewMode] = useState("grid");
  const [stats, setStats] = useState(null);
  const [generations, setGenerations] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingGen, setLoadingGen] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    if (theme !== "dark" && typeof toggleTheme === "function") {
      toggleTheme();
    }
  }, [theme, toggleTheme]);

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
    // Navigate to builder with the project's share_id in URL
    navigate(`/builder/${item.share_id}`);
  };

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await deleteHistory(itemToDelete.id);
      setGenerations((prev) => prev.filter((g) => g.id !== itemToDelete.id));
      if (stats) {
        setStats((s) => ({
          ...s,
          totalGenerations: Math.max(0, s.totalGenerations - 1),
          favorites: itemToDelete.is_favourite
            ? Math.max(0, s.favorites - 1)
            : s.favorites,
        }));
      }
      addToast("Project deleted successfully", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      addToast("Failed to delete project", "error");
    } finally {
      setDeleteConfirmOpen(false);
      setItemToDelete(null);
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

  // Calculate activity data for last 7 days
  const activityData = (() => {
    const data = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const label = d.toLocaleDateString(undefined, { weekday: "short" });
      const dateStr = d.toDateString();
      data.push({ label, dateStr, count: 0 });
    }

    generations.forEach((g) => {
      if (!g.created_at) return;
      const gDate = new Date(g.created_at).toDateString();
      const match = data.find((d) => d.dateStr === gDate);
      if (match) {
        match.count += 1;
      }
    });

    return data;
  })();

  return (
    <motion.div
      className="profile-page"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >


      <div className="profile-content">
        {/* Sidebar / Header Area */}
        <aside className="profile-sidebar">
          <ProfileHeader user={user} />
          <StatsCards stats={stats} loading={loadingStats} />
          
          <div className="profile-sidebar-footer">
            <motion.button
              className="profile-logout-btn"
              onClick={() => {
                logout();
                navigate("/login");
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </motion.button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="profile-main">
          <TabNav activeTab={activeTab} onTabChange={setActiveTab} />

          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <OverviewTab
                key="overview"
                recentItems={recentItems}
                onLoadItem={handleLoadItem}
                onNewProject={handleNewProject}
                activityData={activityData}
              />
            )}

            {activeTab === "projects" && (
              <GenerationsTab
                key="projects"
                items={generations}
                loading={loadingGen}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onLoad={handleLoadItem}
                onDelete={handleDelete}
                onFav={handleFav}
                onRename={handleRename}
                onExport={handleExport}
                onNewProject={handleNewProject}
              />
            )}

            {activeTab === "liked" && (
              <GenerationsTab
                key="liked"
                items={generations.filter((g) => g.is_favourite)}
                loading={loadingGen}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onLoad={handleLoadItem}
                onDelete={handleDelete}
                onFav={handleFav}
                onRename={handleRename}
                onExport={handleExport}
                isLikedOnly={true}
                onNewProject={handleNewProject}
              />
            )}

            {activeTab === "settings" && (
              <SettingsTab key="settings" user={user} updateUser={updateUser} />
            )}
          </AnimatePresence>
        </main>
      </div>

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
    </motion.div>
  );
}
