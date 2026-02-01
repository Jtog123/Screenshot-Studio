
import { error } from "console";
import { ChangeEvent, useRef, useState } from "react"
import * as THREE from 'three'
import { CameraManager } from "./CameraManager";
import { AssetManager } from "./AssetManager";

interface ImageComponentProps {
    _scene: THREE.Scene
    _camera: THREE.PerspectiveCamera
    _assetManager : AssetManager
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>


}

//Image Comopnent is going to have the image
export default function ImageComponent({_scene, _camera ,_assetManager, activeListItems, setActiveListItems} : ImageComponentProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);
    const[isImageUploaded , setIsImageUploaded] = useState(false);

    function handleFileUpload(e : ChangeEvent<HTMLInputElement>) : void {
        //after submitting we print doing something
        console.log("doing something");
        const input = e.target as HTMLInputElement;
        if(input.files && input.files[0]) {
            //call assetManager
            _assetManager.createImageComponentAbovePhone(input.files[0],
                (sprite) => {
                    //onSuccess triggers this callback
                    setIsImageUploaded(true);
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
            <input ref={inputFileRef} type="file" accept="image/*" onChange={(e) => handleFileUpload(e)} className="hidden"/>
                <button className={isImageUploaded ? `hidden` :`fixed top-20 left-1/2 transform px-2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-[100px] bg-transparent border-2 border-dashed border-white text-white z-50 cursor-pointer`}
                    onClick={() => inputFileRef.current?.click()}>
                    + Add Image
                </button>
        </div>

        </>
    )
}