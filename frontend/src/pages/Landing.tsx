import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Brain, Camera, BarChart3, Music2, Calendar, Heart,
    ArrowRight, Shield, Zap, Users, Star, ChevronDown, Sparkles
} from "lucide-react";
import Footer from "../components/layout/Footer";

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how" },
    { label: "About", href: "#about" },
];

const FEATURES = [
    {
        icon: <Camera size={24} />,
        title: "AI Emotion Detection",
        desc: "Real-time facial emotion analysis using a CNN trained on FER2013 — 7 emotion classes, live webcam or image upload.",
        color: "from-purple-500/20 to-violet-500/20",
        border: "border-purple-500/30",
        iconColor: "text-purple-400",
    },
    {
        icon: <BarChart3 size={24} />,
        title: "Mood Analytics",
        desc: "Interactive dashboards showing weekly trends, emotion distribution, weekday patterns and calendar heatmaps — all from your real data.",
        color: "from-blue-500/20 to-cyan-500/20",
        border: "border-blue-500/30",
        iconColor: "text-blue-400",
    },
    {
        icon: <Music2 size={24} />,
        title: "Music Studio",
        desc: "Personalized music recommendations matched to your emotional state. Save songs, build playlists and explore by genre.",
        color: "from-pink-500/20 to-rose-500/20",
        border: "border-pink-500/30",
        iconColor: "text-pink-400",
    },
    {
        icon: <Heart size={24} />,
        title: "MindMate AI",
        desc: "Your supportive wellness companion. Box breathing, mood journals, positive affirmations and daily wellness check-ins.",
        color: "from-emerald-500/20 to-teal-500/20",
        border: "border-emerald-500/30",
        iconColor: "text-emerald-400",
    },
    {
        icon: <Calendar size={24} />,
        title: "Mood Calendar",
        desc: "Visual monthly calendar showing your emotional journey. Click any date to view detailed mood records and notes.",
        color: "from-orange-500/20 to-amber-500/20",
        border: "border-orange-500/30",
        iconColor: "text-orange-400",
    },
    {
        icon: <Shield size={24} />,
        title: "Private & Secure",
        desc: "JWT authentication, bcrypt password hashing, user-isolated records. Facial images are never stored — only predictions.",
        color: "from-indigo-500/20 to-blue-500/20",
        border: "border-indigo-500/30",
        iconColor: "text-indigo-400",
    },
];

const STEPS = [
    {
        num: "01",
        title: "Sign Up",
        desc: "Create your free account with just your name, email and password.",
        icon: <Users size={20} />,
    },
    {
        num: "02",
        title: "Detect Your Mood",
        desc: "Use your webcam or upload a photo. Our CNN model analyses your expression in seconds.",
        icon: <Zap size={20} />,
    },
    {
        num: "03",
        title: "Get Insights",
        desc: "Save results, track trends over time and explore your emotional patterns through interactive charts.",
        icon: <Brain size={20} />,
    },
    {
        num: "04",
        title: "Thrive",
        desc: "Receive music recommendations, wellness guidance and affirmations personalised to how you feel.",
        icon: <Sparkles size={20} />,
    },
];

