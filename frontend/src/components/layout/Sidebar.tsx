import { NavLink, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Camera,
    History,
    BarChart3,
    Calendar,
    Music2,
    HeartHandshake,
    User,
    Settings,
    LogOut,
    Sparkles
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

interface SidebarProps {
    closeMobile?: () => void;
}

export default function Sidebar({ closeMobile }: SidebarProps) {
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        toast.success("Logged out successfully");
        navigate("/login");
        if (closeMobile) closeMobile();
    };

    const navItems = [
        { label: "Overview", path: "/dashboard", icon: LayoutDashboard },
        { label: "Detect Emotion", path: "/detection", icon: Camera, highlight: true },
        { label: "Mood History", path: "/history", icon: History },
        { label: "Analytics", path: "/analytics", icon: BarChart3 },
        { label: "Mood Calendar", path: "/calendar", icon: Calendar },
        { label: "Music Studio", path: "/music", icon: Music2 },
        { label: "MindMate AI", path: "/mindmate", icon: HeartHandshake, badge: "AI" },
        { label: "Profile", path: "/profile", icon: User },
        { label: "Settings", path: "/settings", icon: Settings },
    ];

    return (
        <aside className="w-64 bg-[#0B0F19]/95 border-r border-white/10 flex flex-col h-full select-none backdrop-blur-xl">
            {/* Logo */}
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <div
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-3 cursor-pointer group"
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-400 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all">
                        <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                        </div>
                    </div>
                    <div>
                        <span className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1">
                            MoodSync <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
                        </span>
                        <p className="text-[10px] text-gray-400 tracking-wider uppercase font-medium">Emotional Intelligence</p>
                    </div>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeMobile}
                            className={({ isActive }) => `
                                flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group
                                ${isActive
                                    ? "bg-gradient-to-r from-violet-600/30 to-indigo-600/10 text-white border border-violet-500/30 shadow-inner"
                                    : "text-gray-400 hover:text-white hover:bg-white/[0.04]"
                                }
                            `}
                        >
                            <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4 transition-transform group-hover:scale-110 text-indigo-400" />
                                <span>{item.label}</span>
                            </div>
                            {item.badge && (
                                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-sm">
                                    {item.badge}
                                </span>
                            )}
                        </NavLink>
                    );
                })}
            </nav>

            {/* User Mini Profile & Logout */}
            <div className="p-3 border-t border-white/10 bg-black/20">
                <div className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shrink-0 uppercase shadow-md">
                            {user?.name ? user.name.slice(0, 2) : "MS"}
                        </div>
                        <div className="truncate">
                            <p className="text-xs font-semibold text-white truncate">{user?.name || "Member"}</p>
                            <p className="text-[11px] text-gray-400 truncate">{user?.email || "user@moodsync.ai"}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        title="Sign out"
                        className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </aside>
    );
}
