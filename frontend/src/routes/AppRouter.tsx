import { BrowserRouter, Routes, Route } from "react-router-dom";

import Landing from "../pages/Landing";
import Login from "../pages/Auth/Login/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import Signup from "../pages/Auth/Signup/Signup";
import Detection from "../pages/Detection/Detection";

export default function AppRouter() {

    return(

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
                    element={<Dashboard />}
                />
                <Route
                    path="/detection"
                    element={<Detection />}
                />      

            </Routes>

        </BrowserRouter>

    )

}