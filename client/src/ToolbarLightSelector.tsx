export default function ToolbarLightSelector() {
    return (
        <>
        <div className="flex justify-center items-center w-[screen] h-[52.5%] bg-stone-950">
            <div className="grid grid-cols-2 grid-rows-2 w-[90%] h-[90%] bg-yellow-300">
                <button className="text-md bg-red-500"> Directional Light</button>
                <button className="text-md bg-purple-500"> Spot Light</button>
                <button className="text-md bg-green-500"> Point Light</button>
                <button className="text-md bg-emerald-500"> Rect Area Light</button>
            </div>
        </div>

        </>
    )
}