import Button from "../common/Button";


export default function Navbar(){

return(

<nav
className="
fixed
top-0
w-full
z-50
bg-black/50
backdrop-blur-lg
px-10
py-5
flex
justify-between
items-center
"
>

<h1 className="
text-2xl
font-bold
text-white
">
MoodSync AI
</h1>


<div className="
space-x-8
text-white
">

<a>Features</a>
<a>How it works</a>
<a>About</a>

</div>


<Button>
Login
</Button>


</nav>

)

}