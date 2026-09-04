import {
    createContext,
    useContext,
    useState
} from "react";

import type { ReactNode } from "react";

interface MoodContextType {
    emotion: string;
    confidence: number;
    setMood: (emotion: string, confidence: number) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(
    undefined
);

export function MoodProvider({
    children
}: {
    children: ReactNode;
}) {

    const [emotion, setEmotion] = useState(
        localStorage.getItem("detectedEmotion") || "Neutral"
    );

    const [confidence, setConfidence] = useState(
        Number(localStorage.getItem("confidence")) || 0
    );


    const setMood = (
        newEmotion: string,
        newConfidence: number
    ) => {

        setEmotion(newEmotion);
        setConfidence(newConfidence);

        localStorage.setItem(
            "detectedEmotion",
            newEmotion
        );

        localStorage.setItem(
            "confidence",
            String(newConfidence)
        );
    };


    return (
        <MoodContext.Provider
            value={{
                emotion,
                confidence,
                setMood
            }}
        >
            {children}
        </MoodContext.Provider>
    );
}


export function useMood() {

    const context = useContext(MoodContext);

    if (!context) {
        throw new Error(
            "useMood must be used inside MoodProvider"
        );
    }

    return context;
}