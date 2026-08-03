interface Props{
    title:string;
    description:string;
}


export default function SectionTitle({
    title,
    description
}:Props){

return(

<div className="text-center mb-12">

<h2 className="
text-4xl
font-bold
text-white
">
{title}
</h2>


<p className="
mt-4
text-gray-400
max-w-xl
mx-auto
">
{description}
</p>


</div>

)

}