import "./Detection.css";

import Webcam from "react-webcam";
import { useRef, useState } from "react";

import API from "../../services/api";

interface Song {
    title: string;
    artist: string;
    videoId: string;
}

export default function Detection() {

    const webcamRef = useRef<Webcam>(null);

    const [emotion, setEmotion] = useState("");
    const [confidence, setConfidence] = useState(0);
    const [song, setSong] = useState<Song | null>(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const captureImage = async () => {

        setLoading(true);
        setError("");

        try {

            const imageSrc = webcamRef.current?.getScreenshot();

            if (!imageSrc) {
                setError("Unable to capture image. Please allow camera access.");
                return;
            }

            const response = await fetch(imageSrc);
            const blob = await response.blob();

            const formData = new FormData();

            formData.append(
                "file",
                blob,
                "capture.jpg"
            );

            // =========================
            // EMOTION DETECTION
            // =========================

            const emotionResponse = await API.post(
                "/emotion/detect",
                formData
            );

            const detectedEmotion =
                emotionResponse.data.emotion;

            const detectedConfidence =
                emotionResponse.data.confidence;

            setEmotion(detectedEmotion);
            setConfidence(detectedConfidence);

            localStorage.setItem(
                "detectedEmotion",
                detectedEmotion
            );

            localStorage.setItem(
                "confidence",
                String(detectedConfidence)
            );

            // =========================
            // MUSIC RECOMMENDATION
            // =========================

            const musicResponse = await API.get(
                `/music/recommend/${detectedEmotion}`
            );

            setSong(musicResponse.data);

        } catch (err) {

            console.error("MoodSync detection error:", err);

            setError(
                "Could not detect your emotion. Make sure the backend is running."
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="detection-page">

            <h1>
                Emotion Detection 🎭
            </h1>

            <p>
                Let AI understand your current mood
            </p>

            <div className="camera-card">

                <Webcam
                    ref={webcamRef}
                    audio={false}
                    screenshotFormat="image/jpeg"
                    videoConstraints={{
                        facingMode: "user"
                    }}
                    className="camera"
                />

                <button
                    onClick={captureImage}
                    disabled={loading}
                >
                    {loading
                        ? "Analyzing..."
                        : "Analyze Mood"}
                </button>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                {emotion && (

                    <div className="result">

                        <h2>
                            Detected: {emotion}
                        </h2>

                        <p>
                            Confidence: {confidence}%
                        </p>

                    </div>

                )}

                {song && (

                    <div className="music-result">

                        <h2>
                            🎵 Recommended Song
                        </h2>

                        <h3>
                            {song.title}
                        </h3>

                        <p>
                            {song.artist}
                        </p>

                        <iframe
                            width="100%"
                            height="250"
                            src={`https://www.youtube.com/embed/${song.videoId}`}
                            title={song.title}
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />

                    </div>

                )}

            </div>

        </div>
    );
}