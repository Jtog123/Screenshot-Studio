import { useState, useRef, useEffect } from "react"
import {zip} from "fflate"
import { ImageComponentInterface, TextComponentInterface ,ScreenTextureInterface, CapturedImage} from "./ComponentInterfaces"
import * as THREE from 'three'
import { AssetManager } from "./AssetManager"
import { div, texture, userData } from "three/src/nodes/TSL.js"
import ImageIcon from "./IconAssets/ImageIcon"
import TextIcon from "./IconAssets/TextIcon"
import UploadIcon from "./IconAssets/ExportIcon"
import MenuKarrotIcon from "./IconAssets/MenuKarrotIcon"
import ExportIcon from "./IconAssets/ExportIcon"
import ImportIcon from "./IconAssets/ImportIcon"
import { AppUser, SubscriptionType } from "./AppUser"


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
    }, []);
    /*
    //clean up after unmount
    useEffect(() => {
        return() => {
            capturedImages.forEach((img) => {
                URL.revokeObjectURL(img.imgPath);
            })
        }
    }, [capturedImages]);
    */



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
        const file = input.files?.[0];

        if(!file) return;
        
        const acceptedFileTypes = ["image/png", "image/jpeg"];
        if(!acceptedFileTypes.includes(file.type)) {
            alert("Incorrect file type please use .PNG or .JPG");
            input.value="";
            return;
        }

        //10MB limit
        const maxFileSize = 10 * 1024 * 1024;
        if(file.size > maxFileSize) {
            alert("File size to large, must be below 10MB");
            input.value = "";
            return;
        }

        

        //Validate we have the correct file type
        if(input.files && input.files[0]) {
            //if the file tpye is not excepted reject
            if(!acceptedFileTypes.includes(input.files[0].type)) {
                alert("Incorrect file type please use .PNG or .JPG");
                return;
            }
        }

        
            //_assetManager.crea
            //console.log("uploading", input.files[0].type);

        const imgURL = URL.createObjectURL(file);

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

            // MembershipTier
        //somewhere in here we have to send a request to the backend to validate the user logged in
        // We first need to check their membership type
            //If the user is free we need to validate that they are under the export count
            // so If user Date.now() - last_export.getTime(); < 48 hrs ,allow them to export
            // else dont let them export, say your exoprts limit will reset in 

    async function checkUserMembership() : Promise<void> {
        return;
    }

    async function handleImageFileExport(): Promise<void> {
        console.log("exporting");
        
        if (capturedImages.length === 0) {
            alert("No images to export");
            return;
        }

        //going to have to validate the user before exporting
        // we now have the last export a user made
        // we now want to say if date.now() - last_export > 3 days
        // cant export limit wil reset in 'x' hours
        // else they are good to go
        try {
            const files: Record<string, Uint8Array> = {};
            let imageLimit = 0;
             

            //write validation logic here
            try {
                const firstResponse = await fetch("http://localhost:5050/api/userdata", {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        //"Content-Type": "application/json"
                    }
                });

                if (!firstResponse.ok) {
                    console.error("Failed to increment export count:", firstResponse.status);
                    return;
                }

                const userData = await firstResponse.json();

                //assign the amount of images a user can get
                imageLimit = userData.subscription_type === SubscriptionType.Free ? 3 : 7;


                console.log(userData.last_export);

                //const todaysDate = new Date();

                if(userData.subscription_type === SubscriptionType.Free) {
                    if(!userData.last_export) {
                        //If the user is new and has no exports
                        console.log("first export");
                    } else {
                        //Uncomment when ready for deployment!!


                        /*
                        const lastExportDate = new Date(userData.last_export);
                        const now = new Date();

                        //Delta between todays time and the users last export
                        const differenceInMs = now.getTime() - lastExportDate.getTime();
                        
                        const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60 * 24));

                        // if the delta between the times of today and users last export is greater than 2, allow for a new export
                        if(differenceInHours < 72) {
                            const hoursRemaning = Math.ceil(72 - differenceInHours)
                            //Show a timer? limit will reset 
                            console.log("Free Tier limit reached: 1 export per 2 days");
                            return;
                        } 
                            */

                    }


                } 

            } catch(err) {
                console.error("Error trying to get last export");
                alert("Unable to verify export limit. Please try again.");
                return;
            }

            /// Export allowed to continue after validation //////////////

            //const imageLimit = userData.subscription_type === SubscriptionType.Free ? 3 : 7;


            // Convert images to bytes
            /*
            for (let i = 0; i < capturedImages.length; i++) {
                const response = await fetch(capturedImages[i].imgPath);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                files[`mockup-${i + 1}.png`] = new Uint8Array(arrayBuffer);
            }
                */
            for (let i = 0; i < imageLimit; i++) {
                const response = await fetch(capturedImages[i].imgPath);
                const blob = await response.blob();
                const arrayBuffer = await blob.arrayBuffer();
                files[`mockup-${i + 1}.png`] = new Uint8Array(arrayBuffer);
            }
    

            // Create zip
            zip(files, async (err, data) => {
                if (err) {
                    console.error("Zip error:", err);
                    return;
                }

                // Download
                const blob = new Blob([data as any], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `ScreenshotSweet-Mockups-${Date.now()}.zip`;
                link.click();
                URL.revokeObjectURL(url);

                // Increment export count 
                try {
                    const response = await fetch("http://localhost:5050/api/export", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            //"Content-Type": "application/json"
                        }
                    });

                    if (!response.ok) {
                        console.error("Failed to increment export count:", response.status);
                        return;
                    }

                    const data = await response.json();
                    console.log("Export count updated:", data.export_count);
                    
                } catch (err) {
                    console.error("Failed to update export count:", err);
                    // Don't block the export if analytics fails
                }
            });
            
        } catch (error) {
            console.error("Export error:", error);
            alert("Export failed");
        }
    }

    return (
        <div  className={ isToolbarToggled ? `hidden`:`w-[100%] rounded-t-xl bg-cream-vanilla -mt-2 z-10 border-1 border-blue-ocean/80 transition-all duration-500 ease-in-out pb-1 overflox-auto  `}
        >

            <div onClick={handleImgAndTextCardExpand} className="flex justify-between items-center py-2 cursor-pointer">
                <h1 className="ml-5 text-espresso text-sm font-semibold"  style={{ fontFamily: 'lato' }}>Image & Text</h1>
                <button onClick={handleImgAndTextCardExpand} className="mr-5 text-cream">
                    <MenuKarrotIcon className={`text-blue-cobalt w-[20px] h-[20px] cursor-pointer transition-all ease-in duration-300 ${isImgAndTxtCardExpanded ? `` : `rotate-180`}`} />
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
                            <button onClick={addImageComponent} className="flex justify-center items-center transition-all ease-in duration-200 bg-blue-powder/60 hover:bg-blue-cobalt/80 text-espresso hover:text-cream-light  cursor-pointer w-[36px] h-[36px] p-1 mx-1  rounded-lg py-1 ">
                                <ImageIcon  className=""/>
                            </button>

                            <div className="flex justify-center ">
                                <div className=" h-[40px] w-px bg-cream/40 "></div>
                            </div>

                            <button onClick={addTextComponent} className="flex justify-center items-center transition-all ease-in duration-200 bg-blue-powder/60 hover:bg-blue-cobalt/80 text-espresso hover:text-cream-light  cursor-pointer w-[36px] h-[36px] p-1 mx-1  rounded-lg py-1 ">
                                <TextIcon className=""/>
                            </button>
                        </div>
                    </div>

                        {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[80%] h-px bg-blue-ocean/80 my-2"></div>
                    </div>

                    <div className="flex justify-center items-center">
                        <h4 className="text-espresso text-xs ml-5 mr-2"  style={{ fontFamily: 'lato' }}>Add up to 7 photos</h4>
                        <input ref={screenTextureFileRef} type="file" accept="image/png, image/jpeg" onChange={(e) => handleScreenTextureUpload(e)} className="hidden"/>
                            {
                                <button className={isScreenTextureUploaded ? `hidden` :`flex justify-center items-center transition-all ease-in duration-200 bg-blue-powder/60 hover:bg-blue-cobalt/80 text-espresso hover:text-cream-light  cursor-pointer w-[35px] h-[30px] p-2 mx-1  rounded-lg py-1`}
                                onClick={() => screenTextureFileRef.current?.click()}>
                                    <ImportIcon className=""/>
                                </button> 
                            }

                    </div>


                    <div className="flex justify-between items-center ">
                        
                    </div>

                    <div className="imageSelector flex mx-3 mb-2 py-2 ">
                        {/* screenTextures.map() */}
                        {screenTextures.map((img) => (
                            <div key={img.id} className="flex flex-col mx-1 ">
                                <input type="radio"  className=" mb-1 accent-[#C05400]" name="screenshot" checked={activeTextureID === img.id} onChange={() => handleTextureSelect(img.id)} id="" />
                                <div className="h-[auto] w-[28px] border-1 border-blue-cobalt/80 mb-3">
                                    <img src={img.imgPath}  alt=""/>
                                </div>
                                <button onClick={() => handleTextureDelete(img.id)} className=" transition-all ease-in duration-200 bg-stone-700 hover:bg-red-500 text-stone-300 hover:text-white rounded-lg cursor-pointer  text-espresso hover:text-cream-light">x</button>
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
                        <div className="w-[80%] h-px bg-blue-ocean/80 my-2"></div>
                    </div>
                    
                    <div className="flex justify-center items-center  ">
                        
                            <h4 className="text-espresso text-xs mr-2 ml-5"  style={{ fontFamily: 'lato' }}>Captured</h4>

                            <button onClick={handleImageFileExport}>
                                <ExportIcon className="flex justify-center items-center transition-all ease-in duration-200 bg-blue-powder/60 hover:bg-blue-cobalt/80 text-espresso hover:text-cream-light  cursor-pointer w-[35px] h-[30px] p-2 mx-1  rounded-lg py-1"/>
                            </button>
        

                    </div>



                    <div className="capturedContainer flex  mx-3 mb-2 py-2 ">



                        {capturedImages.length !== 0 ?  capturedImages.map((img) => (
                            <div key={img.id} className="flex flex-col mx-1 ">
                                <div className="h-[auto] w-[28px] border-1 border-orange-juicy/80 mb-3">
                                    <img src={img.imgPath}  alt=""/>
                                </div>
                                <button onClick={() => handleCapturedImageDelete(img.id)}  className="bg-red-500 rounded-lg cursor-pointer">x</button>
                            </div>      
                        )) :
                            <div className="flex w-[100%] justify-center items-center"> 
                                <h1 className="text-espresso/50 text-xs">No screenshots taken</h1>
                            </div>
                        }

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