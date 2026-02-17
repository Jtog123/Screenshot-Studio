import { useState, useRef } from "react"
import { ImageComponentInterface, TextComponentInterface ,ScreenTextureInterface} from "./ComponentInterfaces"
import * as THREE from 'three'
import { AssetManager } from "./AssetManager"


interface ToolbarImgAndTextCardProps {
    imageComponents: ImageComponentInterface[]
    setImageComponents : React.Dispatch<React.SetStateAction<ImageComponentInterface[]>>
    addTextComponent : () => void
    isToolbarToggled : boolean
    _phoneScreen : THREE.Mesh
    _assetMaanger: AssetManager
    //screenTextures : ScreenTextureInterface[]
    //setScreenTextures : React.Dispatch<React.SetStateAction<ScreenTextureInterface[]>>
}

export default function ToolbarImgAndTextCard({imageComponents, setImageComponents, addTextComponent, isToolbarToggled, _phoneScreen, _assetMaanger } : ToolbarImgAndTextCardProps) { //screenTextures, setScreenTextures

    const[isImgAndTxtCardExpanded, setIsImgAndTextCardExpanded] = useState(false);
    const screenTextureFileRef = useRef<HTMLInputElement>(null);
    const[isScreenTextureUploaded , setIsScreenTextureUploaded] = useState(false);
    const [screenTextures, setScreenTextures] = useState<ScreenTextureInterface[]>([]);
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

    /*
    phoneScreen is a mesh we can have this function append to an array of THREE.Meshes

    if (phoneScreen) {
              const textureLoader = new THREE.TextureLoader();
              textureLoader.load('/testshot.png', (texture) => {
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace; // Corrects the "washed out" red
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.NearestFilter; // Sharpest
                texture.anisotropy = _renderer.capabilities.getMaxAnisotropy();
                //texture.anisotropy = 16; // Sharper edges at angles
    
                phoneScreen!.material = new THREE.MeshBasicMaterial({ 
                  map: texture,
                  toneMapped: false // Prevents scene lights from changing screenshot colors
                });
    
                setPhoneModel(gltf.scene);
                //no longer loading
                setIsPhoneLoading(false);
                setIsSceneReady(true);
              });
            } else {
                setPhoneModel(gltf.scene);
                //no longer loading
                setIsPhoneLoading(false);
                setIsSceneReady(true);
    
            }*/

    function handleScreenTextureUpload(e : React.ChangeEvent<HTMLInputElement>) : void {

        if(screenTextures.length >= 7) return;

        const input = e.target as HTMLInputElement;
         if(input.files && input.files[0]) {
            //_assetManager.crea
            console.log("uploading", input.files[0]);

            const imgURL = URL.createObjectURL(input.files[0])

            const newScreenTexture = {
                id: `temp_${Date.now()}`,
                type: "screenTexture",
                imgPath: imgURL
            } as ScreenTextureInterface

            setScreenTextures([...screenTextures, newScreenTexture]);
         }


        //now we have an array of images we would want, we have to loop through and create Meshes/Textures for each of them and then on click checkmark apply them to the phone.


        //setScreenTextures([...screenTextures, newScreenTexture]);
        console.log("setting the texture", e, screenTextures)
    }

    return (
        <div  className={ isToolbarToggled ? `hidden`:`w-[100%] rounded-t-xl bg-stone-950 -mt-2 z-10 border-1 border-stone-400/50 transition-all duration-500 ease-in-out pb-1 overflox-auto  `}
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

                    <div className="flex justify-center items-center">
                        <h4 className="text-stone-300 text-xs ml-5 mr-2">Add up to 7 photos</h4>
                        <input ref={screenTextureFileRef} type="file" accept="image/*" onChange={(e) => handleScreenTextureUpload(e)} className="hidden"/>
                            {
                                <button className={isScreenTextureUploaded ? `hidden` :`cursor-pointer w-[20%] mx-1 bg-red-500 rounded-lg py-1`}
                                onClick={() => screenTextureFileRef.current?.click()}>
                                upload
                                </button> 
                            }

                    </div>


                    <div className="flex justify-between items-center ">
                        
                    </div>

                    <div className="imageSelector flex mx-3 mb-2 py-2 ">
                        {/* screenTextures.map() */}
                        {screenTextures.map((texture) => (
                            <div key={texture.id} className="flex flex-col mx-1 ">
                                <input type="checkbox" className=" mb-1" name="" id="" />
                                <div className="h-[45px] w-[28px] border-1 border-stone-300 mb-1">
                                    <img src={texture.imgPath}  alt=""/>
                                </div>
                            </div>
                        )
                            
                        )}
                        
                        {/* allow up to 7 images do dynamically or hard code? click upload img load async and store into and display in the div
                        <div className="flex flex-col ">
                            <input type="checkbox" className=" mb-1" name="" id="" />
                            <div className="h-[45px] w-[28px] border-1 border-stone-300 mb-1">
                                <img src="/testshot.png"  alt=""/>
                            </div>
                        </div>
                        */}


                    </div>


                   



                </div>
            </div>
        </div>
    )
}