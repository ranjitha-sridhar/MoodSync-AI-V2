import { useEffect, useState } from "react";
import API from "../../services/api";
import "./MusicCard.css";

interface Song {
    title: string;
    artist: string;
}

export default function MusicCard() {

    const [emotion, setEmotion] = useState("Neutral");

    const [song, setSong] = useState<Song>({
        title: "Golden Hour",
        artist: "JVKE"
    });


    useEffect(() => {

        const detectedEmotion =
            localStorage.getItem("detectedEmotion") || "Neutral";

        setEmotion(detectedEmotion);


        const getRecommendation = async () => {

            try {

                const response = await API.get(
                    `/music/recommend/${detectedEmotion}`
                );

                setSong(response.data);

            } catch (error) {

                console.error(
                    "Failed to get music recommendation:",
                    error
                );

            }

        };


        getRecommendation();

    }, []);


    return (

        <div className="music-card">

            <h2>
                AI Music Recommendation 🎵
            </h2>


            <p>
                Based on your mood:
                <b> {emotion}</b>
            </p>


            <div className="song">

                🎧 {song.title} - {song.artist}

            </div>


            <button>
                Play Song
            </button>

        </div>

    );
}