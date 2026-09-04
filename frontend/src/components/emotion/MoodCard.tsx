import { motion } from "framer-motion";
import { FaSmile } from "react-icons/fa";
import "./MoodCard.css";


export default function MoodCard() {

    return (

        <motion.div

            className="mood-card"

            whileHover={{
                scale:1.03
            }}

        >

            <div className="mood-icon">

                <FaSmile />

            </div>


            <div>

                <h2>
                    Current Mood
                </h2>


                <h1>
                    Happy 😊
                </h1>


                <p>
                    Confidence: 92%
                </p>

            </div>


        </motion.div>

    );

}