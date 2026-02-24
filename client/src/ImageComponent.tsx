
import { error } from "console";
import { ChangeEvent, useRef, useState } from "react"
import * as THREE from 'three'
import { CameraManager } from "./CameraManager";
import { AssetManager } from "./AssetManager";
import ImageIcon from "./ImageIcon";

interface ImageComponentProps {
    position : string
    _scene: THREE.Scene
    _camera: THREE.PerspectiveCamera
    _assetManager : AssetManager
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>


}


//to put image below phone
//_assetManager.createImageComponentBelowPhone(input.files[0],
/// _camera.position.y -= imageHeight * 0.45;


//Image Comopnent is going to have the image
export default function ImageComponent({ _scene, _camera ,_assetManager, activeListItems, setActiveListItems} : ImageComponentProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const[isImageUploaded , setIsImageUploaded] = useState(false);
    const[imageInputClosed , setImageInputClosed] = useState(false);



    function handleImageUpload(e : ChangeEvent<HTMLInputElement>) : void {
        //after submitting we print doing something
        console.log("doing something");
        const input = e.target as HTMLInputElement;
        
        if(input.files && input.files[0]) {
            console.log("uploading", input.files[0]);

           
                //call assetManager
             _assetManager.createImageComponent(input.files[0],
                (sprite) => {
                    //onSuccess triggers this callback
                    setIsImageUploaded(true);

                    //can disable button, would have to write at app level than pass to toolbarasseteditor and here
                    //setCanDisableAboveImageButton(true);

                    console.log("image successfully uploaded");

                    const imageHeight = sprite.scale.y;

                    //move the camera down based on the size of the image
                    _camera.position.y += imageHeight * 0.45;

                    setActiveListItems([...activeListItems, {id: sprite.name, name:"Image Component"}]);

                },
                () => {
                    setIsImageUploaded(false);
                    console.log("image failed to uploaded");
                }
            );
            

        }
    }

    


    return (
        <>
        <div>
            
            <input ref={inputFileRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e)} className="hidden"/>
                {
                    
                    
                    <button className={isImageUploaded || imageInputClosed ? `hidden` :` ${`fixed left-1/2 transform px-2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[100px] bg-transparent border-2 border-dashed border-white text-white z-50 cursor-pointer`} top-20 `}
                    onClick={() => inputFileRef.current?.click()}>
                        <div className="flex ">
                            <button onClick={(e) => {
                                e.stopPropagation();
                                setImageInputClosed(true);

                            } } className="absolute -top-3 -left-3 w-6 h-6 rounded-lg bg-stone-700 hover:bg-red-500 text-stone-300 hover:text-white flex items-center justify-center text-sm transition-all duration-200 border border-stone-600">x</button>
                            <div className="flex w-[100%] justify-center items-center">
                                <ImageIcon className="w-[48px] h-[48px] text-stone-200"/> 
                                <label htmlFor="">+ </label>
                            </div>

                        </div>

                        
                    </button> 
                }

        </div>

        </>
    )
}


/*
if its below image we want to render the component bottom-20 
imageComponents.map((item) => {
    item.position === "above" ? <button className={isImageUploaded ? `hidden` :`fixed top-20 left-1/2 transform px-2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[100px] bg-transparent border-2 border-dashed border-white text-white z-50 cursor-pointer`}
        onClick={() => inputFileRef.current?.click()}>
         + Add Image
         </button> : <button className={isImageUploaded ? `hidden` :`fixed bottom-20 left-1/2 transform px-2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[100px] bg-transparent border-2 border-dashed border-white text-white z-50 cursor-pointer`}
        onClick={() => inputFileRef.current?.click()}>
         + Add Image
         </button> 
})
*/