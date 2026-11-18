import { useEffect, useState } from "react";
import {
    BarChart3,
    Info,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid
} from "recharts";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

interface EmotionCount {
    emotion: string;
    count: number;
    percentage: number;
}

interface DailyTrendPoint {
    date: string;
    dominant_emotion: string;
    confidence_avg: number;
    count: number;
}

interface WeekdayFrequency {
    weekday: string;
    dominant_emotion: string;
    count: number;
}

interface ExpressionGrouping {
    category: string;
    count: number;
    percentage: number;
    disclaimer: string;
}

interface AnalyticsData {
    total_detections: number;
    most_frequent_emotion: string;
    today_count: number;
    today_dominant_emotion: string | null;
    emotion_distribution: EmotionCount[];
    weekly_trends: DailyTrendPoint[];
    weekday_distribution: WeekdayFrequency[];
    expression_breakdown: ExpressionGrouping[];
    comparison: {
        this_week_total: number;
        last_week_total: number;
        change_percentage: number;
    };
}

const COLORS = ["#8B5CF6", "#3B82F6", "#EC4899", "#10B981", "#F59E0B", "#06B6D4", "#64748B"];
const CATEGORY_COLORS: { [key: string]: string } = {
    Positive: "#10B981",
    Neutral: "#64748B",
    Negative: "#F43F5E"
};

export default function AnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            setLoading(true);
            try {
                const res = await API.get<AnalyticsData>("/api/analytics/overview");
                setData(res.data);
            } catch {
                toast.error("Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    return (
        <DashboardLayout
            title="AI Mood Analytics"
            subtitle="Quantitative emotional expression insights computed strictly from your database history"
        >
            {loading ? (
                <div className="p-16 text-center text-gray-400">
                    <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-xs">Computing analytics from your mood records...</p>
                </div>
            ) : data && data.total_detections > 0 ? (
                <div className="space-y-8">
                    {/* Top KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="p-5 rounded-2xl bg-[#0D1322] border border-white/10 shadow-lg">
                            <span className="text-xs text-gray-400 block mb-1">Total Detections</span>
                            <p className="text-3xl font-extrabold text-white">{data.total_detections}</p>
                            <p className="text-[11px] text-gray-400 mt-2">All time personal records</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#0D1322] border border-white/10 shadow-lg">
                            <span className="text-xs text-gray-400 block mb-1">Most Frequent Expression</span>
                            <p className="text-3xl font-extrabold text-violet-400">{data.most_frequent_emotion}</p>
                            <p className="text-[11px] text-gray-400 mt-2">Highest historical count</p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#0D1322] border border-white/10 shadow-lg">
                            <span className="text-xs text-gray-400 block mb-1">Today's Check-ins</span>
                            <p className="text-3xl font-extrabold text-cyan-400">{data.today_count}</p>
                            <p className="text-[11px] text-gray-400 mt-2">
                                {data.today_dominant_emotion ? `Dominant: ${data.today_dominant_emotion}` : "None logged today"}
                            </p>
                        </div>

                        <div className="p-5 rounded-2xl bg-[#0D1322] border border-white/10 shadow-lg">
                            <span className="text-xs text-gray-400 block mb-1">Week-over-Week Volume</span>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-extrabold text-white">
                                    {Math.abs(data.comparison.change_percentage)}%
                                </p>
                                {data.comparison.change_percentage >= 0 ? (
                                    <ArrowUpRight className="w-5 h-5 text-emerald-400" />
                                ) : (
                                    <ArrowDownRight className="w-5 h-5 text-rose-400" />
                                )}
                            </div>
                            <p className="text-[11px] text-gray-400 mt-2">
                                {data.comparison.this_week_total} scans vs {data.comparison.last_week_total} last week
                            </p>
                        </div>
                    </div>

                    {/* Chart Row 1: Weekly Volume Trends + 7-Class Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* 7-Day Trend Line Chart */}
                        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-white">7-Day Detection Activity Trend</h3>
                                <p className="text-xs text-gray-400">Daily scan count and average confidence score</p>
                            </div>

                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data.weekly_trends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                        <XAxis dataKey="date" stroke="#64748B" fontSize={11} />
                                        <YAxis stroke="#64748B" fontSize={11} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "10px", fontSize: "12px" }}
                                            itemStyle={{ color: "#F8FAFC" }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="count"
                                            stroke="#8B5CF6"
                                            strokeWidth={3}
                                            dot={{ fill: "#8B5CF6", r: 4 }}
                                            activeDot={{ r: 6 }}
                                            name="Detections"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Emotion Distribution Donut Chart */}
                        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-white">7-Class Emotion Distribution</h3>
                                <p className="text-xs text-gray-400">Proportional breakdown of classified expressions</p>
                            </div>

                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={data.emotion_distribution.filter((d) => d.count > 0)}
                                            dataKey="count"
                                            nameKey="emotion"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={55}
                                            outerRadius={80}
                                            paddingAngle={4}
                                        >
                                            {data.emotion_distribution.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "10px", fontSize: "12px" }}
                                        />
                                        <Legend wrapperStyle={{ fontSize: "11px", color: "#94A3B8" }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Chart Row 2: Weekday Frequency + Expression Categorization */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Weekday Bar Chart */}
                        <div className="lg:col-span-7 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-white">Activity by Day of Week</h3>
                                <p className="text-xs text-gray-400">Total check-in frequency distributed across days</p>
                            </div>

                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={data.weekday_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                                        <XAxis dataKey="weekday" stroke="#64748B" fontSize={11} />
                                        <YAxis stroke="#64748B" fontSize={11} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: "#0F172A", borderColor: "#334155", borderRadius: "10px", fontSize: "12px" }}
                                        />
                                        <Bar dataKey="count" fill="#6366F1" radius={[6, 6, 0, 0]} name="Check-ins" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Expression Grouping Breakdown */}
                        <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                            <div>
                                <h3 className="text-sm font-bold text-white">Observational Expression Grouping</h3>
                                <p className="text-xs text-gray-400">Positive, Neutral, and Negative categorization</p>
                            </div>

                            <div className="space-y-4 pt-2">
                                {data.expression_breakdown.map((group) => (
                                    <div key={group.category} className="space-y-1.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="font-semibold text-white">{group.category} Expressions</span>
                                            <span className="text-gray-400 font-mono">{group.count} ({group.percentage}%)</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${group.percentage}%`,
                                                    backgroundColor: CATEGORY_COLORS[group.category] || "#8B5CF6"
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2.5 text-[11px] text-gray-400">
                                <Info className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                                <p>
                                    Observational grouping maps facial expressions (e.g. smile &rarr; positive, frown &rarr; negative). This is an informal presentation aid and not a medical or psychiatric mental health diagnostic.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Empty state when user has 0 records */
                <div className="p-16 rounded-2xl bg-[#0D1322] border border-white/10 text-center max-w-lg mx-auto shadow-xl space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto">
                        <BarChart3 className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-white">No Analytics Available Yet</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                        To maintain authenticity and respect scientific integrity, MoodSync AI never fabricates fake chart data. Start using Facial Emotion Detection to log your real emotional expressions and unlock rich personal analytics!
                    </p>
                    <a
                        href="/detection"
                        className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-500/25 transition-all"
                    >
                        Log Your First Mood
                    </a>
                </div>
            )}
        </DashboardLayout>
    );
}
