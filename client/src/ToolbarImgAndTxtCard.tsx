import { useState } from "react"

export default function ToolbarImgAndTextCard() { 

    const[isImgAndTxtCardExpanded, setIsImgAndTextCardExpanded] = useState(false);
    const[contentHeight, setContentHeight] = useState(0);

    function handleImgAndTextCardExpand() : void {
        setIsImgAndTextCardExpanded(!isImgAndTxtCardExpanded);
    }

    return (
        <div className={`w-[100%] rounded-t-xl bg-stone-950 -mt-2 z-10 border-1 border-stone-300 transition-all duration-500 ease-in-out pb-1`}
        >

            <div className="flex justify-between items-center py-2">
                <h1 className="ml-5 text-stone-300">Image & Text</h1>
                <button onClick={handleImgAndTextCardExpand} className="mr-5 text-stone-300">
                    {isImgAndTxtCardExpanded ? 'v' : '^'}
                </button>
            </div>


                        {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out ${
                isImgAndTxtCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    

                </div>
            </div>
        </div>
    )
}