import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Bell, Shield, Palette, Database, Lock, Trash2,
    ChevronRight, Moon, Sun, Monitor, Save, AlertCircle,
    CheckCircle, Eye, EyeOff, Download, Info
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import API from "../../services/api";
import toast from "react-hot-toast";

type ThemeOption = "dark" | "light" | "system";

interface SettingSection {
    id: string;
    label: string;
    icon: React.ReactNode;
}

const sections: SettingSection[] = [
    { id: "appearance", label: "Appearance", icon: <Palette size={18} /> },
    { id: "privacy",    label: "Privacy & Data", icon: <Shield size={18} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={18} /> },
    { id: "security",  label: "Security", icon: <Lock size={18} /> },
    { id: "data",      label: "Data Management", icon: <Database size={18} /> },
];

const THEME_OPTIONS: { value: ThemeOption; label: string; icon: React.ReactNode }[] = [
    { value: "dark",   label: "Dark",   icon: <Moon size={16} /> },
    { value: "light",  label: "Light",  icon: <Sun size={16} /> },
    { value: "system", label: "System", icon: <Monitor size={16} /> },
];

export default function Settings() {
    const { user, updateUserProfile } = useAuth();

    const [activeSection, setActiveSection] = useState("appearance");
    const [saving, setSaving] = useState(false);

    // Appearance
    const [theme, setTheme] = useState<ThemeOption>(
        (user?.theme as ThemeOption) ?? "dark"
    );

    // Privacy
    const [saveHistory, setSaveHistory] = useState(
        user?.save_history_enabled ?? true
    );

    // Notifications
    const [notificationsEnabled, setNotificationsEnabled] = useState(
        user?.notifications_enabled ?? true
    );
    const [dailyReminder,  setDailyReminder]  = useState(false);
    const [weeklyDigest,   setWeeklyDigest]   = useState(false);
    const [wellnessTips,   setWellnessTips]   = useState(true);

    // Security — change password
    const [currentPwd, setCurrentPwd] = useState("");
    const [newPwd,      setNewPwd]     = useState("");
    const [confirmPwd,  setConfirmPwd] = useState("");
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew,     setShowNew]     = useState(false);
    const [pwdLoading,  setPwdLoading]  = useState(false);

    // Data — danger zone
    const [deleteConfirm, setDeleteConfirm] = useState("");
    const [deleting, setDeleting] = useState(false);

    // Sync user defaults when loaded
    useEffect(() => {
        if (user) {
            setTheme((user.theme as ThemeOption) ?? "dark");
            setSaveHistory(user.save_history_enabled ?? true);
            setNotificationsEnabled(user.notifications_enabled ?? true);
        }
    }, [user]);

    // ── Save appearance + privacy + notifications ─────────────────────────────
    const handleSavePreferences = async () => {
        setSaving(true);
        try {
            const { data } = await API.put("/api/profile", {
                theme,
                save_history_enabled: saveHistory,
                notifications_enabled: notificationsEnabled,
            });
            updateUserProfile(data);
            toast.success("Preferences saved!");
        } catch {
            toast.error("Failed to save preferences.");
        } finally {
            setSaving(false);
        }
    };

    // ── Change password ───────────────────────────────────────────────────────
    const handleChangePassword = async () => {
        if (!currentPwd || !newPwd || !confirmPwd) {
            toast.error("Please fill all password fields.");
            return;
        }
        if (newPwd !== confirmPwd) {
            toast.error("New passwords do not match.");
            return;
        }
        if (newPwd.length < 8) {
            toast.error("New password must be at least 8 characters.");
            return;
        }
        setPwdLoading(true);
        try {
            await API.put("/api/profile/change-password", {
                current_password: currentPwd,
                new_password: newPwd,
            });
            toast.success("Password updated successfully!");
            setCurrentPwd(""); setNewPwd(""); setConfirmPwd("");
        } catch (err: any) {
            toast.error(err?.response?.data?.detail ?? "Failed to change password.");
        } finally {
            setPwdLoading(false);
        }
    };

    // ── Delete account ────────────────────────────────────────────────────────
    const handleDeleteAccount = async () => {
        if (deleteConfirm !== "DELETE") {
            toast.error('Type "DELETE" to confirm.');
            return;
        }
        setDeleting(true);
        try {
            await API.delete("/api/profile/account");
            toast.success("Account deleted. Goodbye!");
            setTimeout(() => { window.location.href = "/"; }, 1500);
        } catch {
            toast.error("Failed to delete account.");
            setDeleting(false);
        }
    };

    // ── Export data ───────────────────────────────────────────────────────────
    const handleExportData = async () => {
        try {
            const { data } = await API.get("/api/profile/export-data");
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `moodsync-data-${Date.now()}.json`;
            a.click();
            URL.revokeObjectURL(url);
            toast.success("Data exported!");
        } catch {
            toast.error("Failed to export data.");
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const pwdStrength = (p: string) => {
        if (!p) return 0;
        let s = 0;
        if (p.length >= 8) s++;
        if (/[A-Z]/.test(p)) s++;
        if (/[0-9]/.test(p)) s++;
        if (/[^A-Za-z0-9]/.test(p)) s++;
        return s;
    };
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"];
    const strengthColor = ["", "text-red-400", "text-orange-400", "text-yellow-400", "text-green-400"];
    const strength = pwdStrength(newPwd);

    return (
        <DashboardLayout>
            <div className="min-h-screen p-6 md:p-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-slate-400 mt-1">
                        Manage your account preferences and privacy options.
                    </p>
                </motion.div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* ── Sidebar nav ───────────────────────────────────────── */}
                    <motion.aside
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="lg:w-56 shrink-0"
                    >
                        <nav className="bg-white/5 border border-white/10 rounded-2xl p-2 space-y-1">
                            {sections.map((s) => (
                                <button
                                    key={s.id}
                                    onClick={() => setActiveSection(s.id)}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        activeSection === s.id
                                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                                            : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                                >
                                    {s.icon}
                                    {s.label}
                                    {activeSection === s.id && (
                                        <ChevronRight size={14} className="ml-auto" />
                                    )}
                                </button>
                            ))}
                        </nav>
                    </motion.aside>

                    {/* ── Main content ──────────────────────────────────────── */}
                    <motion.div
                        key={activeSection}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 space-y-6"
                    >
                        {/* ═══ APPEARANCE ══════════════════════════════════════ */}
                        {activeSection === "appearance" && (
                            <SettingsCard title="Appearance" icon={<Palette size={20} />}>
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm text-slate-300 font-medium mb-3 block">
                                            Theme
                                        </label>
                                        <div className="flex gap-3">
                                            {THEME_OPTIONS.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => setTheme(opt.value)}
                                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                                                        theme === opt.value
                                                            ? "bg-purple-500/20 border-purple-500 text-purple-300"
                                                            : "border-white/10 text-slate-400 hover:border-white/20 hover:text-white"
                                                    }`}
                                                >
                                                    {opt.icon}
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                                            <Info size={12} />
                                            Light theme is cosmetic — full implementation coming soon.
                                        </p>
                                    </div>

                                    <SaveButton loading={saving} onClick={handleSavePreferences} />
                                </div>
                            </SettingsCard>
                        )}

                        {/* ═══ PRIVACY ═════════════════════════════════════════ */}
                        {activeSection === "privacy" && (
                            <SettingsCard title="Privacy & Data" icon={<Shield size={20} />}>
                                <div className="space-y-5">
                                    <Toggle
                                        label="Save Mood History"
                                        description="Allow MoodSync to save your emotion detection results for analytics and history."
                                        checked={saveHistory}
                                        onChange={setSaveHistory}
                                    />

                                    <div className="border-t border-white/5 pt-4 text-sm text-slate-400 space-y-2 leading-relaxed">
                                        <p className="flex items-start gap-2">
                                            <Info size={14} className="shrink-0 mt-0.5 text-purple-400" />
                                            Facial images are <strong className="text-white">never stored</strong>. Only
                                            emotion predictions and metadata are saved with your consent.
                                        </p>
                                        <p className="flex items-start gap-2">
                                            <Info size={14} className="shrink-0 mt-0.5 text-purple-400" />
                                            Emotion detection is an estimate of visible expressions, not a clinical
                                            measurement of your internal state.
                                        </p>
                                    </div>

                                    <SaveButton loading={saving} onClick={handleSavePreferences} />
                                </div>
                            </SettingsCard>
                        )}

                        {/* ═══ NOTIFICATIONS ═══════════════════════════════════ */}
                        {activeSection === "notifications" && (
                            <SettingsCard title="Notifications" icon={<Bell size={20} />}>
                                <div className="space-y-5">
                                    <Toggle
                                        label="Enable Notifications"
                                        description="Master toggle for all MoodSync notifications."
                                        checked={notificationsEnabled}
                                        onChange={setNotificationsEnabled}
                                    />

                                    <div
                                        className={`space-y-4 transition-opacity ${
                                            notificationsEnabled ? "opacity-100" : "opacity-30 pointer-events-none"
                                        }`}
                                    >
                                        <Toggle
                                            label="Daily Mood Reminder"
                                            description="Remind you to check in with your mood each day."
                                            checked={dailyReminder}
                                            onChange={setDailyReminder}
                                        />
                                        <Toggle
                                            label="Weekly Wellness Digest"
                                            description="Get a weekly summary of your mood patterns."
                                            checked={weeklyDigest}
                                            onChange={setWeeklyDigest}
                                        />
                                        <Toggle
                                            label="Wellness Tips"
                                            description="Receive personalized wellness suggestions from MindMate."
                                            checked={wellnessTips}
                                            onChange={setWellnessTips}
                                        />
                                    </div>

                                    <p className="text-xs text-slate-500 flex items-center gap-1">
                                        <Info size={12} />
                                        Push notifications require browser permission. In-app notifications always work.
                                    </p>

                                    <SaveButton loading={saving} onClick={handleSavePreferences} />
                                </div>
                            </SettingsCard>
                        )}

                        {/* ═══ SECURITY ════════════════════════════════════════ */}
                        {activeSection === "security" && (
                            <SettingsCard title="Security" icon={<Lock size={20} />}>
                                <div className="space-y-4">
                                    <p className="text-sm text-slate-400">
                                        Update your password. We recommend a strong, unique password of at least
                                        12 characters.
                                    </p>

                                    <PasswordField
                                        label="Current Password"
                                        value={currentPwd}
                                        onChange={setCurrentPwd}
                                        show={showCurrent}
                                        onToggle={() => setShowCurrent((v) => !v)}
                                    />
                                    <PasswordField
                                        label="New Password"
                                        value={newPwd}
                                        onChange={setNewPwd}
                                        show={showNew}
                                        onToggle={() => setShowNew((v) => !v)}
                                    />

                                    {newPwd && (
                                        <div className="flex items-center gap-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 flex-1 rounded-full transition-colors ${
                                                        strength >= i
                                                            ? ["", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-500"][strength]
                                                            : "bg-white/10"
                                                    }`}
                                                />
                                            ))}
                                            <span className={`text-xs font-medium ${strengthColor[strength]}`}>
                                                {strengthLabel[strength]}
                                            </span>
                                        </div>
                                    )}

                                    <PasswordField
                                        label="Confirm New Password"
                                        value={confirmPwd}
                                        onChange={setConfirmPwd}
                                        show={showNew}
                                        onToggle={() => setShowNew((v) => !v)}
                                    />

                                    {confirmPwd && newPwd !== confirmPwd && (
                                        <p className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle size={12} /> Passwords do not match.
                                        </p>
                                    )}
                                    {confirmPwd && newPwd === confirmPwd && newPwd.length >= 8 && (
                                        <p className="text-xs text-green-400 flex items-center gap-1">
                                            <CheckCircle size={12} /> Passwords match.
                                        </p>
                                    )}

                                    <button
                                        onClick={handleChangePassword}
                                        disabled={pwdLoading}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
                                    >
                                        {pwdLoading ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Lock size={16} />
                                        )}
                                        Update Password
                                    </button>
                                </div>
                            </SettingsCard>
                        )}

                        {/* ═══ DATA MANAGEMENT ═════════════════════════════════ */}
                        {activeSection === "data" && (
                            <div className="space-y-6">
                                <SettingsCard title="Export Your Data" icon={<Download size={20} />}>
                                    <p className="text-sm text-slate-400 mb-4">
                                        Download all your personal data including mood history, journal entries,
                                        and preferences as a JSON file.
                                    </p>
                                    <button
                                        onClick={handleExportData}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 text-blue-300 rounded-xl text-sm font-medium transition-all"
                                    >
                                        <Download size={16} />
                                        Download My Data
                                    </button>
                                </SettingsCard>

                                <SettingsCard
                                    title="Danger Zone"
                                    icon={<Trash2 size={20} />}
                                    danger
                                >
                                    <div className="space-y-4">
                                        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                            <p className="text-sm text-red-300 font-medium mb-1">
                                                Delete Account
                                            </p>
                                            <p className="text-xs text-red-400/80">
                                                This permanently deletes your account, all mood history, journal
                                                entries, and preferences. This action cannot be undone.
                                            </p>
                                        </div>

                                        <div>
                                            <label className="text-xs text-slate-400 mb-1 block">
                                                Type <strong className="text-red-400">DELETE</strong> to confirm
                                            </label>
                                            <input
                                                type="text"
                                                value={deleteConfirm}
                                                onChange={(e) => setDeleteConfirm(e.target.value)}
                                                placeholder="DELETE"
                                                className="w-full bg-white/5 border border-red-500/30 rounded-xl px-4 py-2.5 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-red-500"
                                            />
                                        </div>

                                        <button
                                            onClick={handleDeleteAccount}
                                            disabled={deleting || deleteConfirm !== "DELETE"}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-30 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition-all"
                                        >
                                            {deleting ? (
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            ) : (
                                                <Trash2 size={16} />
                                            )}
                                            Delete My Account
                                        </button>
                                    </div>
                                </SettingsCard>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </DashboardLayout>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SettingsCard({
    title,
    icon,
    danger,
    children,
}: {
    title: string;
    icon: React.ReactNode;
    danger?: boolean;
    children: React.ReactNode;
}) {
    return (
        <div
            className={`rounded-2xl border p-6 ${
                danger
                    ? "bg-red-500/5 border-red-500/20"
                    : "bg-white/5 border-white/10"
            }`}
        >
            <h2
                className={`flex items-center gap-2 text-base font-semibold mb-5 ${
                    danger ? "text-red-400" : "text-white"
                }`}
            >
                {icon}
                {title}
            </h2>
            {children}
        </div>
    );
}

function Toggle({
    label,
    description,
    checked,
    onChange,
}: {
    label: string;
    description: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-start justify-between gap-4">
            <div>
                <p className="text-sm font-medium text-white">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{description}</p>
            </div>
            <button
                onClick={() => onChange(!checked)}
                className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${
                    checked ? "bg-purple-600" : "bg-white/10"
                }`}
                role="switch"
                aria-checked={checked}
            >
                <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                        checked ? "left-6" : "left-1"
                    }`}
                />
            </button>
        </div>
    );
}

function PasswordField({
    label,
    value,
    onChange,
    show,
    onToggle,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    show: boolean;
    onToggle: () => void;
}) {
    return (
        <div>
            <label className="text-xs text-slate-400 mb-1 block">{label}</label>
            <div className="relative">
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <button
                    type="button"
                    onClick={onToggle}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                    {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
            </div>
        </div>
    );
}

function SaveButton({
    loading,
    onClick,
}: {
    loading: boolean;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white rounded-xl text-sm font-medium transition-all"
        >
            {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
                <Save size={16} />
            )}
            Save Changes
        </button>
    );
}
