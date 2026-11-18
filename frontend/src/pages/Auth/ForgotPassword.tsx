import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../services/api";

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState<"request" | "reset">("request");
    const [email, setEmail] = useState("");
    const [token, setToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) {
            toast.error("Please enter your registered email");
            return;
        }

        setLoading(true);
        try {
            const res = await API.post("/api/auth/forgot-password", { email: email.trim() });
            toast.success("Reset code generated! Check below to enter new password.");
            if (res.data?.reset_token) {
                setToken(res.data.reset_token);
            }
            setStep("reset");
        } catch {
            toast.error("Failed to request reset. Please check your email.");
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token.trim() || !newPassword) {
            toast.error("Please provide the reset token and new password");
            return;
        }

        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            await API.post("/api/auth/reset-password", {
                email: email.trim(),
                token: token.trim(),
                new_password: newPassword
            });
            toast.success("Password reset successfully! You can now log in.");
            navigate("/login");
        } catch (err: any) {
            toast.error(err.response?.data?.detail || "Failed to reset password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#0D1322]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto mb-4">
                        <KeyRound className="w-6 h-6" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Reset Password</h1>
                    <p className="text-sm text-gray-400 mt-1">
                        {step === "request"
                            ? "Enter your email to receive recovery instructions"
                            : "Enter your authorization token and new password"}
                    </p>
                </div>

                {step === "request" ? (
                    <form onSubmit={handleRequestReset} className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                                Registered Email
                            </label>
                            <div className="relative">
                                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="email"
                                    required
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                        >
                            {loading ? "Sending..." : "Continue"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleConfirmReset} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                Reset Token
                            </label>
                            <input
                                type="text"
                                required
                                value={token}
                                onChange={(e) => setToken(e.target.value)}
                                placeholder="Paste reset token"
                                className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                                <input
                                    type="password"
                                    required
                                    placeholder="Minimum 6 characters"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {loading ? "Resetting..." : "Update Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Login</span>
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
