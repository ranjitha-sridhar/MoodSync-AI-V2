import AppRouter from "./routes/AppRouter";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";

function App() {

    return (

        <AuthProvider>

            <AppRouter />

            <Toaster />

        </AuthProvider>

    );

}

export default App;