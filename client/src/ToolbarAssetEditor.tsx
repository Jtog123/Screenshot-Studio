import { useState } from "react"
import ImageComponent from "./ImageComponent"
import { CameraManager } from "./CameraManager"

interface ImageComponent{
    id: number,
    position: string,
    type: string
}

interface ToolbarTextProps {
    imageComponents: ImageComponent[]
    setImageComponents : React.Dispatch<React.SetStateAction<ImageComponent[]>>
    isToolbarToggled : boolean
    _cameraManager : CameraManager
}



//change to ToolbarAssets?

//work on adding a dashed box to the screen, it will be a button

//how many image components allowed above phone at one time?
//1 or 2?



export default function ToolbarAssetEditor({isToolbarToggled, setImageComponents, imageComponents, _cameraManager}: ToolbarTextProps) {

    function addImageComponentAbovePhone() : void {

        const aboveCount = imageComponents.filter((item) => {
            item.position === "above";
        }).length

        if(aboveCount === 0) {
            //push camera down once
            _cameraManager.decreaseCameraHeightForAboveImage()
        }

        if (aboveCount >= 2) {
            //disable the button
            console.log("to many above image components");
            return;
        }

        const newImage = {
            id: Date.now(),
            position: "above",
            type: "image"
        }

        console.log("adding component", newImage);

        setImageComponents([...imageComponents, newImage])
        
    }


    /*
{imageComponents.map(img => (
    <ImageComponent 
        key={img.id} 
        position={img.position}
        onUpload={(file) => handleUpload(img.id, file)}
    />
))}
    */

    return (
        <>
        <div className={isToolbarToggled ? `hidden`:`flex justify-center items-center w-[screen] h-[52.5%] bg-stone-950`}>
            <div className="flex flex-col w-[90%] h-[90%] bg-yellow-300">

                <div className="abovePhone justify-between mb-5">
                    <h1 className="w-[100%] bg-red-200">Above Phone</h1>
                    <div className="buttonCont flex justify-between">
                        <button  className="text-md bg-purple-500 w-[33%] cursor-pointer"> Text</button>
                        <button onClick={addImageComponentAbovePhone} className={imageComponents.length >= 2 ? `disabled` : `text-md bg-purple-500 w-[33%] cursor-pointer`}> Image</button>
                        <button  className="text-md bg-purple-500 w-[33%] cursor-pointer"> Text & Image</button>
                    </div>

                </div>

                <div className="belowPhone justify-between">
                    <h1 className="w-[100%] bg-red-200">Below Phone</h1>
                    <div className="buttonCont flex justify-between">
                        <button  className="text-md bg-purple-500 w-[33%] cursor-pointer"> Text</button>
                        <button  className="text-md bg-purple-500 w-[33%] cursor-pointer"> Image</button>
                        <button  className="text-md bg-purple-500 w-[33%] cursor-pointer"> Text & Image</button>
                    </div>

                </div>
                

            </div>
        </div>
        </>
    )
}