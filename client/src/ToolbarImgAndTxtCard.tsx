import { useState, useRef, useEffect } from "react"
import { ImageComponentInterface, TextComponentInterface ,ScreenTextureInterface, CapturedImage} from "./ComponentInterfaces"
import * as THREE from 'three'
import { AssetManager } from "./AssetManager"
import { texture } from "three/src/nodes/TSL.js"
import ImageIcon from "./IconAssets/ImageIcon"
import TextIcon from "./IconAssets/TextIcon"
import UploadIcon from "./IconAssets/UploadIcon"
import MenuKarrotIcon from "./IconAssets/MenuKarrotIcon"


interface ToolbarImgAndTextCardProps {
    imageComponents: ImageComponentInterface[]
    setImageComponents : React.Dispatch<React.SetStateAction<ImageComponentInterface[]>>
    addTextComponent : () => void
    isToolbarToggled : boolean
    _phoneScreen : THREE.Mesh
    _assetManager: AssetManager
    capturedImages : CapturedImage[]
    setCapturedImages : React.Dispatch<React.SetStateAction<CapturedImage[]>>
    //screenTextures : ScreenTextureInterface[]
    //setScreenTextures : React.Dispatch<React.SetStateAction<ScreenTextureInterface[]>>
}

//array of captured images, start from app because we also need to pass to the cameramanager
//we pass to the camera manager 

