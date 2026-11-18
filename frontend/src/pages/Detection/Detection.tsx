import { useState, useRef} from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import {
    Camera,
    Upload,
    Sparkles,
    CheckCircle2,
    Save,
    RotateCcw,
    Music,
    Info,
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import { useMood } from "../../context/MoodContext";

interface DetectionResult {
    emotion: string;
    confidence: number;
    probabilities: { [key: string]: number };
    bounding_box: { x: number; y: number; w: number; h: number } | null;
    faces_detected: number;
    timestamp: string;
}

interface SongRecommendation {
    title: string;
    artist: string;
    videoId: string;
    genre?: string;
    mood_category?: string;
}

const EMOTION_COLORS: { [key: string]: { bg: string; text: string; bar: string } } = {
    Happy: { bg: "from-amber-500/20 to-yellow-500/10 border-amber-500/30", text: "text-amber-400", bar: "bg-amber-400" },
    Sad: { bg: "from-blue-500/20 to-indigo-500/10 border-blue-500/30", text: "text-blue-400", bar: "bg-blue-400" },
    Angry: { bg: "from-rose-500/20 to-red-500/10 border-rose-500/30", text: "text-rose-400", bar: "bg-rose-400" },
    Surprise: { bg: "from-purple-500/20 to-pink-500/10 border-purple-500/30", text: "text-purple-400", bar: "bg-purple-400" },
    Fear: { bg: "from-emerald-500/20 to-teal-500/10 border-emerald-500/30", text: "text-emerald-400", bar: "bg-emerald-400" },
    Disgust: { bg: "from-cyan-500/20 to-blue-500/10 border-cyan-500/30", text: "text-cyan-400", bar: "bg-cyan-400" },
    Neutral: { bg: "from-slate-500/20 to-gray-500/10 border-slate-500/30", text: "text-slate-300", bar: "bg-slate-400" },
};
const getErrorMessage = (error: any, fallback: string): string => {
    const detail = error?.response?.data?.detail;

    if (typeof detail === "string") {
        return detail;
    }

    if (Array.isArray(detail)) {
        return detail
            .map((item) => item?.msg || "Invalid request")
            .join(", ");
    }

    return fallback;
};
export default function Detection() {
    const webcamRef = useRef<Webcam>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { setMood } = useMood();

    const [mode, setMode] = useState<"webcam" | "upload">("webcam");
    const [cameraActive, setCameraActive] = useState(true);
    const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);
    const [selectedImageBlob, setSelectedImageBlob] = useState<Blob | null>(null);

    const [analyzing, setAnalyzing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [savedSuccessfully, setSavedSuccessfully] = useState(false);
    const [moodNote, setMoodNote] = useState("");

    const [result, setResult] = useState<DetectionResult | null>(null);
    const [recommendedSong, setRecommendedSong] = useState<SongRecommendation | null>(null);

    // Handle File upload pick
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImageBlob(file);
            const reader = new FileReader();
            reader.onload = () => {
                setSelectedImagePreview(reader.result as string);
                setResult(null);
                setRecommendedSong(null);
                setSavedSuccessfully(false);
            };
            reader.readAsDataURL(file);
        }
    };

    // Analyze either webcam frame or uploaded file
    const handleAnalyze = async () => {
        let blobToSend: Blob | null = null;

        if (mode === "webcam") {
            const screenshot = webcamRef.current?.getScreenshot();
            if (!screenshot) {
                toast.error("Unable to capture frame. Please ensure camera access is granted.");
                return;
            }
            try {
                const res = await fetch(screenshot);
                blobToSend = await res.blob();
            } catch {
                toast.error("Error preparing captured image.");
                return;
            }
        } else {
            if (!selectedImageBlob) {
                toast.error("Please select an image file first");
                return;
            }
            blobToSend = selectedImageBlob;
        }

        setAnalyzing(true);
        setSavedSuccessfully(false);

        try {
            const formData = new FormData();
            formData.append("file", blobToSend, "frame.jpg");

            // Emotion detection
            const detectRes = await API.post<DetectionResult>("/api/emotion/detect", formData);
            const data = detectRes.data;
            setResult(data);

            // Update context
            setMood(data.emotion, data.confidence, data.probabilities);

            // Fetch personalized music recommendation
            try {
                const musicRes = await API.get<SongRecommendation>(`/api/music/recommend/${data.emotion}`);
                setRecommendedSong(musicRes.data);
            } catch (musicErr) {
                console.warn("Music recommendation fetch warning:", musicErr);
            }

            toast.success(`Detected expression: ${data.emotion} (${data.confidence}%)`);
        } catch (err: any) {
            toast.error(
                getErrorMessage(err, "Could not complete analysis. Ensure backend is running.")
            );
        } finally {
            setAnalyzing(false);
        }
    };

    // Save record to persistent database
    const handleSaveToHistory = async () => {
        if (!result) return;
        setSaving(true);
        try {
            await API.post("/api/emotion/save", {
                emotion: result.emotion,
                confidence: result.confidence,
                probabilities: result.probabilities,
                method: mode,
                note: moodNote.trim() || undefined,
                song_title: recommendedSong?.title,
                song_artist: recommendedSong?.artist
            });
            setSavedSuccessfully(true);
            toast.success("Mood entry saved to your history! 🌟");
        } catch (err: any) {
            toast.error(getErrorMessage(err, "Failed to save record."));
        } finally {
            setSaving(false);
        }
    };

    const resetAnalysis = () => {
        setResult(null);
        setRecommendedSong(null);
        setSelectedImagePreview(null);
        setSelectedImageBlob(null);
        setMoodNote("");
        setSavedSuccessfully(false);
    };

    const currentStyle = result ? (EMOTION_COLORS[result.emotion] || EMOTION_COLORS.Neutral) : EMOTION_COLORS.Neutral;

    return (
        <DashboardLayout
            title="Facial Emotion Detection"
            subtitle="Real-time CNN vision analysis with full 7-class probability breakdown"
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Column: Camera / Upload Viewport */}
                <div className="lg:col-span-7 space-y-5">
                    {/* Mode Switcher Tabs */}
                    <div className="flex items-center gap-2 p-1.5 bg-[#0D1322] border border-white/10 rounded-2xl w-fit">
                        <button
                            onClick={() => { setMode("webcam"); resetAnalysis(); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                mode === "webcam"
                                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <Camera className="w-3.5 h-3.5" />
                            Live Camera
                        </button>
                        <button
                            onClick={() => { setMode("upload"); resetAnalysis(); }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                                mode === "upload"
                                    ? "bg-violet-600 text-white shadow-md shadow-violet-500/20"
                                    : "text-gray-400 hover:text-white"
                            }`}
                        >
                            <Upload className="w-3.5 h-3.5" />
                            Upload Image
                        </button>
                    </div>

                    {/* Viewport Frame */}
                    <div className="relative rounded-2xl overflow-hidden bg-[#0A0E1A] border border-white/10 aspect-video flex items-center justify-center shadow-2xl group">
                        {mode === "webcam" ? (
                            cameraActive ? (
                                <Webcam
                                    ref={webcamRef}
                                    audio={false}
                                    screenshotFormat="image/jpeg"
                                    videoConstraints={{ facingMode: "user", width: 1280, height: 720 }}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-6 text-gray-500">
                                    <Camera className="w-12 h-12 mx-auto mb-2 opacity-40" />
                                    <p className="text-sm">Camera preview paused</p>
                                </div>
                            )
                        ) : (
                            selectedImagePreview ? (
                                <img
                                    src={selectedImagePreview}
                                    alt="Upload preview"
                                    className="w-full h-full object-contain"
                                />
                            ) : (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-8 text-center cursor-pointer hover:bg-white/[0.02] transition-colors w-full h-full flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl m-4"
                                >
                                    <Upload className="w-10 h-10 text-violet-400 mb-3" />
                                    <p className="text-sm font-semibold text-white">Click or drag image file here</p>
                                    <p className="text-xs text-gray-400 mt-1">Supports JPG, PNG, WebP (under 10MB)</p>
                                </div>
                            )
                        )}

                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />

                        {/* Visual Scanning Effect when analyzing */}
                        {analyzing && (
                            <motion.div
                                initial={{ top: 0 }}
                                animate={{ top: "100%" }}
                                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                                className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#22d3ee] pointer-events-none"
                            />
                        )}
                    </div>

                    {/* Action Toolbar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-[#0D1322] border border-white/10 rounded-2xl">
                        <div className="flex items-center gap-2">
                            {mode === "webcam" && (
                                <button
                                    onClick={() => setCameraActive(!cameraActive)}
                                    className="px-3.5 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    {cameraActive ? "Pause Camera" : "Resume Camera"}
                                </button>
                            )}
                            {result && (
                                <button
                                    onClick={resetAnalysis}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                                >
                                    <RotateCcw className="w-3.5 h-3.5" />
                                    Reset
                                </button>
                            )}
                        </div>

                        <button
                            onClick={handleAnalyze}
                            disabled={analyzing}
                            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:to-cyan-400 text-white font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 cursor-pointer"
                        >
                            {analyzing ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    <span>Analyzing Facial Features...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className="w-4 h-4 text-cyan-200" />
                                    <span>{mode === "webcam" ? "Capture & Analyze" : "Analyze Upload"}</span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Non-clinical Ethical Disclaimer */}
                    <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3 text-xs text-gray-400 leading-relaxed">
                        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                        <p>
                            <span className="font-semibold text-gray-300">Privacy & Scientific Disclaimer:</span> Facial emotion classification uses machine learning to estimate visible facial movements and patterns. It provides an expression estimate, not a definitive psychological diagnosis. No facial images are stored on our servers.
                        </p>
                    </div>
                </div>

                {/* Right Column: Dynamic Analysis & Recommendation Panel */}
                <div className="lg:col-span-5 space-y-6">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Primary Result Banner */}
                            <div className={`p-6 rounded-2xl bg-gradient-to-br ${currentStyle.bg} border backdrop-blur-xl relative overflow-hidden shadow-2xl`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs uppercase tracking-widest font-bold text-gray-400">
                                        Primary Expression
                                    </span>
                                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-white/10 ${currentStyle.text}`}>
                                        {result.confidence}% Confidence
                                    </span>
                                </div>

                                <div className="flex items-baseline gap-3">
                                    <h2 className="text-4xl font-extrabold text-white tracking-tight">
                                        {result.emotion}
                                    </h2>
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    Analyzed via {result.faces_detected > 0 ? "face cascade detection" : "global pattern fallback"} at {new Date(result.timestamp).toLocaleTimeString()}
                                </p>
                            </div>

                            {/* 7-Class Probability Distribution */}
                            <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4 shadow-xl">
                                <h3 className="text-xs uppercase font-bold tracking-wider text-gray-400 flex items-center gap-2">
                                    <span>7-Class Emotion Probability Breakdown</span>
                                </h3>

                                <div className="space-y-2.5">
                                    {Object.entries(result.probabilities).map(([emo, val]) => (
                                        <div key={emo} className="space-y-1">
                                            <div className="flex justify-between text-xs">
                                                <span className={`font-medium ${emo === result.emotion ? "text-white font-bold" : "text-gray-400"}`}>
                                                    {emo}
                                                </span>
                                                <span className="text-gray-400 font-mono">{val}%</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${val}%` }}
                                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                                    className={`h-full ${emo === result.emotion ? currentStyle.bar : "bg-indigo-500/50"}`}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Save to Mood History Section */}
                            <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 space-y-4 shadow-xl">
                                <h3 className="text-xs uppercase font-bold tracking-wider text-gray-300">
                                    Save To Your Mood History
                                </h3>

                                <input
                                    type="text"
                                    placeholder="Add an optional note (e.g. Preparing for demo)..."
                                    value={moodNote}
                                    onChange={(e) => setMoodNote(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-violet-500"
                                />

                                <button
                                    onClick={handleSaveToHistory}
                                    disabled={saving || savedSuccessfully}
                                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                                        savedSuccessfully
                                            ? "bg-emerald-600/30 text-emerald-300 border border-emerald-500/30"
                                            : "bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/20"
                                    }`}
                                >
                                    {savedSuccessfully ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Saved to Persistent History</span>
                                        </>
                                    ) : saving ? (
                                        <span>Saving...</span>
                                    ) : (
                                        <>
                                            <Save className="w-4 h-4" />
                                            <span>Save Entry to History</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Recommended Music Preview */}
                            {recommendedSong && (
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-violet-950/40 via-[#0D1322] to-black border border-violet-500/20 shadow-xl space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-violet-400 text-xs font-bold uppercase tracking-wider">
                                            <Music className="w-4 h-4" />
                                            <span>Matched Music Companion</span>
                                        </div>
                                        <span className="text-[11px] text-gray-400 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                                            {recommendedSong.mood_category || "Uplifting"}
                                        </span>
                                    </div>

                                    <div>
                                        <h4 className="text-base font-bold text-white">{recommendedSong.title}</h4>
                                        <p className="text-xs text-gray-400">{recommendedSong.artist} • {recommendedSong.genre || "Pop"}</p>
                                    </div>

                                    {recommendedSong.videoId && (
                                        <div className="rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                            <iframe
                                                width="100%"
                                                height="180"
                                                src={`https://www.youtube.com/embed/${recommendedSong.videoId}`}
                                                title={recommendedSong.title}
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="border-0"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        /* Empty State before detection */
                        <div className="p-8 rounded-2xl bg-[#0D1322]/60 border border-white/5 text-center space-y-4">
                            <div className="w-14 h-14 rounded-2xl bg-violet-600/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mx-auto">
                                <Sparkles className="w-7 h-7" />
                            </div>
                            <h3 className="text-lg font-bold text-white">Awaiting Detection</h3>
                            <p className="text-xs text-gray-400 max-w-sm mx-auto leading-relaxed">
                                Align your face in front of the camera or upload a clear portrait photo, then click Analyze. The CNN model will detect your facial expression and map out all seven emotion probabilities.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
