import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'
import { CameraManager } from './CameraManager';
import RefreshStartIcon from './IconAssets/RefreshStartIcon';
import EyeOpenIcon from './IconAssets/EyeOpenIcon';
import EyeMidIcon from './IconAssets/EyeMidIcon';
import EyeClosedIcon from './IconAssets/EyeClosedIcon';
import CameraIcon from './IconAssets/CameraIcon';
import CameraHoverIcon from './IconAssets/CameraHoverIcon';
import { AspectRatio } from './ComponentInterfaces';


/*

animation code
when its toggled closed
<div className="fixed h-screen bg-stone-950 text-white z-[1000] right-0 w-[5%] transition-all duration-300 ease-in-out">

when its open
<div className="fixed flex flex-col h-[100%] w-[25%] bg-stone-950 z-10 right-0 transition-all duration-300 ease-in-out">

*/

interface PhoneGUIProps {
    phoneModel : THREE.Group
    _cameraManager: CameraManager
    aspectRatio : AspectRatio
    isBackgroundTransparent : boolean
    setIsBackgroundTransparent : React.Dispatch<React.SetStateAction<boolean>>

}

export default function PhoneGUI({phoneModel, _cameraManager, aspectRatio, isBackgroundTransparent, setIsBackgroundTransparent}:PhoneGUIProps) {

    //const[yRotPreset, setYRotPreset] = useState(0);


    const[phoneRotation, setPhoneRotation] = useState({
        x: 0,
        y: 0,
        z: 0
    });

    const[selectedValue, setSelectedValue] = useState("0")

    const[activePreset, setActivePreset] = useState(0);

    const[isPhoneGuiOpen, setPhoneGuiOpen] = useState(true);

    //When i reset the phone i have to reupdate the local stoarge

    useEffect(() => {
        if(!phoneModel) return;

        //restore from local stoage
        const savedScene = localStorage.getItem("screenshotsweet_scene");
        if(savedScene) {
            const userSettings = JSON.parse(savedScene);

            if(userSettings.phone?.rotation) {
                (phoneModel as THREE.Group).rotation.x = Number(userSettings.phone.rotation.x);
                (phoneModel as THREE.Group).rotation.y = Number(userSettings.phone.rotation.y);
                (phoneModel as THREE.Group).rotation.z = Number(userSettings.phone.rotation.z);

                setPhoneRotation({
                    x: Number(userSettings.phone.rotation.x),
                    y: Number(userSettings.phone.rotation.y),
                    z: Number(userSettings.phone.rotation.z)
                });

                return;

            }
        }


        // Sync initial rotation from the model when it mounts
        if (phoneModel) {
            setPhoneRotation({
                x: phoneModel.rotation.x,
                y: phoneModel.rotation.y,
                z: phoneModel.rotation.z
            });
        }
    }, [phoneModel]);



    function handlePhoneGuiToggle() : void {
        setPhoneGuiOpen(!isPhoneGuiOpen);
    }

    //couple these to the presets??
    function handleControlsReset(e: React.MouseEvent, sliderName : string) : void {

        //update local storage
        let savedScene = localStorage.getItem("screenshotsweet_scene");
        if(savedScene) {
            let userSettings = JSON.parse(savedScene);


            if(sliderName == "xReset") {
                userSettings.phone.rotation.x = "0";
            } else if (sliderName == "yReset") {
                userSettings.phone.rotation.y = "0";
            } else if(sliderName == "zReset"){
                userSettings.phone.rotation.z = "0";
            }

            localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));
        }


        //update react and threejs state
        if(sliderName === "xReset") {
            setPhoneRotation({
                x: 0,
                y: phoneRotation.y,
                z: phoneRotation.z
            });
            (phoneModel as THREE.Group).rotation.x = 0;
        } else if(sliderName === "yReset") {
            setPhoneRotation({
                x: phoneRotation.x,
                y: 0,
                z: phoneRotation.z
            });
            (phoneModel as THREE.Group).rotation.y = 0;    
            setActivePreset(0);        
        } else {
            setPhoneRotation({
                x: phoneRotation.x,
                y: phoneRotation.y,
                z: 0
            });
            (phoneModel as THREE.Group).rotation.z = 0;               
        }
    }

    function handlePhoneRotation(e: React.ChangeEvent<HTMLInputElement>, sliderName : string) : void {

        const newValue = Number(e.target.value);

        //save to localstorage
        const userSettings = JSON.parse(localStorage.getItem("screenshotsweet_scene") || "{}");
        if(!userSettings.phone) {
            userSettings.phone = {
                rotation: {}
            };
        }
        userSettings.phone.rotation = {
            x: sliderName === "xRot" ? newValue : phoneRotation.x,
            y: sliderName === "yRot" ? newValue : phoneRotation.y,
            z: sliderName === "zRot" ? newValue : phoneRotation.z,
        };
        localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));

        //update react state, and threejs state
        if(sliderName === "xRot") {
            setPhoneRotation({
                x: Number(e.target.value),
                y: Number(phoneRotation.y),
                z: Number(phoneRotation.z)
            });
            //phoneModel.rotateX(phoneRotation.x);
            (phoneModel as THREE.Group).rotation.x = newValue;
            console.log("rotation x")
        } else if(sliderName === "yRot") {
            console.log("rotation y");
            setPhoneRotation({
                x: Number(phoneRotation.x),
                y: Number(e.target.value),
                z: Number(phoneRotation.z)
            });
            //phoneModel.rotateY(phoneRotation.y);
            (phoneModel as THREE.Group).rotation.y = newValue;
            setActivePreset(-1);
        } else {
            setPhoneRotation({
                x: Number(phoneRotation.x),
                y: Number(phoneRotation.y),
                z: Number(e.target.value)
            });
            (phoneModel as THREE.Group).rotation.z = newValue;
            //phoneModel.rotateZ(phoneRotation.z);
            console.log("rotation z")
        }
    }
    /*
    function handleFrontView() : void {
        setPhoneRotation({
            x: phoneRotation.x,
            y: 0,
            z: phoneRotation.z
        });
        phoneModel.rotation.y = 0;
        setActivePreset(0);
        
    }

    function handleFifteenDegreeView() : void {
        setPhoneRotation({
            x: phoneRotation.x,
            y: 0.261,
            z: phoneRotation.z
        });
        phoneModel.rotation.y = 0.261;
        setActivePreset(15);
    }

    function handleThirtyDegreeView() : void {
        setPhoneRotation({
            x: phoneRotation.x,
            y: 0.523,
            z: phoneRotation.z
        });
        phoneModel.rotation.y = 0.523;
        setActivePreset(30);
    }

    //couple these controls to the GUI?

    function handleFortyFiveDegreeView() : void {
        setPhoneRotation({
            x: phoneRotation.x,
            y: 0.785,
            z: phoneRotation.z
        });
        phoneModel.rotation.y = 0.785;
        setActivePreset(45);
    }
        */

    function handleImageCapture() : void {
        console.log("background is transparent:", isBackgroundTransparent);
        _cameraManager.determineBackgroundSettings(aspectRatio, isBackgroundTransparent);

        //_cameraManager.captureImage(aspectRatio);
        //_cameraManager.captureHomepageImage();
    }

    function handlePhonePresetsChange(e: React.ChangeEvent<HTMLSelectElement>) : void {
        console.log(typeof e.target.value);
        const inputValue = e.target.value;
        if(inputValue === "-15") {
            setPhoneRotation({
                x: phoneRotation.x,
                y: -0.261,
                z: phoneRotation.z
            });
            phoneModel.rotation.y = -0.261;
            setSelectedValue("-15");
        } else if(inputValue === "-30") {
            setPhoneRotation({
                x: phoneRotation.x,
                y: -0.523,
                z: phoneRotation.z
            });
            phoneModel.rotation.y = -0.523;
            setSelectedValue("-30");            
        } else if(inputValue === "-45") {
            setPhoneRotation({
                x: phoneRotation.x,
                y: -0.785,
                z: phoneRotation.z
            });
            phoneModel.rotation.y = -0.785;
            setSelectedValue("-45");
        } else if(inputValue === "0") {
             setPhoneRotation({
                x: phoneRotation.x,
                y: 0,
                z: phoneRotation.z
            });
            phoneModel.rotation.y = 0;
            setSelectedValue("0");           
        } else if(inputValue === "15") {
            setPhoneRotation({
                x: phoneRotation.x,
                y: 0.261,
                z: phoneRotation.z
            });
            phoneModel.rotation.y = 0.261;
            setSelectedValue("15");
        } else if(inputValue === "30") {
            setPhoneRotation({
                x: phoneRotation.x,
                y: 0.523,
                z: phoneRotation.z
            });
            phoneModel.rotation.y = 0.523;
            setSelectedValue("30");            
        } else if(inputValue === "45") {
            setPhoneRotation({
                x: phoneRotation.x,
                y: 0.785,
                z: phoneRotation.z
            });
            phoneModel.rotation.y = 0.785;
            setSelectedValue("45");   
        }
    }



