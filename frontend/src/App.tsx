import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import { MoodProvider } from "./context/MoodContext";

function App() {
    return (
        <AuthProvider>
            <MoodProvider>
                <AppRouter />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        style: {
                            background: "#1E293B",
                            color: "#F8FAFC",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
                        }
                    }}
                />
            </MoodProvider>
        </AuthProvider>
    );
}

export default App;
