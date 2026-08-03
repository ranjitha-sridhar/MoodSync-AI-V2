import SectionTitle from "../../components/common/SectionTitle";
import GlassCard from "../../components/common/GlassCard";


export default function HowItWorks(){

const steps = [
    {
        number:"01",
        title:"Capture Emotion",
        desc:"Camera captures facial expressions using computer vision."
    },
    {
        number:"02",
        title:"AI Analysis",
        desc:"Deep learning models analyze facial features and detect mood."
    },
    {
        number:"03",
        title:"Music Matching",
        desc:"AI recommends songs based on your emotional state."
    },
    {
        number:"04",
        title:"Enjoy Experience",
        desc:"Listen to personalized playlists that match your mood."
    }
];


return(

<section
className="
py-20
bg-gradient-to-b
from-black
to-purple-950
px-10
"
>


<SectionTitle
title="How MoodSync AI Works"
description="From emotions to personalized music in seconds"
/>



<div
className="
max-w-5xl
mx-auto
grid
md:grid-cols-4
gap-6
"
>


{
steps.map((step,index)=>(

<GlassCard key={index}>


<div
className="
text-purple-400
text-4xl
font-bold
"
>
{step.number}
</div>


<h3
className="
text-xl
text-white
font-semibold
mt-4
"
>
{step.title}
</h3>


<p
className="
text-gray-400
mt-3
"
>
{step.desc}
</p>


</GlassCard>


))
}


</div>


</section>


)

}