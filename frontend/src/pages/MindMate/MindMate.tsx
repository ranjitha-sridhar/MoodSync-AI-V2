import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    HeartHandshake,
    Wind,
    BookOpen,
    Sparkles,
    Smile,
    Info,
    Plus,
    Trash2,
    Play,
    Pause,
    RotateCcw,
    CheckCircle2
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

interface JournalEntry {
    id: number;
    title: string;
    content: string;
    mood_tag: string;
    created_at: string;
}

interface WellnessGuidance {
    recent_mood: string;
    affirmations: string[];
    activities: {
        id: string;
        title: string;
        category: string;
        duration_minutes: number;
        description: string;
        benefit: string;
    }[];
    disclaimer: string;
}

export default function MindMate() {
    const [tab, setTab] = useState<"breathing" | "journal" | "guidance">("breathing");
    const [guidance, setGuidance] = useState<WellnessGuidance | null>(null);
    const [journals, setJournals] = useState<JournalEntry[]>([]);
    const [loading, setLoading] = useState(true);

    // New Journal form state
    const [journalTitle, setJournalTitle] = useState("");
    const [journalContent, setJournalContent] = useState("");
    const [journalMood, setJournalMood] = useState("Neutral");
    const [submittingJournal, setSubmittingJournal] = useState(false);

    // Box Breathing (4-4-4-4) Timer State
    const [breathingActive, setBreathingActive] = useState(false);
    const [breathPhase, setBreathPhase] = useState<"Inhale" | "Hold" | "Exhale" | "Hold (Empty)">("Inhale");
    const [countdown, setCountdown] = useState(4);
    const [cyclesCompleted, setCyclesCompleted] = useState(0);

    // Fetch guidance and journals
    const fetchMindMateData = async () => {
        setLoading(true);
        try {
            const [gRes, jRes] = await Promise.all([
                API.get<WellnessGuidance>("/api/journal/companion-guidance"),
                API.get<JournalEntry[]>("/api/journal")
            ]);
            setGuidance(gRes.data);
            setJournals(jRes.data);
        } catch {
            console.warn("Could not fetch full MindMate data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMindMateData();
    }, []);

    // Box Breathing Loop
    useEffect(() => {
        let interval: any = null;
        if (breathingActive) {
            interval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        // Switch phases
                        setBreathPhase((current) => {
                            if (current === "Inhale") return "Hold";
                            if (current === "Hold") return "Exhale";
                            if (current === "Exhale") return "Hold (Empty)";
                            // Finished one full cycle
                            setCyclesCompleted((c) => c + 1);
                            return "Inhale";
                        });
                        return 4;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [breathingActive]);

    const handleCreateJournal = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!journalContent.trim()) {
            toast.error("Please write some reflection content");
            return;
        }

        setSubmittingJournal(true);
        try {
            const res = await API.post<JournalEntry>("/api/journal", {
                title: journalTitle.trim() || "Daily Reflection",
                content: journalContent.trim(),
                mood_tag: journalMood
            });
            toast.success("Reflection entry saved to your MindMate journal 🌿");
            setJournals([res.data, ...journals]);
            setJournalTitle("");
            setJournalContent("");
        } catch {
            toast.error("Failed to save journal entry");
        } finally {
            setSubmittingJournal(false);
        }
    };

    const handleDeleteJournal = async (id: number) => {
        try {
            await API.delete(`/api/journal/${id}`);
            toast.success("Journal entry deleted");
            setJournals((prev) => prev.filter((j) => j.id !== id));
        } catch {
            toast.error("Failed to delete entry");
        }
    };

    return (
        <DashboardLayout
            title="MindMate AI — Wellness Companion"
            subtitle="Gentle mindfulness, structured reflection, and somatic breathwork grounded in evidence"
        >
            {/* Top Navigation Tabs */}
            <div className="flex items-center gap-2 p-1.5 bg-[#0D1322] border border-white/10 rounded-2xl w-fit">
                <button
                    onClick={() => setTab("breathing")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        tab === "breathing" ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "text-gray-400 hover:text-white"
                    }`}
                >
                    <Wind className="w-3.5 h-3.5" />
                    <span>Box Breathing (4-4-4-4)</span>
                </button>
                <button
                    onClick={() => setTab("journal")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        tab === "journal" ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "text-gray-400 hover:text-white"
                    }`}
                >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Mood Journal</span>
                </button>
                <button
                    onClick={() => setTab("guidance")}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        tab === "guidance" ? "bg-violet-600 text-white shadow-md shadow-violet-500/20" : "text-gray-400 hover:text-white"
                    }`}
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Affirmations & Activities</span>
                </button>
            </div>

            {/* TAB 1: Box Breathing Exercise */}
            {tab === "breathing" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    {/* Visual Animated Breathing Sphere */}
                    <div className="lg:col-span-7 p-12 rounded-3xl bg-[#0D1322] border border-white/10 shadow-2xl flex flex-col items-center justify-center min-h-[460px] relative overflow-hidden text-center">
                        {/* Dynamic Animated Circle */}
                        <div className="relative flex items-center justify-center w-72 h-72">
                            <motion.div
                                animate={{
                                    scale: breathPhase === "Inhale" ? 1.35 : breathPhase === "Exhale" ? 0.8 : 1.1,
                                    borderColor: breathPhase === "Inhale" ? "#22d3ee" : breathPhase === "Exhale" ? "#a855f7" : "#6366f1"
                                }}
                                transition={{ duration: 4, ease: "easeInOut" }}
                                className="w-56 h-56 rounded-full border-4 border-dashed bg-gradient-to-tr from-violet-600/20 via-indigo-600/10 to-cyan-500/20 backdrop-blur-md flex flex-col items-center justify-center shadow-[0_0_50px_rgba(99,102,241,0.25)]"
                            >
                                <span className="text-xs uppercase font-extrabold tracking-widest text-cyan-300 mb-1">
                                    {breathingActive ? breathPhase : "Ready"}
                                </span>
                                <span className="text-6xl font-black text-white font-mono tracking-tighter">
                                    {breathingActive ? countdown : "4"}
                                </span>
                                <span className="text-[11px] text-gray-400 mt-1">Seconds</span>
                            </motion.div>
                        </div>

                        {/* Controls */}
                        <div className="mt-8 flex items-center gap-4">
                            <button
                                onClick={() => setBreathingActive(!breathingActive)}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs shadow-lg shadow-violet-500/25 transition-all cursor-pointer"
                            >
                                {breathingActive ? (
                                    <>
                                        <Pause className="w-4 h-4" />
                                        <span>Pause Guide</span>
                                    </>
                                ) : (
                                    <>
                                        <Play className="w-4 h-4 ml-0.5" />
                                        <span>Start Breathing Exercise</span>
                                    </>
                                )}
                            </button>

                            <button
                                onClick={() => {
                                    setBreathingActive(false);
                                    setBreathPhase("Inhale");
                                    setCountdown(4);
                                    setCyclesCompleted(0);
                                }}
                                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                                title="Reset"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4 font-mono">
                            Cycles completed this session: <span className="text-white font-bold">{cyclesCompleted}</span>
                        </p>
                    </div>

                    {/* Explanatory Info Card */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4 text-xs text-gray-300">
                        <div className="flex items-center gap-2 text-violet-400 font-bold uppercase tracking-wider">
                            <Wind className="w-4 h-4" />
                            <span>About Box Breathing</span>
                        </div>
                        <h3 className="text-lg font-bold text-white tracking-tight">The 4-4-4-4 Autonomic Reset</h3>
                        <p className="leading-relaxed text-gray-400">
                            Box breathing (also known as square breathing) is a time-tested physiological breath technique used by athletes, first responders, and mindfulness practitioners to downregulate acute autonomic arousal.
                        </p>

                        <div className="space-y-2 pt-2">
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-semibold text-white block">1. Inhale (4s)</span>
                                <span className="text-gray-400">Slow nasal inhalation expanding the diaphragm.</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-semibold text-white block">2. Hold Full (4s)</span>
                                <span className="text-gray-400">Maintain gentle lungs-full stillness without clamping.</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-semibold text-white block">3. Exhale (4s)</span>
                                <span className="text-gray-400">Smooth, steady exhalation relaxing the chest.</span>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="font-semibold text-white block">4. Hold Empty (4s)</span>
                                <span className="text-gray-400">Lungs-empty reset before beginning the next cycle.</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* TAB 2: Text-Based Mood Journal */}
            {tab === "journal" && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: New Entry Form */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-violet-400" />
                            <span>New Mood Reflection</span>
                        </h3>

                        <form onSubmit={handleCreateJournal} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">
                                    Entry Title
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. End of day thoughts..."
                                    value={journalTitle}
                                    onChange={(e) => setJournalTitle(e.target.value)}
                                    className="w-full px-3.5 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">
                                    Emotional Tag
                                </label>
                                <select
                                    value={journalMood}
                                    onChange={(e) => setJournalMood(e.target.value)}
                                    className="w-full px-3 py-2 bg-[#0A0E1A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                                >
                                    {["Happy", "Calm", "Reflective", "Anxious", "Frustrated", "Neutral", "Grateful"].map((m) => (
                                        <option key={m} value={m} className="bg-[#0A0E1A] text-white">{m}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-400 mb-1">
                                    Your Thoughts
                                </label>
                                <textarea
                                    rows={5}
                                    required
                                    placeholder="Write freely. How did your day feel? What thoughts are occupying your mind right now?"
                                    value={journalContent}
                                    onChange={(e) => setJournalContent(e.target.value)}
                                    className="w-full p-3.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 leading-relaxed resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingJournal}
                                className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Save Reflection</span>
                            </button>
                        </form>
                    </div>

                    {/* Right: Previous Journal Entries */}
                    <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                            <h3 className="text-sm font-bold text-white">Your Journal History ({journals.length})</h3>
                        </div>

                        {journals.length > 0 ? (
                            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                                {journals.map((j) => (
                                    <div key={j.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2 group hover:border-white/15 transition-all">
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <h4 className="text-sm font-bold text-white">{j.title}</h4>
                                                <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                                                    <span className="px-2 py-0.2 rounded-md bg-violet-600/20 text-violet-300 font-semibold">
                                                        {j.mood_tag}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{new Date(j.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteJournal(j.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-400 transition-colors"
                                                title="Delete entry"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>

                                        <p className="text-xs text-gray-300 leading-relaxed pt-1 whitespace-pre-wrap">
                                            {j.content}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500">
                                <BookOpen className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
                                <p className="text-xs font-semibold text-gray-300">Your journal is currently blank</p>
                                <p className="text-[11px] text-gray-500 mt-1">
                                    Take 2 minutes to write down whatever thoughts are top of mind.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 3: Affirmations & Grounding Activities */}
            {tab === "guidance" && guidance && (
                <div className="space-y-6">
                    {/* Personalized Affirmations Banner */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-900/40 via-indigo-900/30 to-purple-900/20 border border-violet-500/30 shadow-xl space-y-3">
                        <div className="flex items-center gap-2 text-violet-300 text-xs font-bold uppercase tracking-wider">
                            <Sparkles className="w-4 h-4" />
                            <span>Daily Positive Affirmations (Tailored to: {guidance.recent_mood})</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                            {guidance.affirmations.map((aff, i) => (
                                <div key={i} className="p-4 rounded-xl bg-black/30 border border-white/10 text-xs text-gray-200 italic leading-relaxed flex items-start gap-2">
                                    <span className="text-violet-400 font-serif text-lg leading-none">“</span>
                                    <span>{aff}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Wellness Activity Cards */}
                    <div>
                        <h3 className="text-sm font-bold text-white mb-4">Mindfulness & Somatic Exercises</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {guidance.activities.map((act) => (
                                <div key={act.id} className="p-5 rounded-2xl bg-[#0D1322] border border-white/10 space-y-2.5 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/5 text-violet-300 border border-white/10">
                                            {act.category} • {act.duration_minutes} min
                                        </span>
                                    </div>
                                    <h4 className="text-base font-bold text-white">{act.title}</h4>
                                    <p className="text-xs text-gray-400 leading-relaxed">{act.description}</p>
                                    <div className="pt-2 border-t border-white/5 text-[11px] text-cyan-300 font-medium">
                                        Benefit: {act.benefit}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center gap-3 text-xs text-gray-400">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0" />
                        <p>{guidance.disclaimer}</p>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
