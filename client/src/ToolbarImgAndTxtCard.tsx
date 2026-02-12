import { useState } from "react"
import { ImageComponentInterface, TextComponentInterface } from "./ComponentInterfaces"

interface ToolbarImgAndTextCardProps {
    imageComponents: ImageComponentInterface[]
    setImageComponents : React.Dispatch<React.SetStateAction<ImageComponentInterface[]>>
    addTextComponent : () => void
    isToolbarToggled : boolean
}

export default function ToolbarImgAndTextCard({imageComponents, setImageComponents, addTextComponent, isToolbarToggled} : ToolbarImgAndTextCardProps) { 

    const[isImgAndTxtCardExpanded, setIsImgAndTextCardExpanded] = useState(false);
    //const[contentHeight, setContentHeight] = useState(0);

    function handleImgAndTextCardExpand() : void {
        setIsImgAndTextCardExpanded(!isImgAndTxtCardExpanded);
    }

    function addImageComponent() : void {

        //temp id for react key
        const newImage = {
            id: `temp_${Date.now()}`,
            position: "above",
            type: "image"
        }
        console.log("adding component", newImage);
        setImageComponents([...imageComponents, newImage]);
        
    }

    return (
        <div  className={`w-[100%] rounded-t-xl bg-stone-950 -mt-2 z-10 border-1 border-stone-400/50 transition-all duration-500 ease-in-out pb-1 overflox-auto  `}
        >

            <div onClick={handleImgAndTextCardExpand} className="flex justify-between items-center py-2 cursor-pointer">
                <h1 className="ml-5 text-stone-300">Image & Text</h1>
                <button onClick={handleImgAndTextCardExpand} className="mr-5 text-stone-300">
                    {isImgAndTxtCardExpanded ? '^' : 'v'}
                </button>
            </div>


            {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out ${
                isImgAndTxtCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    {/* stuff here*/}
                    <div className="flex  w-[100%]  justify-center  pb-2">
                        <div className="flex  w-[50%] h-[50px] justify-evenly items-center  ">
                            <button onClick={addImageComponent} className="cursor-pointer w-[35%] mx-1 bg-red-500 rounded-lg py-1">Img</button>
                            <label className="text-stone-300" htmlFor=""> or</label>
                            <button onClick={addTextComponent} className="cursor-pointer w-[35%] mx-1 bg-red-500 rounded-lg py-1">Txt</button>
                        </div>
                    </div>

                        {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[90%] h-px bg-stone-300/40 my-2"></div>
                    </div>

                    <div className="flex justify-between items-center ">
                        <h1 className="text-stone-300 ml-5">Manage</h1>
                    </div>

                    <div className="imageSelector flex mx-5 mb-2 py-2 ">
                        {/* allow up to 7 images do dynamically or hard code? click upload img load async and store into and display in the div*/}
                        <div className="flex flex-col ">
                            <input type="checkbox" className=" mb-1" name="" id="" />
                            <div className="h-[45px] w-[28px] border-1 border-stone-300 mb-1">
                                <img src="/testshot.png"  alt=""/>
                            </div>
                        </div>


                    </div>


                   



                </div>
            </div>
        </div>
    )
}