// fixed flex flex-col left-[calc(100vw/2)] z-22 transform translate-x-[-175%] translate-y-[-5%] overflow-hidden w-1/4 bg-stone-950 rounded-xl bottom-0 z-2 px-4 pb-3 pt-2 backdrop-blur-md border-2 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50 transition-all duration-500 ease-in-out"
    return(
        <>
            <div className="fixed flex flex-col left-0 z-19 transform translate-x-[1.1%] translate-y-[-1.8%] overflow-hidden w-1/4 bg-chocolate rounded-xl bottom-0 z-2 backdrop-blur-md border-2 border-pink-cherry/50 shadow-[0_0_20px_rgba(229,196,133,0.15),0_0_0_4px_rgba(125,83,40,1),0_0_0_5px_rgba(229,196,133,0.35)] ring-1 ring-pink-cherry/50 transition-all duration-500 ease-in-out">

                <div className="px-4 pb-2 w-[full] bg-coffee/80 ">
                    <div className=" flex wrapperDiv w-full mt-2 h-1/6 ">
                        <div className=" flex titleDiv w-[100%] h-1/6 top-0  justify-between rounded-xl ">
                            <h1 className="text-cream-vanilla text-base font-medium" style={{ fontFamily: 'lato' }}>
                                Phone Rotation
                            </h1>
                            <button onClick={handlePhoneGuiToggle} className=" flex  justify-center items-center h-[24px] w-[34px] transition-all duration-100 ease-in bg-mocha hover:bg-espresso hover:text-cream-light px-1 rounded-xl cursor-pointer text-base font-medium group ">
                                {isPhoneGuiOpen ? 
                                <>                                
                                    <EyeOpenIcon className='text-cream-vanilla group-hover:hidden'/> 
                                    <EyeMidIcon className='text-cream-vanilla hidden group-hover:block'/>
                                </>
                                : <EyeClosedIcon className="text-cream-vanilla"/>}
                            </button>

                        </div>

                    </div>

                </div>



                {/* X, Y, Z ROTATION */}
                <div className={`grid transition-all duration-300 ease-in-out mx-4 mb-2 ${
                    isPhoneGuiOpen ? 'grid-rows-[1fr]': 'grid-rows-[0fr]'
                }`}>
                    <div className="overflow-hidden flex flex-col ">
                        <label className="text-sm text-cream-vanilla pt-1 mt-1 " style={{ fontFamily: 'lato' }} htmlFor="">X: </label>
                        <div className="flex justify-between justify-center items-center">
                            <input className='w-[95%] mr-2 h-1 accent-[#7D5328]' onChange={(e) => handlePhoneRotation(e, "xRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.x} step="0.01" />
                            <button onClick={(e) => handleControlsReset(e, "xReset")} className='flex justify-center items-center bg-coffee/80 hover:bg-amber/80 text-cream-vanilla hover:text-blue-frost transition-all duration-200  h-[24px] w-[40px]   rounded-4xl ] cursor-pointer group'>
                                <RefreshStartIcon className="transition-transform duration-300 group-hover:-rotate-90" />
                            </button>
                        </div>


                        <label className="text-sm text-cream-vanilla pt-1 " style={{ fontFamily: 'lato' }} htmlFor="">Y: </label>
                        <div className="flex justify-between justify-center items-center">
                            <input className='w-[95%] mr-2 h-1 accent-[#7D5328]'  onChange={(e) => handlePhoneRotation(e, "yRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.y} step="0.01"/>
                            <button onClick={(e) => handleControlsReset(e, "yReset")} className='flex justify-center items-center bg-coffee/80 hover:bg-amber/80 text-cream-vanilla hover:text-blue-frost transition-all duration-200   rounded-4xl h-[24px] w-[40px] cursor-pointer group'>
                                <RefreshStartIcon className="transition-transform duration-300 group-hover:-rotate-90" />
                            </button>
                        </div>


                        <label className="text-sm text-cream-vanilla pt-1" style={{ fontFamily: 'lato' }} htmlFor="">Z: </label>
                        <div className="flex justify-between justify-center items-center">
                            <input className='w-[95%] mr-2 h-1 accent-[#7D5328]' onChange={(e) => handlePhoneRotation(e, "zRot")} type="range" min={"-1.57"} max={"1.57"} value={phoneRotation.z} step="0.01"/>
                            
                            <button onClick={(e) => handleControlsReset(e, "zReset")} className='flex justify-center items-center bg-coffee/80 hover:bg-amber/80 text-cream-vanilla hover:text-blue-frost transition-all duration-200  rounded-4xl h-[24px] w-[40px] cursor-pointer group'>

                                <RefreshStartIcon className="transition-transform duration-300 group-hover:-rotate-90" />

                            </button>                            
                        </div>






                    </div>

                    


                
                </div>




                {/* PRESET */}
                <div className="flex items-center w-[100%] justify-between   ">
                    <div className='flex items-center w-[70%] ml-4   '>
                        <label className='text-md text-cream-vanilla mr-5 ' style={{ fontFamily: 'lato' }} htmlFor="">Presets</label>
                        <select value={selectedValue} onChange={handlePhonePresetsChange} className="w-[50%] h-[30px] px-1  text-cream-vanilla text-sm rounded-md bg-mocha  cursor-pointer">
                        
                            <option value="-45">-45°</option>
                            <option value="-30">-30°</option>
                            <option value="-15">-15°</option>
                            <option value="0">0°</option>
                            <option value="15">15°</option>
                            <option value="30">30°</option>
                            <option value="45">45°</option>
                        </select>
                    </div>

                    {/*<button onClick={handleControlsReset} className="text-stone-200 h-[1/6] w-[20%] bg-stone-700/30 px-1 mt-3 rounded-xl ">Reset</button>*/}
                    {/*<CameraButton cameraManager={_cameraManager}/>*/}
                    <div className='w-[20%] flex justify-end  mr-3 my-1 items-center   '>
                        <button onClick={handleImageCapture}  className="rounded-xl bg-pink-cherry  hover:bg-pink-candy disabled:stone-600 cursor-pointer mb-2 group transition-colors duration-100 mr-0.5">
                            <CameraIcon className='text-cream-vanialla/70 h-[40px] w-[40px] group-hover:hidden' />
                            <CameraHoverIcon className='text-espresso/70 h-[40px] w-[40px]  hidden group-hover:block  group-hover:scale-110 
                            transition-transform 
                            duration-300' />
                        </button>
                    </div>

                </div>

                <div className='flex juxtify-start w-[100%] items-center mb-1 '>
                    <div className='ml-4'>
                        <h1 className='text-sm text-cream-vanilla  mr-3'>Remove Background (Exports)</h1>
                    </div>
                    <input type="checkbox" checked={isBackgroundTransparent} onChange={() => setIsBackgroundTransparent(!isBackgroundTransparent)}className='bg-red-400' name="" id="" />


                    
                </div>



                {/* <EyeOpenIcon className='text-stone-300 group-hover:hidden'/> 
                                    <EyeMidIcon className='text-stone-300 hidden group-hover:block'/> */}





            </div>
        </>
    )
}