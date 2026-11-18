import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Lock, Mail, User, Sparkles, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export default function Signup() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Calculate password strength
    const getPasswordStrength = () => {
        if (!password) return { score: 0, label: "Empty", color: "bg-gray-700" };
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 1) return { score: 25, label: "Weak", color: "bg-red-500" };
        if (score === 2) return { score: 50, label: "Fair", color: "bg-amber-500" };
        if (score === 3) return { score: 75, label: "Good", color: "bg-blue-500" };
        return { score: 100, label: "Strong", color: "bg-emerald-500" };
    };

    const strength = getPasswordStrength();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !password) {
            toast.error("Please fill in all required fields");
            return;
        }

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }

        setLoading(true);
        try {
            await register(name.trim(), email.trim(), password);
            toast.success("Account created successfully! Welcome aboard 🎉");
            navigate("/dashboard");
        } catch (err: any) {
            const msg = err.response?.data?.detail || "Registration failed. An account with this email may already exist.";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-[#070A11] flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* Background Glows */}
            <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md bg-[#0D1322]/90 border border-white/10 rounded-2xl p-8 backdrop-blur-2xl shadow-2xl relative z-10"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        onClick={() => navigate("/")}
                        className="inline-flex items-center gap-2 mb-4 cursor-pointer group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 p-[1px] shadow-lg shadow-violet-500/20">
                            <div className="w-full h-full bg-[#0D1322] rounded-[11px] flex items-center justify-center">
                                <Sparkles className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                            </div>
                        </div>
                        <span className="text-xl font-extrabold text-white tracking-tight">
                            MoodSync <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">AI</span>
                        </span>
                    </div>

                    <h1 className="text-2xl font-bold text-white tracking-tight">Create Account</h1>
                    <p className="text-sm text-gray-400 mt-1">Start tracking emotions and discover mindful music</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                            Full Name
                        </label>
                        <div className="relative">
                            <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                required
                                placeholder="Ranjitha Sridhar"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                            Email Address
                        </label>
                        <div className="relative">
                            <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Minimum 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-10 pr-11 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        {password && (
                            <div className="mt-2">
                                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                                    <span>Password strength</span>
                                    <span className="font-medium text-gray-300">{strength.label}</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${strength.color} transition-all duration-300`}
                                        style={{ width: `${strength.score}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                placeholder="Repeat your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-indigo-500 hover:from-violet-500 hover:to-indigo-400 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <span>Create My Account</span>
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="mt-6 pt-5 border-t border-white/10 text-center">
                    <p className="text-xs text-gray-400">
                        Already have an account?{" "}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
