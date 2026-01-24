interface ToolbarEffectsProps {
    isToolbarToggled : boolean
}

export default function ToolbarEffectsCatalog({isToolbarToggled}:ToolbarEffectsProps) {
    return (
        <>
        <div className={isToolbarToggled ? `hidden`:`flex justify-center items-center w-[screen] h-[52.5%] bg-stone-950`}>
            <div className="grid grid-cols-2 grid-rows-2 w-[90%] h-[90%] bg-yellow-300">
                <button  className="text-md bg-red-500"> Effect 1</button>
                <button  className="text-md bg-red-500"> Effect 2</button>
                <button  className="text-md bg-red-500"> Effect 3</button>
                <button  className="text-md bg-red-500"> Effect 4</button>
                
            </div>
        </div>
        </>
    )
}