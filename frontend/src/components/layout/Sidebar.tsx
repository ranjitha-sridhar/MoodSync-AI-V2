import "./Sidebar.css";

import {
    FaHome,
    FaCamera,
    FaChartLine,
    FaMusic,
    FaUser,
    FaCog,
    FaSignOutAlt
} from "react-icons/fa";

import { NavLink } from "react-router-dom";


export default function Sidebar(){


    return (

        <aside className="sidebar">


            <h2 className="logo">

                MoodSync
                <span>
                    AI
                </span>

            </h2>



            <nav>


                <NavLink to="/dashboard">

                    <FaHome/>

                    Dashboard

                </NavLink>



                <NavLink to="/detection">

                    <FaCamera/>

                    Detect Mood

                </NavLink>



                <NavLink to="/analytics">

                    <FaChartLine/>

                    Analytics

                </NavLink>



                <NavLink to="/music">

                    <FaMusic/>

                    Music

                </NavLink>



                <NavLink to="/profile">

                    <FaUser/>

                    Profile

                </NavLink>



                <NavLink to="/settings">

                    <FaCog/>

                    Settings

                </NavLink>


            </nav>



            <button className="logout">

                <FaSignOutAlt/>

                Logout

            </button>


        </aside>

    );

}