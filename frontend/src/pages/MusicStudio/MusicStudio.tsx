import { useState, useEffect } from "react";
import {
    Music2,
    Play,
    Heart,
    Headphones,
    FolderHeart,
    Trash2,
    ExternalLink
} from "lucide-react";
import toast from "react-hot-toast";
import DashboardLayout from "../../components/layout/DashboardLayout";
import API from "../../services/api";
import { useMood } from "../../context/MoodContext";

interface SongItem {
    id: string;
    title: string;
    artist: string;
    videoId: string;
    genre: string;
    mood_category: string;
}

interface SavedSong {
    id: number;
    title: string;
    artist: string;
    video_id: string;
    genre: string;
    playlist_name: string;
    is_liked: boolean;
    created_at: string;
}

const EMOTION_TABS = ["Happy", "Sad", "Angry", "Neutral", "Fear", "Disgust", "Surprise"];

export default function MusicStudio() {
    const { emotion: currentDetectedEmotion } = useMood();
    const [selectedEmotion, setSelectedEmotion] = useState(currentDetectedEmotion || "Happy");
    const [playlist, setPlaylist] = useState<SongItem[]>([]);
    const [activeSong, setActiveSong] = useState<SongItem | null>(null);
    const [savedSongs, setSavedSongs] = useState<SavedSong[]>([]);
    const [energyProfile, setEnergyProfile] = useState<string>("");
    const [suggestedGenres, setSuggestedGenres] = useState<string[]>([]);
    const [viewMode, setViewMode] = useState<"recommendations" | "saved">("recommendations");
    const [, setLoading] = useState(true);

    const fetchRecommendations = async (emo: string) => {
        setLoading(true);
        try {
            const res = await API.get(`/api/music/recommend/${emo}`);
            setPlaylist(res.data.playlist || []);
            setEnergyProfile(res.data.energy_profile || "Balanced");
            setSuggestedGenres(res.data.suggested_genres || []);
            if (res.data.playlist && res.data.playlist.length > 0) {
                setActiveSong(res.data.playlist[0]);
            }
        } catch {
            toast.error("Could not fetch music recommendations");
        } finally {
            setLoading(false);
        }
    };

    const fetchSavedSongs = async () => {
        try {
            const res = await API.get<SavedSong[]>("/api/music/saved");
            setSavedSongs(res.data);
        } catch (err) {
            console.warn("Could not fetch saved songs", err);
        }
    };

    useEffect(() => {
        fetchRecommendations(selectedEmotion);
        fetchSavedSongs();
    }, [selectedEmotion]);

    const handleSaveSong = async (song: SongItem) => {
        try {
                await API.post("/api/music/saved", {
                title: song.title,
                artist: song.artist,
                video_id: song.videoId,
                genre: song.genre,
                emotion_tag: selectedEmotion,
                playlist_name: "Favorites"
            });
            toast.success(`"${song.title}" added to your Saved Songs! ❤️`);
            fetchSavedSongs();
        } catch {
            toast.error("Failed to save song");
        }
    };

    const handleRemoveSavedSong = async (id: number) => {
        try {
            await API.delete(`/api/music/saved/${id}`);
            toast.success("Song removed from your library");
            setSavedSongs((prev) => prev.filter((s) => s.id !== id));
        } catch {
            toast.error("Failed to remove song");
        }
    };

    return (
        <DashboardLayout
            title="Music Studio"
            subtitle="Emotion-adaptive soundtrack playlists tailored to your current emotional state"
            actions={
                <div className="flex items-center gap-2 p-1 bg-white/5 rounded-xl border border-white/10">
                    <button
                        onClick={() => setViewMode("recommendations")}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === "recommendations" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
                        }`}
                    >
                        Recommendations
                    </button>
                    <button
                        onClick={() => setViewMode("saved")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            viewMode === "saved" ? "bg-violet-600 text-white" : "text-gray-400 hover:text-white"
                        }`}
                    >
                        <FolderHeart className="w-3.5 h-3.5" />
                        <span>Saved ({savedSongs.length})</span>
                    </button>
                </div>
            }
        >
            {/* Emotion Category Switcher Bar */}
            {viewMode === "recommendations" && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {EMOTION_TABS.map((emo) => {
                            const isSelected = selectedEmotion === emo;
                            const isDetected = currentDetectedEmotion === emo;

                            return (
                                <button
                                    key={emo}
                                    onClick={() => setSelectedEmotion(emo)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                        isSelected
                                            ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-500/25"
                                            : "bg-[#0D1322] border border-white/5 text-gray-400 hover:text-white hover:border-white/15"
                                    }`}
                                >
                                    <span>{emo}</span>
                                    {isDetected && (
                                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-md bg-white/20 text-white font-extrabold tracking-wider">
                                            Current
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Energy profile & genre pills */}
                    <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">Energy Profile:</span>
                            <span className="font-semibold text-violet-300">{energyProfile}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">Recommended Genres:</span>
                            <div className="flex items-center gap-1.5">
                                {suggestedGenres.map((g) => (
                                    <span key={g} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-gray-300 text-[11px]">
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Stage Grid: Active Player + Track List */}
            {viewMode === "recommendations" ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Player Stage */}
                    <div className="lg:col-span-7 space-y-5">
                        {activeSong ? (
                            <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-2xl space-y-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Headphones className="w-5 h-5 text-violet-400" />
                                        <span className="text-xs uppercase font-bold tracking-wider text-gray-400">
                                            Now Playing
                                        </span>
                                    </div>
                                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-600/20 text-violet-300 border border-violet-500/30">
                                        {activeSong.mood_category}
                                    </span>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-extrabold text-white tracking-tight">{activeSong.title}</h3>
                                    <p className="text-sm text-gray-400 mt-0.5">{activeSong.artist} • {activeSong.genre}</p>
                                </div>

                                {/* Verified Embedded Player */}
                                <div className="rounded-xl overflow-hidden border border-white/10 shadow-xl bg-black">
                                    <iframe
                                        width="100%"
                                        height="280"
                                        src={`https://www.youtube.com/embed/${activeSong.videoId}?autoplay=0`}
                                        title={activeSong.title}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        className="w-full border-0"
                                    />
                                </div>

                                <div className="flex items-center justify-between pt-2">
                                    <button
                                        onClick={() => handleSaveSong(activeSong)}
                                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-violet-600/20 hover:text-violet-300 text-white text-xs font-semibold border border-white/10 transition-colors cursor-pointer"
                                    >
                                        <Heart className="w-4 h-4 text-rose-400" />
                                        <span>Save to Library</span>
                                    </button>

                                    <a
                                        href={`https://www.youtube.com/watch?v=${activeSong.videoId}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
                                    >
                                        <span>Open in YouTube</span>
                                        <ExternalLink className="w-3.5 h-3.5" />
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 text-center text-gray-500 rounded-2xl bg-[#0D1322] border border-white/10">
                                <Music2 className="w-10 h-10 mx-auto mb-2 opacity-30 text-indigo-400" />
                                <p className="text-sm font-semibold text-gray-300">Select a song from the playlist</p>
                            </div>
                        )}
                    </div>

                    {/* Right: Mood Playlist */}
                    <div className="lg:col-span-5 p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/5">
                            <h4 className="text-sm font-bold text-white">
                                {selectedEmotion} Soundscape ({playlist.length} Tracks)
                            </h4>
                            <span className="text-xs text-gray-400">Curated</span>
                        </div>

                        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                            {playlist.map((song) => {
                                const isActive = activeSong?.id === song.id;

                                return (
                                    <div
                                        key={song.id}
                                        onClick={() => setActiveSong(song)}
                                        className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
                                            isActive
                                                ? "bg-violet-600/20 border-violet-500/50 shadow-md"
                                                : "bg-white/[0.02] border-white/5 hover:border-white/15 hover:bg-white/[0.04]"
                                        }`}
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                                isActive ? "bg-violet-600 text-white" : "bg-white/5 text-gray-400 group-hover:text-white"
                                            }`}>
                                                <Play className="w-3.5 h-3.5 ml-0.5" />
                                            </div>
                                            <div className="truncate">
                                                <p className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-gray-200 group-hover:text-white"}`}>
                                                    {song.title}
                                                </p>
                                                <p className="text-[11px] text-gray-400 truncate">
                                                    {song.artist} • {song.genre}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSaveSong(song);
                                            }}
                                            className="p-2 text-gray-500 hover:text-rose-400 transition-colors"
                                            title="Save song"
                                        >
                                            <Heart className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ) : (
                /* Saved Songs Library View */
                <div className="p-6 rounded-2xl bg-[#0D1322] border border-white/10 shadow-xl space-y-5">
                    <div>
                        <h3 className="text-base font-bold text-white">Your Saved Favorites</h3>
                        <p className="text-xs text-gray-400">All songs you've bookmarked across your mood sessions</p>
                    </div>

                    {savedSongs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {savedSongs.map((s) => (
                                <div key={s.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-white/15 transition-all space-y-3">
                                    <div className="flex items-start justify-between gap-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-white truncate">{s.title}</h4>
                                            <p className="text-xs text-gray-400 truncate">{s.artist}</p>
                                        </div>
                                        <button
                                            onClick={() => handleRemoveSavedSong(s.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
                                            title="Remove"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    {s.video_id && (
                                        <div className="rounded-lg overflow-hidden border border-white/10">
                                            <iframe
                                                width="100%"
                                                height="140"
                                                src={`https://www.youtube.com/embed/${s.video_id}`}
                                                title={s.title}
                                                allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="border-0"
                                            />
                                        </div>
                                    )}

                                    <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                                        <span>Playlist: {s.playlist_name}</span>
                                        <span>{new Date(s.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-gray-500">
                            <FolderHeart className="w-12 h-12 mx-auto mb-2 opacity-30 text-rose-400" />
                            <h4 className="text-sm font-semibold text-gray-300">No saved songs yet</h4>
                            <p className="text-xs text-gray-500 mt-1">
                                Heart any recommended track in the studio to store it in your personal favorites library.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </DashboardLayout>
    );
}