const STATS = [
    { value: "7", label: "Emotion Classes" },
    { value: "FER2013", label: "Training Dataset" },
    { value: "CNN", label: "Model Architecture" },
    { value: "100%", label: "Data Private" },
];

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#060914] text-white overflow-x-hidden">
            {/* ── Navbar ──────────────────────────────────────────────────── */}
            <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[#060914]/80">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                            <Brain size={16} className="text-white" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">MoodSync AI</span>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map((l) => (
                            <a
                                key={l.label}
                                href={l.href}
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm text-slate-400 hover:text-white transition-colors px-3 py-1.5"
                        >
                            Sign In
                        </button>
                        <button
                            onClick={() => navigate("/signup")}
                            className="text-sm bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg transition-colors font-medium"
                        >
                            Get Started
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center">
                {/* Background glows */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-violet-600/8 rounded-full blur-3xl" />
                    <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-blue-600/8 rounded-full blur-3xl" />
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-xs font-medium mb-6">
                        <Sparkles size={12} />
                        AI-Powered Emotional Wellness Platform
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none">
                        Understand{" "}
                        <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                            your emotions
                        </span>
                        <br />
                        better than ever.
                    </h1>

                    <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                        MoodSync AI uses a trained deep learning model to detect facial emotions in
                        real time — then helps you track patterns, discover music and build
                        better wellness habits.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/signup")}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-2xl text-base font-semibold shadow-lg shadow-purple-500/25 transition-all"
                        >
                            Start for Free
                            <ArrowRight size={18} />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => navigate("/login")}
                            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl text-base font-semibold transition-all"
                        >
                            Sign In
                        </motion.button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="absolute bottom-10 flex flex-col items-center gap-1 text-slate-500"
                >
                    <span className="text-xs">Scroll to explore</span>
                    <ChevronDown size={16} className="animate-bounce" />
                </motion.div>
            </section>

            {/* ── Stats strip ─────────────────────────────────────────────── */}
            <section className="border-y border-white/5 py-10 bg-white/[0.02]">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
                                {s.value}
                            </div>
                            <div className="text-sm text-slate-500 mt-1">{s.label}</div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Features ────────────────────────────────────────────────── */}
            <section id="features" className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">
                            Everything you need for{" "}
                            <span className="text-purple-400">emotional wellness</span>
                        </h2>
                        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                            A complete platform built with real AI, real data, and genuine care for
                            your mental wellbeing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURES.map((f, i) => (
                            <motion.div
                                key={f.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08 }}
                                className={`relative p-6 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} hover:scale-[1.02] transition-transform cursor-default`}
                            >
                                <div className={`inline-flex p-2.5 rounded-xl bg-white/5 ${f.iconColor} mb-4`}>
                                    {f.icon}
                                </div>
                                <h3 className="text-base font-semibold text-white mb-2">{f.title}</h3>
                                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── How it works ────────────────────────────────────────────── */}
            <section id="how" className="py-24 px-6 bg-white/[0.015]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold mb-4">How It Works</h2>
                        <p className="text-slate-400 text-lg">
                            Get started in minutes. No technical knowledge required.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {STEPS.map((s, i) => (
                            <motion.div
                                key={s.num}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.12 }}
                                className="relative"
                            >
                                {i < STEPS.length - 1 && (
                                    <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-purple-500/40 to-transparent z-0" />
                                )}
                                <div className="relative z-10 p-6 bg-white/5 border border-white/10 rounded-2xl">
                                    <div className="text-4xl font-black text-purple-500/20 mb-3">
                                        {s.num}
                                    </div>
                                    <div className="inline-flex p-2 rounded-lg bg-purple-500/10 text-purple-400 mb-3">
                                        {s.icon}
                                    </div>
                                    <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Disclaimer / About ───────────────────────────────────────── */}
            <section id="about" className="py-20 px-6">
                <div className="max-w-3xl mx-auto">
                    <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/20 text-sm text-slate-400 leading-relaxed space-y-2">
                        <p className="flex items-start gap-2">
                            <Star size={14} className="shrink-0 mt-0.5 text-blue-400" />
                            <span>
                                <strong className="text-white">Important:</strong> Facial emotion
                                detection estimates visible expressions — it is not a clinical or
                                psychological assessment of your internal emotional state.
                            </span>
                        </p>
                        <p className="flex items-start gap-2">
                            <Shield size={14} className="shrink-0 mt-0.5 text-blue-400" />
                            <span>
                                Your privacy matters. Facial images are <strong className="text-white">never stored</strong>.
                                Only emotion predictions and metadata are saved, with your explicit consent.
                            </span>
                        </p>
                        <p className="flex items-start gap-2">
                            <Heart size={14} className="shrink-0 mt-0.5 text-blue-400" />
                            <span>
                                MindMate is a supportive wellness companion, not a substitute for
                                professional mental health care. If you're struggling, please reach
                                out to a qualified professional.
                            </span>
                        </p>
                    </div>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────────── */}
            <section className="py-24 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="relative p-12 rounded-3xl bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-500/20 overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-transparent" />
                        <div className="relative">
                            <h2 className="text-4xl font-bold mb-4">
                                Ready to sync with your mood?
                            </h2>
                            <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                                Join MoodSync AI and start understanding your emotional patterns today.
                                Free to use, always private.
                            </p>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => navigate("/signup")}
                                className="inline-flex items-center gap-2 px-10 py-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white rounded-2xl text-lg font-semibold shadow-xl shadow-purple-500/30 transition-all"
                            >
                                Get Started Free
                                <ArrowRight size={20} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
