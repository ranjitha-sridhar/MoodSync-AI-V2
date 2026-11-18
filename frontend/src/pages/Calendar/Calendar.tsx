import { useState, useEffect } from "react";
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    Clock,
    Smile,
    Music
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";

interface EmotionRecord {
    id: number;
    emotion: string;
    confidence: number;
    method: string;
    note?: string;
    song_title?: string;
    created_at: string;
}

const EMOTION_DOT_COLORS: { [key: string]: string } = {
    Happy: "bg-amber-400",
    Sad: "bg-blue-400",
    Angry: "bg-rose-400",
    Surprise: "bg-purple-400",
    Fear: "bg-emerald-400",
    Disgust: "bg-cyan-400",
    Neutral: "bg-slate-400"
};

export default function CalendarPage() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [allRecords, setAllRecords] = useState<EmotionRecord[]>([]);
    const [, setLoading] = useState(true);
    const [selectedDateRecords, setSelectedDateRecords] = useState<EmotionRecord[]>([]);
    const [selectedDateString, setSelectedDateString] = useState<string>("");

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    useEffect(() => {
        const fetchRecords = async () => {
            setLoading(true);
            try {
                // Fetch user's mood records
                const res = await API.get("/api/history?limit=100");
                setAllRecords(res.data.records);
            } catch {
                toast.error("Failed to load mood calendar data");
            } finally {
                setLoading(false);
            }
        };

        fetchRecords();
    }, [currentDate]);

    // Calendar Calculations
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
        setSelectedDateRecords([]);
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
        setSelectedDateRecords([]);
    };

    // Filter records for a specific day
    const getRecordsForDay = (day: number) => {
        return allRecords.filter((r) => {
            const d = new Date(r.created_at);
            return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
        });
    };

    const handleDateClick = (day: number) => {
        const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const dayRecords = getRecordsForDay(day);
        setSelectedDateString(dateStr);
        setSelectedDateRecords(dayRecords);
    };

    return (
        <DashboardLayout
            title="Interactive Mood Calendar"
            subtitle="Browse your chronological mood records and notes mapped out across each day"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left: Monthly Calendar View */}
                <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-6">
                    {/* Month Navigator Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="w-5 h-5 text-violet-400" />
                            <h2 className="text-lg font-bold text-white tracking-tight">
                                {monthNames[month]} {year}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={prevMonth}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => setCurrentDate(new Date())}
                                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-300 font-medium transition-colors"
                            >
                                Today
                            </button>
                            <button
                                onClick={nextMonth}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Day of Week Header */}
                    <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-400 uppercase tracking-wider pb-2 border-b border-white/5">
                        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                            <div key={day} className="py-1">{day}</div>
                        ))}
                    </div>

                    {/* Days Grid */}
                    <div className="grid grid-cols-7 gap-2">
                        {/* Empty padding slots before first day */}
                        {Array.from({ length: firstDayOfMonth }).map((_, idx) => (
                            <div key={`empty-${idx}`} className="h-24 rounded-xl bg-transparent" />
                        ))}

                        {/* Calendar Day Tiles */}
                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                            const day = idx + 1;
                            const dayRecords = getRecordsForDay(day);
                            const isToday =
                                new Date().getDate() === day &&
                                new Date().getMonth() === month &&
                                new Date().getFullYear() === year;
                            const isSelected = selectedDateString === `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                            return (
                                <div
                                    key={day}
                                    onClick={() => handleDateClick(day)}
                                    className={`h-24 p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between group ${
                                        isSelected
                                            ? "bg-violet-600/20 border-violet-500 shadow-md shadow-violet-500/20"
                                            : isToday
                                            ? "bg-white/[0.04] border-violet-500/40"
                                            : "bg-white/[0.015] border-white/5 hover:border-white/20 hover:bg-white/[0.03]"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className={`text-xs font-semibold ${isToday ? "text-violet-400 font-bold" : "text-gray-400 group-hover:text-white"}`}>
                                            {day}
                                        </span>
                                        {dayRecords.length > 0 && (
                                            <span className="text-[10px] font-mono px-1.5 rounded-full bg-white/10 text-gray-300">
                                                {dayRecords.length}
                                            </span>
                                        )}
                                    </div>

                                    {/* Emotion Color Badges for day */}
                                    <div className="space-y-1">
                                        {dayRecords.slice(0, 2).map((r) => (
                                            <div
                                                key={r.id}
                                                className="flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-black/40 border border-white/5 text-[10px] text-gray-300 truncate"
                                            >
                                                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${EMOTION_DOT_COLORS[r.emotion] || "bg-violet-400"}`} />
                                                <span className="truncate">{r.emotion}</span>
                                            </div>
                                        ))}
                                        {dayRecords.length > 2 && (
                                            <span className="text-[9px] text-gray-400 block text-right">
                                                +{dayRecords.length - 2} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Calendar Legend */}
                    <div className="pt-4 border-t border-white/5 flex flex-wrap items-center gap-4 text-xs text-gray-400">
                        <span className="font-semibold text-gray-300">Emotion Legend:</span>
                        {Object.entries(EMOTION_DOT_COLORS).map(([emo, dotClass]) => (
                            <div key={emo} className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full ${dotClass}`} />
                                <span>{emo}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Selected Date Details Drilldown */}
                <div className="lg:col-span-4 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-5">
                    <div>
                        <h3 className="text-sm font-bold text-white">
                            {selectedDateString ? `Day Overview: ${selectedDateString}` : "Select a Date"}
                        </h3>
                        <p className="text-xs text-gray-400">
                            {selectedDateString
                                ? `${selectedDateRecords.length} emotion records logged on this day`
                                : "Click on any calendar day to inspect its full mood entries and notes"}
                        </p>
                    </div>

                    {selectedDateRecords.length > 0 ? (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                            {selectedDateRecords.map((r) => (
                                <div key={r.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${EMOTION_DOT_COLORS[r.emotion] || "bg-violet-400"}`} />
                                            <span className="font-bold text-white text-sm">{r.emotion}</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">{r.confidence}%</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                                        <Clock className="w-3 h-3" />
                                        <span>{new Date(r.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <span>•</span>
                                        <span className="capitalize">{r.method}</span>
                                    </div>

                                    {r.note && (
                                        <p className="text-xs text-gray-300 italic bg-black/20 p-2.5 rounded-lg border border-white/5">
                                            "{r.note}"
                                        </p>
                                    )}

                                    {r.song_title && (
                                        <div className="flex items-center gap-1.5 text-xs text-violet-300">
                                            <Music className="w-3 h-3 text-violet-400" />
                                            <span className="truncate">{r.song_title}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : selectedDateString ? (
                        <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                            <Smile className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-xs font-semibold text-gray-400">No records on this day</p>
                            <p className="text-[11px] text-gray-500 mt-1">
                                Check other days or log a mood with the camera.
                            </p>
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500 border border-dashed border-white/10 rounded-xl">
                            <CalendarIcon className="w-8 h-8 mx-auto mb-2 opacity-30 text-indigo-400" />
                            <p className="text-xs font-semibold text-gray-400">Select any date</p>
                            <p className="text-[11px] text-gray-500 mt-1">
                                Days with color dots represent past emotion detections.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
