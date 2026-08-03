import GlassCard from "../../components/common/GlassCard";


export default function Stats(){

const stats = [
    {
        value:"10K+",
        label:"Mood Analyses"
    },
    {
        value:"95%",
        label:"Emotion Accuracy"
    },
    {
        value:"24/7",
        label:"AI Availability"
    },
    {
        value:"∞",
        label:"Personalized Songs"
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


<div
className="
max-w-6xl
mx-auto
grid
grid-cols-2
md:grid-cols-4
gap-6
"
>


{
stats.map((item,index)=>(

<GlassCard key={index}>


<h2
className="
text-5xl
font-bold
text-white
text-center
"
>
{item.value}
</h2>


<p
className="
text-gray-400
text-center
mt-3
"
>
{item.label}
</p>


</GlassCard>

))
}


</div>


</section>

)

}