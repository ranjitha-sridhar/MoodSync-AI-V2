interface Props{
    children:React.ReactNode;
}


export default function GlassCard({
    children
}:Props){

return(

<div
className="
bg-white/10
backdrop-blur-lg
border
border-white/20
rounded-2xl
p-6
shadow-xl
"
>

{children}

</div>

)

}