export default function ToolbarImgAndTextCard({imageComponents, setImageComponents, addTextComponent, isToolbarToggled, _phoneScreen, _assetManager, capturedImages, setCapturedImages } : ToolbarImgAndTextCardProps) { //screenTextures, setScreenTextures

    const[isImgAndTxtCardExpanded, setIsImgAndTextCardExpanded] = useState(false);
    const screenTextureFileRef = useRef<HTMLInputElement>(null);
    const [isScreenTextureUploaded , setIsScreenTextureUploaded] = useState(false);
    const [screenTextures, setScreenTextures] = useState<ScreenTextureInterface[]>([]);
    const [activeTextureID, setActiveTextureID] = useState<string | null>(null);
    //const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  
    //const[contentHeight, setContentHeight] = useState(0);

    //clean up after unmount
    useEffect(() => {
        return() => {
            capturedImages.forEach((img) => {
                URL.revokeObjectURL(img.imgPath);
            })
        }
    }, [capturedImages])



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

    //  //everytime a user adds a new screenshot we create a new mesh, 7 possible in total,
  // we then can toggle the meshes on and off, when a user uploads the image immediatly create the texture and store it
  //upon clicking a checkbox we apply the the mesh to the phonescreen
    function handleScreenTextureUpload(e : React.ChangeEvent<HTMLInputElement>) : void {

        if(screenTextures.length >= 7) return;

        const input = e.target as HTMLInputElement;
         if(input.files && input.files[0]) {
            //_assetManager.crea
            console.log("uploading", input.files[0]);

            const imgURL = URL.createObjectURL(input.files[0]);

            //do we need a new textureloader for every texture/.
            if(_phoneScreen) {
                const textureLoader = new THREE.TextureLoader();

                textureLoader.load(
                    imgURL, (texture) => {
                        texture.flipY = false;
                        texture.colorSpace = THREE.SRGBColorSpace; // Corrects the "washed out" red
                        texture.minFilter = THREE.LinearFilter;
                        texture.magFilter = THREE.NearestFilter; // Sharpest
                        //texture.anisotropy = _renderer.capabilities.getMaxAnisotropy();  
                        

                        const newScreenTexture : ScreenTextureInterface = {
                            id: `temp_${Date.now()}`,
                            type: "screenTexture",
                            imgPath: imgURL,
                            screenTexture: texture
                            //texture
                        } 

                        setScreenTextures(prev => [...prev, newScreenTexture]);
                    }


                )
            }


         }

         //clear input value
         input.value = "";

    }

    /*
    useEffect(() => {
        if(isImageCaptured) {
            //handle capturedImages
            id: `temp_${Date.now()}`,
        }

    }, [isImageCaptured]);
    */

    function handleCapturedImages() : void {
       // const newCapturedImage : CapturedImage {

        //}
    }

    function handleTextureSelect(textureID : string) : void {
        setActiveTextureID(textureID);

        const selectedTexture = screenTextures.find(texture => texture.id === textureID);

        if(selectedTexture && _phoneScreen) {
            _phoneScreen.material = new THREE.MeshBasicMaterial({
                map: selectedTexture.screenTexture,
                toneMapped: false
            });
        }
    }

    function handleTextureDelete(textureID: string) : void {
        //if a texture has been applied to the screen and we delete we have to remove it from the screen
        // find the texture in screenTextures if the ids match
        // remove it from the screen on the phone

        const toDeleteTexture = screenTextures.find(texture => texture.id === textureID);
        if(!toDeleteTexture) return;

        toDeleteTexture?.screenTexture.dispose();

        URL.revokeObjectURL(toDeleteTexture.imgPath);


        if(_phoneScreen && activeTextureID === textureID) {
           if (_phoneScreen.material instanceof THREE.Material) {
                _phoneScreen.material.dispose();
           }

           //remove the phone texture
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load('/baseAsset.png', (texture) => {
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace; // Corrects the "washed out" red
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.NearestFilter; // Sharpest
                //texture.anisotropy = _renderer.capabilities.getMaxAnisotropy();
    
                _phoneScreen.material = new THREE.MeshBasicMaterial({ 
                    map: texture,
                    toneMapped: false // Prevents scene lights from changing screenshot colors
                });

            });

            setActiveTextureID(null);
        }

        //update the state
        setScreenTextures(prev => prev.filter(texture => texture.id !== textureID))

    }

    function handleCapturedImageDelete(imageID : string) : void {
        const toDeleteImg = capturedImages.find(img => img.id === imageID);
        if(toDeleteImg) {
            URL.revokeObjectURL(toDeleteImg.imgPath);
        }

        setCapturedImages(prev => prev.filter(img => img.id !== imageID));

        

        
    }

    return (
        <div  className={ isToolbarToggled ? `hidden`:`w-[100%] rounded-t-xl bg-velvet-darkest -mt-2 z-10 border-1 border-cream/40 transition-all duration-500 ease-in-out pb-1 overflox-auto  `}
        >

            <div onClick={handleImgAndTextCardExpand} className="flex justify-between items-center py-2 cursor-pointer">
                <h1 className="ml-5 text-cream text-sm"  style={{ fontFamily: 'lato' }}>Image & Text</h1>
                <button onClick={handleImgAndTextCardExpand} className="mr-5 text-cream">
                    <MenuKarrotIcon className={`text-cream w-[20px] h-[20px] cursor-pointer transition-all ease-in duration-300 ${isImgAndTxtCardExpanded ? `` : `rotate-180`}`} />
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
                            <button onClick={addImageComponent} className="flex justify-center items-center transition-all ease-in duration-200 text-cream hover:bg-stone-500 hover:text-[#D946EF] cursor-pointer w-[45px] h-[35px] p-2 mx-1 bg-stone-700 rounded-lg py-1 ">
                                <ImageIcon  className=""/>
                            </button>

                            <div className="flex justify-center ">
                                <div className=" h-[40px] w-px bg-cream/40 "></div>
                            </div>

                            <button onClick={addTextComponent} className="flex justify-center items-center transition-all ease-in duration-200 text-cream hover:bg-stone-500 hover:text-[#D946EF] cursor-pointer w-[45px] h-[35px] p-2 mx-1 bg-stone-700 rounded-lg py-1 ">
                                <TextIcon className=""/>
                            </button>
                        </div>
                    </div>

                        {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[90%] h-px bg-cream/40 my-2"></div>
                    </div>

                    <div className="flex justify-center items-center">
                        <h4 className="text-cream text-xs ml-5 mr-2"  style={{ fontFamily: 'lato' }}>Add up to 7 photos</h4>
                        <input ref={screenTextureFileRef} type="file" accept="image/*" onChange={(e) => handleScreenTextureUpload(e)} className="hidden"/>
                            {
                                <button className={isScreenTextureUploaded ? `hidden` :`flex justify-center items-center transition-all ease-in duration-200 text-cream hover:bg-stone-500 hover:text-[#D946EF] cursor-pointer w-[35px] h-[30px] p-2 mx-1 bg-stone-700 rounded-lg py-1`}
                                onClick={() => screenTextureFileRef.current?.click()}>
                                    <UploadIcon className=""/>
                                </button> 
                            }

                    </div>


                    <div className="flex justify-between items-center ">
                        
                    </div>

                    <div className="imageSelector flex mx-3 mb-2 py-2 ">
                        {/* screenTextures.map() */}
                        {screenTextures.map((img) => (
                            <div key={img.id} className="flex flex-col mx-1 ">
                                <input type="radio"  className=" mb-1" name="screenshot" checked={activeTextureID === img.id} onChange={() => handleTextureSelect(img.id)} id="" />
                                <div className="h-[auto] w-[28px] border-1 border-cream/40 mb-3">
                                    <img src={img.imgPath}  alt=""/>
                                </div>
                                <button onClick={() => handleTextureDelete(img.id)} className="bg-red-500 rounded-lg cursor-pointer">x</button>
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

                    {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[90%] h-px bg-cream/40 my-2"></div>
                    </div>
                    
                    <div className="flex justify-center items-center ">
                        <h4 className="text-cream text-xs mr-2 mb-2"  style={{ fontFamily: 'lato' }}>Captured</h4>
                    </div>

                    <div className="capturedContainer flex  mx-3 mb-2 py-2 ">


                        {capturedImages && capturedImages.map((img) => (
                            <div key={img.id} className="flex flex-col mx-1 ">
                                <div className="h-[auto] w-[28px] border-1 border-stone-300 mb-3">
                                    <img src={img.imgPath}  alt=""/>
                                </div>
                                <button onClick={() => handleCapturedImageDelete(img.id)}  className="bg-red-500 rounded-lg cursor-pointer">x</button>
                            </div>      
                        ))}

                        {/* When isCaptured has been set to true}
                        {capturedImages.map(img) => (
                            <div key={img.id} className="flex flex-col mx-1 ">
                                <div className="h-[45px] w-[28px] border-1 border-stone-300 mb-3">
                                    <img src={img.imgPath}  alt=""/>
                                </div>
                                <button onClick={() => handleTextureDelete(img.id)} className="bg-red-500 rounded-lg cursor-pointer">x</button>
                            </div>   
                        )}
                            */}
                    </div>

                    {/* Export button */}


                   



                </div>
            </div>
        </div>
    )
}