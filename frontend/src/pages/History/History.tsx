import { useState, useEffect } from "react";
import {
    History as HistoryIcon,
    Search,
    Filter,
    Download,
    Trash2,
    Calendar,
    ChevronLeft,
    ChevronRight,
    ExternalLink,
    AlertCircle,
    Info,
    Music,
    Smile
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
    song_artist?: string;
    probabilities?: string;
    created_at: string;
}

const EMOTIONS = ["All", "Happy", "Sad", "Angry", "Surprise", "Fear", "Disgust", "Neutral"];

export default function HistoryPage() {
    const [records, setRecords] = useState<EmotionRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [limit] = useState(15);
    const [loading, setLoading] = useState(true);

    // Filters
    const [selectedEmotion, setSelectedEmotion] = useState("All");
    const [search, setSearch] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    // Details Modal
    const [activeRecord, setActiveRecord] = useState<EmotionRecord | null>(null);

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const params: any = { page, limit };
            if (selectedEmotion !== "All") params.emotion = selectedEmotion;
            if (search.trim()) params.search = search.trim();
            if (startDate) params.start_date = startDate;
            if (endDate) params.end_date = endDate;

            const res = await API.get("/api/history", { params });
            setRecords(res.data.records);
            setTotal(res.data.total);
        } catch (err: any) {
            toast.error("Failed to load mood history");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [page, selectedEmotion]);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchHistory();
    };

    const handleDeleteRecord = async (id: number) => {
        if (!confirm("Are you sure you want to delete this mood record?")) return;
        try {
            await API.delete(`/api/history/${id}`);
            toast.success("Record deleted");
            setRecords((prev) => prev.filter((r) => r.id !== id));
            setTotal((prev) => Math.max(0, prev - 1));
            if (activeRecord?.id === id) setActiveRecord(null);
        } catch {
            toast.error("Failed to delete record");
        }
    };

    const handleClearAll = async () => {
        if (!confirm("WARNING: This will permanently delete ALL your personal emotion history records. Continue?")) return;
        try {
            await API.delete("/api/history/clear");
            toast.success("All personal mood records cleared");
            setRecords([]);
            setTotal(0);
            setActiveRecord(null);
        } catch {
            toast.error("Failed to clear records");
        }
    };

    const handleExportCSV = async () => {
        try {
            const response = await API.get("/api/history/export-csv", {
                responseType: "blob"
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `moodsync_history_${new Date().toISOString().slice(0, 10)}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("CSV export downloaded successfully!");
        } catch {
            toast.error("Failed to export history CSV");
        }
    };

    const totalPages = Math.ceil(total / limit) || 1;

    return (
        <DashboardLayout
            title="Personal Mood History"
            subtitle="Search, filter, inspect and export your complete emotion timeline"
            actions={
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleExportCSV}
                        disabled={records.length === 0}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-medium border border-white/10 transition-colors disabled:opacity-40"
                    >
                        <Download className="w-3.5 h-3.5" />
                        <span>Export CSV</span>
                    </button>
                    {records.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-medium border border-red-500/20 transition-colors"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Clear All</span>
                        </button>
                    )}
                </div>
            }
        >
            {/* Filter & Search Bar */}
            <div className="p-4 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4">
                <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    {/* Search Field */}
                    <div className="md:col-span-5 relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by note, emotion, or song..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                        />
                    </div>

                    {/* Emotion Dropdown */}
                    <div className="md:col-span-3">
                        <select
                            value={selectedEmotion}
                            onChange={(e) => { setSelectedEmotion(e.target.value); setPage(1); }}
                            className="w-full px-3 py-2 bg-[#0A0E1A] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
                        >
                            {EMOTIONS.map((emo) => (
                                <option key={emo} value={emo} className="bg-[#0A0E1A] text-white">
                                    {emo === "All" ? "Filter by Emotion (All)" : emo}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Start Date */}
                    <div className="md:col-span-2">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-3 py-2 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-gray-300 focus:outline-none focus:border-violet-500"
                        />
                    </div>

                    {/* Apply Filter Button */}
                    <div className="md:col-span-2 flex items-center gap-2">
                        <button
                            type="submit"
                            className="w-full py-2 px-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-colors"
                        >
                            Search
                        </button>
                        {(search || selectedEmotion !== "All" || startDate || endDate) && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setSelectedEmotion("All");
                                    setStartDate("");
                                    setEndDate("");
                                    setPage(1);
                                    fetchHistory();
                                }}
                                className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-xs"
                            >
                                Reset
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Records List Table */}
            <div className="rounded-2xl bg-[#0D1322] border border-white/10 overflow-hidden shadow-xl">
                {loading ? (
                    <div className="p-12 text-center text-gray-400">
                        <div className="w-6 h-6 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                        <p className="text-xs">Loading your saved emotion history...</p>
                    </div>
                ) : records.length > 0 ? (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-xs">
                                <thead className="bg-black/30 border-b border-white/10 text-gray-400 uppercase tracking-wider font-semibold">
                                    <tr>
                                        <th className="py-3.5 px-6">Emotion</th>
                                        <th className="py-3.5 px-4">Confidence</th>
                                        <th className="py-3.5 px-4">Method</th>
                                        <th className="py-3.5 px-4">Note / Context</th>
                                        <th className="py-3.5 px-4">Recommendation</th>
                                        <th className="py-3.5 px-4">Timestamp</th>
                                        <th className="py-3.5 px-6 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-gray-300">
                                    {records.map((r) => (
                                        <tr key={r.id} className="hover:bg-white/[0.02] transition-colors group">
                                            <td className="py-3.5 px-6 font-semibold text-white">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                                                    <span>{r.emotion}</span>
                                                </div>
                                            </td>
                                            <td className="py-3.5 px-4 font-mono">{r.confidence}%</td>
                                            <td className="py-3.5 px-4">
                                                <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 font-bold">
                                                    {r.method}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-4 max-w-xs truncate">
                                                {r.note ? <span className="italic text-gray-200">"{r.note}"</span> : <span className="text-gray-500">—</span>}
                                            </td>
                                            <td className="py-3.5 px-4 text-gray-300">
                                                {r.song_title ? (
                                                    <span className="flex items-center gap-1.5 truncate">
                                                        <Music className="w-3 h-3 text-violet-400 shrink-0" />
                                                        <span>{r.song_title}</span>
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </td>
                                            <td className="py-3.5 px-4 font-mono text-gray-400">
                                                {new Date(r.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                                            </td>
                                            <td className="py-3.5 px-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => setActiveRecord(r)}
                                                        className="p-1.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                                                        title="View details"
                                                    >
                                                        <Info className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteRecord(r.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                        title="Delete record"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="py-4 px-6 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                            <span>
                                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, total)} of {total} entries
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <span>Page {page} of {totalPages}</span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="p-12 text-center text-gray-400">
                        <HistoryIcon className="w-10 h-10 mx-auto mb-3 opacity-30 text-indigo-400" />
                        <h4 className="text-sm font-semibold text-white">No mood records found</h4>
                        <p className="text-xs text-gray-500 mt-1">
                            {search || selectedEmotion !== "All"
                                ? "Try adjusting your search criteria or resetting filters."
                                : "You haven't saved any emotion records yet. Head over to Emotion Detection to log your first mood!"}
                        </p>
                    </div>
                )}
            </div>

            {/* Single Record Detail Modal */}
            {activeRecord && (
                <div
                    onClick={() => setActiveRecord(null)}
                    className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="w-full max-w-lg rounded-2xl bg-[#0D1322] border border-white/10 p-6 shadow-2xl space-y-5"
                    >
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <span>Mood Record #{activeRecord.id}</span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-violet-600/30 text-violet-300">
                                        {activeRecord.emotion}
                                    </span>
                                </h3>
                                <p className="text-xs text-gray-400 mt-0.5 font-mono">
                                    {new Date(activeRecord.created_at).toLocaleString()}
                                </p>
                            </div>
                            <button
                                onClick={() => setActiveRecord(null)}
                                className="p-1 text-gray-400 hover:text-white"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-xs">
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-gray-400">Confidence Score</span>
                                <p className="text-base font-bold text-white mt-1">{activeRecord.confidence}%</p>
                            </div>
                            <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
                                <span className="text-gray-400">Detection Method</span>
                                <p className="text-base font-bold text-white mt-1 capitalize">{activeRecord.method}</p>
                            </div>
                        </div>

                        {activeRecord.note && (
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                                <span className="text-gray-400 block mb-1">User Note</span>
                                <p className="text-gray-200 italic">"{activeRecord.note}"</p>
                            </div>
                        )}

                        {activeRecord.song_title && (
                            <div className="p-4 rounded-xl bg-violet-950/20 border border-violet-500/20 text-xs">
                                <span className="text-violet-400 font-semibold block mb-1">Associated Recommendation</span>
                                <p className="text-white font-bold">{activeRecord.song_title}</p>
                                <p className="text-gray-400">{activeRecord.song_artist}</p>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                onClick={() => handleDeleteRecord(activeRecord.id)}
                                className="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors"
                            >
                                Delete Record
                            </button>
                            <button
                                onClick={() => setActiveRecord(null)}
                                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
