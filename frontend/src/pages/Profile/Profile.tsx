import { useState, useEffect } from "react";
import {
    User,
    Mail,
    Calendar,
    Music2,
    Lock,
    Download,
    Trash2,
    Save,
    Camera,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    ShieldCheck
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";

export default function ProfilePage() {
    const { user, logout, updateUserProfile } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState(user?.name || "");
    const [preferredGenres, setPreferredGenres] = useState(user?.preferred_genres || "Pop,Lo-Fi,Acoustic,Ambient");
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileSaved, setProfileSaved] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);

    const [exporting, setExporting] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSavingProfile(true);
        setProfileSaved(false);
        try {
            const res = await API.put("/api/profile", {
                name: name.trim(),
                preferred_genres: preferredGenres.trim()
            });
            updateUserProfile(res.data);
            setProfileSaved(true);
            toast.success("Profile updated successfully");
            setTimeout(() => setProfileSaved(false), 3000);
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to update profile");
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmNewPassword) {
            toast.error("New passwords do not match");
            return;
        }
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }
        setSavingPassword(true);
        try {
            await API.post("/api/profile/change-password", {
                current_password: currentPassword,
                new_password: newPassword
            });
            toast.success("Password updated successfully");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Incorrect current password");
        } finally {
            setSavingPassword(false);
        }
    };

    const handleExportData = async () => {
        setExporting(true);
        try {
            const res = await API.get("/api/profile/export-data", {
                responseType: "blob"
            });
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `moodsync_data_export_${new Date().toISOString().slice(0, 10)}.json`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Your personal data has been exported successfully");
        } catch {
            toast.error("Failed to export data");
        } finally {
            setExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("⚠️ PERMANENT ACTION: This will delete your MoodSync AI account and ALL associated data (emotion history, journals, saved songs, preferences). This cannot be undone.\n\nAre you absolutely sure?")) return;
        if (!confirm("Final confirmation: Delete account and ALL personal data permanently?")) return;

        setDeletingAccount(true);
        try {
            await API.delete("/api/profile/account");
            toast.success("Account permanently deleted");
            logout();
            navigate("/");
        } catch {
            toast.error("Failed to delete account");
        } finally {
            setDeletingAccount(false);
        }
    };

    return (
        <DashboardLayout
            title="User Profile"
            subtitle="Manage your personal information, security settings, and data privacy"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column: Avatar & Summary */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Avatar Card */}
                    <div className="p-8 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl text-center space-y-4">
                        <div className="relative mx-auto w-24 h-24">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-500 via-indigo-500 to-cyan-400 flex items-center justify-center text-3xl font-black text-white shadow-xl shadow-violet-500/30">
                                {user?.name ? user.name.slice(0, 2).toUpperCase() : "MS"}
                            </div>
                            <div className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#0D1322] border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors" title="Change avatar (URL)">
                                <Camera className="w-3.5 h-3.5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-extrabold text-white tracking-tight">{user?.name}</h2>
                            <p className="text-xs text-gray-400 mt-1 font-mono">{user?.email}</p>
                        </div>

                        <div className="pt-3 border-t border-white/10 space-y-2 text-left">
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                                    Member since
                                </span>
                                <span className="text-gray-200 font-medium">
                                    {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "—"}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-400 flex items-center gap-1.5">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                                    Account status
                                </span>
                                <span className="text-emerald-400 font-semibold">Active</span>
                            </div>
                        </div>
                    </div>

                    {/* Export & Danger Zone */}
                    <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                        <h3 className="text-sm font-bold text-white">Data & Account</h3>

                        <button
                            onClick={handleExportData}
                            disabled={exporting}
                            className="w-full flex items-center gap-2 px-4 py-3 rounded-xl bg-indigo-600/15 hover:bg-indigo-600/25 text-indigo-300 hover:text-white text-xs font-semibold border border-indigo-500/20 transition-all"
                        >
                            <Download className="w-4 h-4" />
                            <span>{exporting ? "Preparing export..." : "Download All My Personal Data"}</span>
                        </button>

                        <div className="pt-3 border-t border-red-900/30">
                            <p className="text-xs text-gray-400 mb-3">
                                Account deletion is permanent and cannot be undone. All emotion history, journals, saved music, and preferences will be erased.
                            </p>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={deletingAccount}
                                className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs font-semibold border border-red-500/20 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>{deletingAccount ? "Deleting..." : "Delete My Account Permanently"}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Column: Profile & Security Forms */}
                <div className="lg:col-span-8 space-y-6">
                    {/* Profile Information Form */}
                    <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-5">
                        <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <User className="w-4 h-4 text-violet-400" />
                                Profile Information
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">Update your display name and music preferences</p>
                        </div>

                        <form onSubmit={handleUpdateProfile} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                        Display Name
                                    </label>
                                    <div className="relative">
                                        <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Your name"
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                        Email Address
                                    </label>
                                    <div className="relative">
                                        <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.015] border border-white/5 rounded-xl text-sm text-gray-500 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-[11px] text-gray-500 mt-1">Email cannot be changed after registration</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                    Preferred Music Genres
                                </label>
                                <div className="relative">
                                    <Music2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                    <input
                                        type="text"
                                        value={preferredGenres}
                                        onChange={(e) => setPreferredGenres(e.target.value)}
                                        placeholder="Pop, Lo-Fi, Jazz, Acoustic, Ambient"
                                        className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                                <p className="text-[11px] text-gray-500 mt-1">Comma-separated genre preferences influence your music recommendations</p>
                            </div>

                            <div className="pt-2 flex items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={savingProfile}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md shadow-violet-500/20 transition-all"
                                >
                                    {savingProfile ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Save className="w-4 h-4" />
                                    )}
                                    <span>Save Changes</span>
                                </button>
                                {profileSaved && (
                                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                                        <CheckCircle2 className="w-4 h-4" />
                                        <span>Profile updated</span>
                                    </div>
                                )}
                            </div>
                        </form>
                    </div>

                    {/* Security: Change Password */}
                    <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-5">
                        <div>
                            <h3 className="text-base font-bold text-white flex items-center gap-2">
                                <Lock className="w-4 h-4 text-amber-400" />
                                Change Password
                            </h3>
                            <p className="text-xs text-gray-400 mt-0.5">Update your login credentials securely</p>
                        </div>

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    required
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    placeholder="Enter current password"
                                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                        New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Minimum 6 characters"
                                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmNewPassword}
                                        onChange={(e) => setConfirmNewPassword(e.target.value)}
                                        placeholder="Repeat new password"
                                        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={savingPassword}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600/80 hover:bg-amber-500 text-white font-semibold text-xs transition-all"
                            >
                                {savingPassword ? "Updating..." : "Update Password"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
