import "./Detection.css";

import Webcam from "react-webcam";

import { useRef, useState } from "react";

import API from "../../services/api";


export default function Detection() {

    const webcamRef = useRef<Webcam>(null);

    const [emotion, setEmotion] = useState("");

    const [confidence, setConfidence] = useState(0);

    const [song, setSong] = useState<any>(null);


    const captureImage = async () => {

        const imageSrc =
            webcamRef.current?.getScreenshot();


        if (!imageSrc)
            return;


        const blob = await fetch(imageSrc)
            .then(res => res.blob());


        const formData = new FormData();


        formData.append(
            "file",
            blob,
            "capture.jpg"
        );


        try {

            // -----------------------------
            // EMOTION DETECTION
            // -----------------------------

            const response = await API.post(
                "/emotion/detect",
                formData,
                {
                    headers: {
                        "Content-Type":
                            "multipart/form-data"
                    }
                }
            );


            const detectedEmotion =
                response.data.emotion;


            setEmotion(
                detectedEmotion
            );


            setConfidence(
                response.data.confidence
            );


            localStorage.setItem(
                "detectedEmotion",
                detectedEmotion
            );


            // -----------------------------
            // MUSIC RECOMMENDATION
            // -----------------------------

            const musicResponse =
                await API.get(
                    `/music/recommend/${detectedEmotion}`
                );


            console.log(
                "Recommended song:",
                musicResponse.data
            );


            setSong(
                musicResponse.data
            );


        } catch (error) {

            console.log(
                "MoodSync error:",
                error
            );

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

                    screenshotFormat="image/jpeg"

                    className="camera"

                />


                <button
                    onClick={captureImage}
                >

                    Analyze Mood

                </button>


                {
                    emotion &&

                    <div className="result">

                        <h2>
                            Detected: {emotion}
                        </h2>

                        <p>
                            Confidence: {confidence}%
                        </p>

                    </div>

                }


                {
                    song &&

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

                }


            </div>

        </div>

    );

}