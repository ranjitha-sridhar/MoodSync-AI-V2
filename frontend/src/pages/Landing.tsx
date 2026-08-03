import Navbar from "../components/layout/Navbar";
import Features from "./Landing/Features";
import Hero from "./Landing/Hero";
import HowItWorks from "./Landing/HowItWorks";
import Stats from "./Landing/Stats";
import CTA from "./Landing/CTA";
import Footer from "../components/layout/Footer";

export default function Landing(){

    return(
        <div>
            <Navbar />
            <Hero />
            <Features/>
            <HowItWorks/>
            <Stats/>
            <CTA/>
            <Footer/>   
        </div>
    )

}