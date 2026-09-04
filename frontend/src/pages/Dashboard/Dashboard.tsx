import "./Dashboard.css";


import Sidebar from "../../components/layout/Sidebar";

import MoodCard from "../../components/emotion/MoodCard";
import MusicCard from "../../components/recommendation/MusicCard";
import EmotionChart from "../../components/analytics/EmotionChart";



export default function Dashboard() {


    const userName =
    localStorage.getItem("userName") || "User";


    const hour = new Date().getHours();


    const greeting =

        hour < 12

        ? "Good Morning"

        : hour < 18

        ? "Good Afternoon"

        : "Good Evening";



    return (


        <div className="dashboard-wrapper">


            <Sidebar />



            <main className="dashboard">



                <header className="dashboard-header">



                    <div>


                        <h1>

                            {greeting}, {userName} 👋

                        </h1>



                        <p>

                            How are you feeling today?

                        </p>



                    </div>





                    <div className="profile">


                        RS


                    </div>



                </header>





                <section className="dashboard-grid">



                    <MoodCard />



                    <MusicCard />



                </section>





                <section className="chart-section">



                    <EmotionChart />



                </section>



            </main>



        </div>


    );

}