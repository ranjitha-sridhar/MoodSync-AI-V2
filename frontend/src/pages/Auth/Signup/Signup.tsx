import "./Signup.css";

import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../../../context/AuthContext";

export default function Signup() {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");



    const handleSignup = (e: React.FormEvent) => {

        e.preventDefault();


        if(!name || !email || !password || !confirmPassword){

            toast.error("Please fill all fields");
            return;

        }


        if(password !== confirmPassword){

            toast.error("Passwords do not match");
            return;

        }


       login(name, email);

toast.success("Account created successfully 🎉");

setTimeout(() => {
    navigate("/dashboard");
}, 1000);

    };



    return (

        <div className="signup-page">


            <motion.div

                className="signup-card"

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
                    Create Account 🧠
                </h1>


                <p>
                    Start your emotional wellness journey
                </p>



                <form onSubmit={handleSignup}>


                    <input

                        type="text"

                        placeholder="Full Name"

                        value={name}

                        onChange={(e)=>setName(e.target.value)}

                    />



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



                    <input

                        type="password"

                        placeholder="Confirm Password"

                        value={confirmPassword}

                        onChange={(e)=>setConfirmPassword(e.target.value)}

                    />



                    <button type="submit">

                        Create Account

                    </button>


                </form>



                <div className="login-text">


                    Already have an account?


                    <Link to="/login">

                        Login

                    </Link>


                </div>


            </motion.div>


        </div>

    );

}