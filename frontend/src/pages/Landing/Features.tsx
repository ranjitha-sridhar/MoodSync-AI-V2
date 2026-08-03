import GlassCard from "../../components/common/GlassCard";
import SectionTitle from "../../components/common/SectionTitle";


export default function Features(){

const features = [
    {
        title:"Emotion Detection",
        desc:"AI analyzes facial expressions and detects your current mood."
    },
    {
        title:"AI Music Recommendation",
        desc:"Get personalized songs based on your emotional state."
    },
    {
        title:"Mood History",
        desc:"Track your emotions and discover mood patterns over time."
    }
];


return(

<section
className="
py-20
bg-black
px-10
"
>

<SectionTitle
title="Powerful AI Features"
description="Experience intelligent emotion-aware music recommendations"
/>


<div
className="
grid
md:grid-cols-3
gap-8
max-w-6xl
mx-auto
"
>


{
features.map((item,index)=>(

<GlassCard key={index}>

<h3
className="
text-2xl
font-bold
text-white
"
>
{item.title}
</h3>


<p
className="
mt-4
text-gray-400
"
>
{item.desc}
</p>


</GlassCard>

))
}


</div>


</section>

)

}