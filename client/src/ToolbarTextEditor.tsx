interface ToolbarTextProps {
    isToolbarToggled : boolean
}

export default function ToolbarTextEditor({isToolbarToggled}:ToolbarTextProps) {
    return (
        <>
        <div className={isToolbarToggled ? `hidden`:`flex justify-center items-center w-[screen] h-[52.5%] bg-stone-950`}>
            <div className="grid grid-cols-2 grid-rows-2 w-[90%] h-[90%] bg-yellow-300">
                <button  className="text-md bg-purple-500"> Text 1</button>

            </div>
        </div>
        </>
    )
}