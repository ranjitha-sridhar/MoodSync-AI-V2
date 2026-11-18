import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import {
    Menu,
    X,
    Camera
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuth } from "../../context/AuthContext";

interface LayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    actions?: ReactNode;
}

export default function DashboardLayout({ children, title, subtitle, actions }: LayoutProps) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="flex h-screen w-full bg-[#070A11] text-gray-100 overflow-hidden font-sans">
            {/* Desktop Sidebar */}
            <div className="hidden lg:flex flex-shrink-0 h-full">
                <Sidebar />
            </div>

            {/* Mobile Drawer Backdrop */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden transition-opacity"
                />
            )}

            {/* Mobile Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-300 ease-in-out ${
                mobileOpen ? "translate-x-0" : "-translate-x-full"
            }`}>
                <div className="relative h-full">
                    <button
                        onClick={() => setMobileOpen(false)}
                        className="absolute top-4 right-4 z-50 p-2 text-gray-400 hover:text-white rounded-lg bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <Sidebar closeMobile={() => setMobileOpen(false)} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
                {/* Header */}
                <header className="h-16 border-b border-white/10 bg-[#0B0F19]/80 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-10">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setMobileOpen(true)}
                            className="p-2 text-gray-400 hover:text-white rounded-xl bg-white/5 lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div>
                            {title && (
                                <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                    {title}
                                </h1>
                            )}
                            {subtitle && (
                                <p className="text-xs text-gray-400 hidden sm:block">{subtitle}</p>
                            )}
                        </div>
                    </div>

                    {/* Right side controls */}
                    <div className="flex items-center gap-3">
                        {actions}

                        <button
                            onClick={() => navigate("/detection")}
                            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-violet-500/20 transition-all hover:shadow-violet-500/40"
                        >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Detect Mood</span>
                        </button>

                        <div
                            onClick={() => navigate("/profile")}
                            className="flex items-center gap-2.5 pl-2 cursor-pointer group"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-md group-hover:ring-2 group-hover:ring-violet-400/50 transition-all">
                                {user?.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Body Content */}
                <main className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 bg-gradient-to-b from-[#070A11] via-[#090E1A] to-[#070A11]">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
