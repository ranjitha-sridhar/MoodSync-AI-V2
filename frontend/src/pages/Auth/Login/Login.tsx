import "./Login.css";

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { login } = useAuth();
    const handleLogin = (e: React.FormEvent) => {

        e.preventDefault();


        if(!email || !password){

            toast.error("Please fill all fields");
            return;

        }


        login("Ranjitha", email);

toast.success("Login successful 🚀");

setTimeout(() => {
    navigate("/dashboard");
}, 1000);

    };


    return (

        <div className="login-page">


            <motion.div

                className="login-card"

                initial={{
                    opacity:0,
                    y:40
                }}

                animate={{
                    opacity:1,
                    y:0
                }}

                transition={{
                    duration:0.6
                }}

            >


                <h1>
                    Welcome Back 👋
                </h1>


                <p>
                    Continue your emotional wellness journey
                </p>



                <form onSubmit={handleLogin}>


                    <input

                        type="email"

                        placeholder="Email"

                        value={email}

                        onChange={(e)=>setEmail(e.target.value)}

                    />



                    <input

                        type="password"

                        placeholder="Password"

                        value={password}

                        onChange={(e)=>setPassword(e.target.value)}

                    />



                    <button type="submit">

                        Login

                    </button>


                </form>



                <div className="signup-text">

                    Don't have an account?

                    <Link to="/signup">

                        Create Account

                    </Link>

                </div>


            </motion.div>


        </div>

    );
}