import { useState } from "react"

export default function ToolbarBgAndLightingCard() {

    const[isBgAndLightCardExpanded, setIsBgAndLightCardExpanded] = useState(true);

    function handleBgAndLightCardExpand() : void {
        setIsBgAndLightCardExpanded(!isBgAndLightCardExpanded);
    }

    return(
        <div className="w-[100%] bg-stone-950 flex-shrink-0 pb-2 ">
            {/* Header - always visible */}
            <div className="flex justify-between items-center py-2">
                <h1 className="text-stone-300 ml-5">Background & Lighting</h1>
                <button onClick={handleBgAndLightCardExpand} className="mr-5 text-stone-300">
                    {isBgAndLightCardExpanded ? '^' : 'v'}
                </button>
            </div>

            {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out ${
                isBgAndLightCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    {/* Background Section */}
                    <h1 className="text-stone-300 ml-5 mt-1 text-sm">Background</h1>
                    <div className="flex justify-between bg-stone-950 py-2">
                        <select className="w-[35%] ml-5 h-[30px] px-1 bg-stone-300 text-stone-900 text-sm rounded-md">
                            <option value="solid">solid</option>
                            <option value="gradient">gradient</option>
                        </select>
                        <input type="color" className="w-[25%] h-[30px] mr-5" />
                    </div>

                    {/* Gradient Settings */}
                    <h1 className="text-stone-200 ml-5 mt-1 text-sm">Gradient Settings</h1>
                    <div className="flex w-[50%] ml-2 justify-around mt-1">
                        <button className="cursor-pointer w-[35%] mx-1 bg-green-300 rounded-lg py-1">LR</button>
                        <button className="cursor-pointer w-[35%] mx-1 bg-red-500 rounded-lg py-1">UD</button>
                    </div>

                    <div className="flex flex-col ml-5 text-sm mt-1">
                        <label className="text-stone-200" htmlFor="">Scale</label>
                        <input className="w-[75%]" type="range" />
                    </div>

                    {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[90%] h-px bg-stone-300/40 my-3"></div>
                    </div>

                    {/* Lighting */}
                    <h1 className="text-stone-200 ml-5 my-1 text-sm">Lighting</h1>
                    <div className="flex w-[100%] ml-5 mb-5">
                        <div className="flex justify-between w-[90%]">
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Dir</button>
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Spot</button>
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Point</button>
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Rect</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}