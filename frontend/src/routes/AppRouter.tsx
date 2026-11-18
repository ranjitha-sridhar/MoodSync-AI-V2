import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "../context/AuthContext";

// Eager imports (small / always needed)
import Landing from "../pages/Landing";
import Login from "../pages/Auth/Login/Login";
import Signup from "../pages/Auth/Signup/Signup";
import ForgotPassword from "../pages/Auth/ForgotPassword";

// Lazy imports (code-split)
const Dashboard   = lazy(() => import("../pages/Dashboard/Dashboard"));
const Detection   = lazy(() => import("../pages/Detection/Detection"));
const History     = lazy(() => import("../pages/History/History"));
const Analytics   = lazy(() => import("../pages/Analytics/Analytics"));
const Calendar    = lazy(() => import("../pages/Calendar/Calendar"));
const MusicStudio = lazy(() => import("../pages/MusicStudio/MusicStudio"));
const MindMate    = lazy(() => import("../pages/MindMate/MindMate"));
const Profile     = lazy(() => import("../pages/Profile/Profile"));
const Settings    = lazy(() => import("../pages/Settings/Settings"));

// ── Loading spinner shown during lazy-load ────────────────────────────────────
function PageLoader() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0B0F1A]">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin" />
                <p className="text-slate-400 text-sm">Loading…</p>
            </div>
        </div>
    );
}

// ── Protected route — waits for auth check to finish ─────────────────────────
function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) return <PageLoader />;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return <>{children}</>;
}

// ── Public-only route — redirects to dashboard when already logged in ─────────
function PublicRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();

    if (isLoading) return <PageLoader />;
    if (isLoggedIn) return <Navigate to="/dashboard" replace />;
    return <>{children}</>;
}

export default function AppRouter() {
    return (
        <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* ── Public ───────────────────────────────────────────── */}
                    <Route path="/" element={<Landing />} />

                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <Login />
                            </PublicRoute>
                        }
                    />

                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <Signup />
                            </PublicRoute>
                        }
                    />

                    <Route path="/forgot-password" element={<ForgotPassword />} />

                    {/* ── Protected ────────────────────────────────────────── */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/detection"
                        element={
                            <ProtectedRoute>
                                <Detection />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/history"
                        element={
                            <ProtectedRoute>
                                <History />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/analytics"
                        element={
                            <ProtectedRoute>
                                <Analytics />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/calendar"
                        element={
                            <ProtectedRoute>
                                <Calendar />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/music"
                        element={
                            <ProtectedRoute>
                                <MusicStudio />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/mindmate"
                        element={
                            <ProtectedRoute>
                                <MindMate />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <ProtectedRoute>
                                <Settings />
                            </ProtectedRoute>
                        }
                    />

                    {/* ── Catch-all ─────────────────────────────────────────── */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
