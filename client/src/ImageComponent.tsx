
import { error } from "console";
import { ChangeEvent, useRef, useState } from "react"
import * as THREE from 'three'
import { CameraManager } from "./CameraManager";
import { AssetManager } from "./AssetManager";

interface ImageComponentProps {
    _scene: THREE.Scene
    _assetManager : AssetManager

}


//Image Comopnent is going to have the image
export default function ImageComponent({_scene, _assetManager} : ImageComponentProps) {
    const inputFileRef = useRef<HTMLInputElement>(null);

    const[isImageUploaded , setIsImageUploaded] = useState(false);

    function handleFileUpload(e : ChangeEvent<HTMLInputElement>) : void {
        //after submitting we print doing something
        console.log("doing something");
        const input = e.target as HTMLInputElement;
        if(input.files && input.files[0]) {
            //call assetManager
            _assetManager.createImageComponentAbovePhone(input.files[0],
                () => {
                    setIsImageUploaded(true);
                    console.log("image successfully uploaded");
                },
                () => {
                    setIsImageUploaded(false);
                    console.log("image failed to uploaded");
                }
            )
              
                
           // _assetManager.createImageComponentAbovePhone(input.files[0]);
            

            //const fileName = input.files[0];
           // const url = URL.createObjectURL(fileName);

            //const loader = new THREE.TextureLoader();
            /*
            loader.load(
                url,
                (texture) => {
                    const material = new THREE.SpriteMaterial({map:texture});
                    const sprite = new THREE.Sprite(material);
                    sprite.scale.set(2, 2, 1);
                    sprite.position.set(0, 2.5, 0);

                    //adjust the camera

                    //set isuploaded to true
                    setIsImageUploaded(true);

                    //add it to active liste elements
                    
                    //add to the scene
                    _scene.add(sprite);

                    
                    

                    URL.revokeObjectURL(url);
                },
                undefined,
                (error) => {
                    console.error("Failed to load texture", error);
                    setIsImageUploaded(false);
                }
            )
            */


        }
    }

    //call assetmanager down here?
    // abtract some of the above logic into the assetmaanger class
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