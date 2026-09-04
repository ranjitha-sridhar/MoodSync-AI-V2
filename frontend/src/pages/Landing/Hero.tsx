import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

export default function Hero() {

    const navigate = useNavigate();

    return (
        <section
            className="
            min-h-screen
            flex
            items-center
            justify-center
            bg-gradient-to-br
            from-purple-900
            via-black
            to-blue-900
            px-10
            "
        >

            <div className="text-center">

                <h1
                    className="
                    text-6xl
                    font-bold
                    text-white
                    "
                >
                    Your Mood.
                    <br />
                    Your Music.
                    <br />
                    Powered by AI.
                </h1>

                <p
                    className="
                    mt-6
                    text-xl
                    text-gray-300
                    max-w-2xl
                    mx-auto
                    "
                >
                    MoodSync AI detects your emotions
                    and creates personalized music experiences.
                </p>

                <div className="mt-8">

                    <Button onClick={() => navigate("/login")}>
                        Start Listening
                    </Button>

                </div>

            </div>

        </section>
    );
}