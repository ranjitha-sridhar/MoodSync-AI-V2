import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Auth/Login/Login";
import Signup from "../pages/Auth/Signup/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Detection from "../pages/Detection/Detection";

import { useAuth } from "../context/AuthContext";


function ProtectedRoute({
    children
}: {
    children: React.ReactNode;
}) {

    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    return children;
}


export default function AppRouter() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<Landing />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/detection"
                    element={
                        <ProtectedRoute>
                            <Detection />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />

            </Routes>

        </BrowserRouter>

    );

}