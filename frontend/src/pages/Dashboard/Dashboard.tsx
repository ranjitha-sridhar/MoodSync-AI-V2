import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    Sparkles,
    Camera,
    TrendingUp,
    Calendar,
    Music2,
    HeartHandshake,
    ArrowRight,
    Clock,
    Smile,
    Activity,
    ChevronRight
} from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useMood } from "../../context/MoodContext";

interface HistoryItem {
    id: number;
    emotion: string;
    confidence: number;
    method: string;
    note?: string;
    song_title?: string;
    song_artist?: string;
    created_at: string;
}

interface AnalyticsOverview {
    total_detections: number;
    most_frequent_emotion: string;
    today_count: number;
    today_dominant_emotion?: string;
}

export default function Dashboard() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { emotion, confidence, refreshCounter } = useMood();

    const [loading, setLoading] = useState(true);
    const [recentRecords, setRecentRecords] = useState<HistoryItem[]>([]);
    const [analytics, setAnalytics] = useState<AnalyticsOverview>({
        total_detections: 0,
        most_frequent_emotion: "None",
        today_count: 0
    });

    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

    useEffect(() => {
        const fetchDashboardData = async () => {
            setLoading(true);
            try {
                // Fetch recent history
                const histRes = await API.get("/api/history?limit=5");
                setRecentRecords(histRes.data.records || []);

                // Fetch analytics summary
                const analyticsRes = await API.get("/api/analytics/overview");
                setAnalytics(analyticsRes.data);
            } catch (err) {
                console.warn("Dashboard data fetch note:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [refreshCounter]);

    return (
        <DashboardLayout
            title={`${greeting}, ${user?.name || "Friend"} 👋`}
            subtitle="Here is your real-time emotional wellness snapshot"
        >
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Metric 1: Latest Mood */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1322] to-[#0A0E1A] border border-white/10 shadow-lg relative overflow-hidden"
                >
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Latest Detected Mood</span>
                        <Smile className="w-4 h-4 text-violet-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            {recentRecords.length > 0 ? recentRecords[0].emotion : (emotion || "Neutral")}
                        </span>
                        <span className="text-xs text-violet-400 font-semibold">
                            {recentRecords.length > 0 ? `${recentRecords[0].confidence}%` : `${confidence}%`}
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2 truncate">
                        {recentRecords.length > 0
                            ? `Logged ${new Date(recentRecords[0].created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                            : "Ready for detection"}
                    </p>
                </motion.div>

                {/* Metric 2: Today's Scans */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1322] to-[#0A0E1A] border border-white/10 shadow-lg relative overflow-hidden"
                >
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Today's Check-ins</span>
                        <Activity className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            {analytics.today_count}
                        </span>
                        <span className="text-xs text-gray-400">detections</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                        {analytics.today_dominant_emotion ? `Dominant: ${analytics.today_dominant_emotion}` : "No detections yet today"}
                    </p>
                </motion.div>

                {/* Metric 3: Most Frequent Expression */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1322] to-[#0A0E1A] border border-white/10 shadow-lg relative overflow-hidden"
                >
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>All-Time Primary</span>
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            {analytics.most_frequent_emotion || "None"}
                        </span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                        Across {analytics.total_detections} total database records
                    </p>
                </motion.div>

                {/* Metric 4: Total Records */}
                <motion.div
                    whileHover={{ y: -3 }}
                    className="p-5 rounded-2xl bg-gradient-to-br from-[#0D1322] to-[#0A0E1A] border border-white/10 shadow-lg relative overflow-hidden"
                >
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                        <span>Total Records</span>
                        <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold text-white tracking-tight">
                            {analytics.total_detections}
                        </span>
                        <span className="text-xs text-gray-400">saved</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-2">
                        Secured & private to your account
                    </p>
                </motion.div>
            </div>

            {/* Quick Actions Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div
                    onClick={() => navigate("/detection")}
                    className="p-6 rounded-2xl bg-gradient-to-r from-violet-600/20 via-indigo-600/20 to-transparent border border-violet-500/20 hover:border-violet-500/40 cursor-pointer transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-violet-600/30 flex items-center justify-center text-violet-300 mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Detect Your Emotion</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Run real-time facial analysis via webcam or image upload.
                    </p>
                </div>

                <div
                    onClick={() => navigate("/music")}
                    className="p-6 rounded-2xl bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-transparent border border-cyan-500/20 hover:border-cyan-500/40 cursor-pointer transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-cyan-600/30 flex items-center justify-center text-cyan-300 mb-4 group-hover:scale-110 transition-transform">
                        <Music2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Music Studio</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Listen to curated emotion playlists and personalized playlists.
                    </p>
                </div>

                <div
                    onClick={() => navigate("/mindmate")}
                    className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600/20 via-teal-600/20 to-transparent border border-emerald-500/20 hover:border-emerald-500/40 cursor-pointer transition-all group"
                >
                    <div className="w-10 h-10 rounded-xl bg-emerald-600/30 flex items-center justify-center text-emerald-300 mb-4 group-hover:scale-110 transition-transform">
                        <HeartHandshake className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>MindMate Companion</span>
                        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">
                        Practice 4-4-4-4 box breathing, read affirmations, and write reflections.
                    </p>
                </div>
            </div>

            {/* Recent Mood History Section */}
            <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-base font-bold text-white">Recent Mood Timeline</h2>
                        <p className="text-xs text-gray-400">Your latest logged emotional check-ins</p>
                    </div>
                    <button
                        onClick={() => navigate("/history")}
                        className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold transition-colors"
                    >
                        <span>View All History</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                </div>

                {recentRecords.length > 0 ? (
                    <div className="divide-y divide-white/5">
                        {recentRecords.map((item) => (
                            <div key={item.id} className="py-3.5 flex items-center justify-between gap-4 group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center font-bold text-xs text-white uppercase">
                                        {item.emotion.slice(0, 2)}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-semibold text-white">{item.emotion}</span>
                                            <span className="text-[11px] text-gray-400">({item.confidence}%)</span>
                                            <span className="text-[10px] uppercase font-bold text-gray-400 px-1.5 py-0.5 rounded bg-white/5">
                                                {item.method}
                                            </span>
                                        </div>
                                        {item.note ? (
                                            <p className="text-xs text-gray-300 mt-0.5 italic">"{item.note}"</p>
                                        ) : (
                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {item.song_title ? `Matched track: ${item.song_title}` : "Logged without note"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <span className="text-xs text-gray-400 shrink-0 font-mono">
                                    {new Date(item.created_at).toLocaleDateString()} {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center border border-dashed border-white/10 rounded-xl">
                        <Sparkles className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                        <p className="text-sm font-semibold text-gray-300">No emotional records yet</p>
                        <p className="text-xs text-gray-500 mt-1">
                            Complete your first emotion detection to start building your personal timeline.
                        </p>
                        <button
                            onClick={() => navigate("/detection")}
                            className="mt-4 px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold hover:bg-violet-500 transition-colors"
                        >
                            Start Detection
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
