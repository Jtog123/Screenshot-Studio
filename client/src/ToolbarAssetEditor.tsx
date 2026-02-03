import { useState } from "react"
import ImageComponent from "./ImageComponent"
import { ImageComponentInterface, TextComponentInterface } from "./ComponentInterfaces"
import { CameraManager } from "./CameraManager"



interface ToolbarAssetProps {
    imageComponents: ImageComponentInterface[]
    setImageComponents : React.Dispatch<React.SetStateAction<ImageComponentInterface[]>>
    
    textComponents: TextComponentInterface[]
    setTextComponents : React.Dispatch<React.SetStateAction<TextComponentInterface[]>>
    isToolbarToggled : boolean
}



//change to ToolbarAssets?

//work on adding a dashed box to the screen, it will be a button

//how many image components allowed above phone at one time?
//1 or 2?



export default function ToolbarAssetEditor({isToolbarToggled, setImageComponents, imageComponents, textComponents,setTextComponents}: ToolbarAssetProps) {

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

    function addTextComponent() : void {
        const newText = {
            id : `text_${Date.now()}`,
            position : "above",
            type: "text",
            fontSize : 16,
            color: "#000000"
        };

        setTextComponents([...textComponents, newText]);
        
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

    //actually want to use 

    

    //if the component added is position Above disable above button
    //if its position below disalble below button
    //plus only want to disable the button after the image has been loaded

    return (
        <>
        <div className={isToolbarToggled ? `hidden`:`flex justify-center items-center w-[screen] h-[52.5%] bg-stone-950`}>
            <div className="flex flex-col w-[90%] h-[90%] bg-yellow-300">

                <div className="abovePhone justify-between mb-5">
                    <h1 className="w-[100%] bg-red-200">Scene Components</h1>
                    <div className="buttonCont flex justify-between">

                        <button onClick={addTextComponent}  className="text-md bg-purple-500 w-[33%] cursor-pointer"> Text</button>

                        <button onClick={addImageComponent} className={`text-md bg-purple-600 w-[33%] cursor-pointer`}> Image</button>

                        <button  className="text-md bg-purple-500 w-[33%] cursor-pointer"> Text & Image</button>
                    </div>

                </div>

                

            </div>
        </div>
        </>
    )
}