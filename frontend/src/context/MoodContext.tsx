import {
    createContext,
    useContext,
    useState,
    type ReactNode
} from "react";

export interface ProbabilitiesMap {
    [key: string]: number;
}

interface MoodContextType {
    emotion: string;
    confidence: number;
    probabilities: ProbabilitiesMap;
    refreshCounter: number;
    triggerRefresh: () => void;
    setMood: (emotion: string, confidence: number, probabilities?: ProbabilitiesMap) => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export function MoodProvider({ children }: { children: ReactNode }) {
    const [emotion, setEmotion] = useState(
        () => localStorage.getItem("detectedEmotion") || "Neutral"
    );

    const [confidence, setConfidence] = useState(
        () => Number(localStorage.getItem("confidence")) || 0
    );

    const [probabilities, setProbabilities] = useState<ProbabilitiesMap>(() => {
        const stored = localStorage.getItem("emotionProbabilities");
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch {
                return {};
            }
        }
        return {
            Angry: 0,
            Disgust: 0,
            Fear: 0,
            Happy: 0,
            Sad: 0,
            Surprise: 0,
            Neutral: 100
        };
    });

    const [refreshCounter, setRefreshCounter] = useState(0);

    const triggerRefresh = () => {
        setRefreshCounter((prev) => prev + 1);
    };

    const setMood = (
        newEmotion: string,
        newConfidence: number,
        newProbs?: ProbabilitiesMap
    ) => {
        setEmotion(newEmotion);
        setConfidence(newConfidence);
        localStorage.setItem("detectedEmotion", newEmotion);
        localStorage.setItem("confidence", String(newConfidence));

        if (newProbs) {
            setProbabilities(newProbs);
            localStorage.setItem("emotionProbabilities", JSON.stringify(newProbs));
        }

        triggerRefresh();
    };

    return (
        <MoodContext.Provider
            value={{
                emotion,
                confidence,
                probabilities,
                refreshCounter,
                triggerRefresh,
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
        throw new Error("useMood must be used inside MoodProvider");
    }
    return context;
}
