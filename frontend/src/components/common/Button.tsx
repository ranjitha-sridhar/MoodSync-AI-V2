interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
}


export default function Button({
    children,
    onClick
}: ButtonProps){

    return(
        <button
        onClick={onClick}
        className="
        px-6 py-3
        rounded-full
        bg-purple-600
        text-white
        font-semibold
        hover:bg-purple-700
        transition
        shadow-lg
        "
        >
            {children}
        </button>
    )
}