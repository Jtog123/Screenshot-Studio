import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'
import { CameraManager } from './CameraManager';

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
}

export default function PhoneGUI({phoneModel, _cameraManager}:PhoneGUIProps) {

    //const[yRotPreset, setYRotPreset] = useState(0);


    const[phoneRotation, setPhoneRotation] = useState({
        x: 0,
        y: 0,
        z: 0
    });

    const[activePreset, setActivePreset] = useState(0);

    const[isPhoneGuiOpen, setPhoneGuiOpen] = useState(true);

    useEffect(() => {
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

    function handleImageCapture() : void {
        console.log("Capturing the image");
        _cameraManager.captureImage();
    }



// fixed flex flex-col left-[calc(100vw/2)] z-22 transform translate-x-[-175%] translate-y-[-5%] overflow-hidden w-1/4 bg-stone-950 rounded-xl bottom-0 z-2 px-4 pb-3 pt-2 backdrop-blur-md border-2 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50 transition-all duration-500 ease-in-out"
    return(
        <>
            <div className="fixed flex flex-col left-0 z-22 transform translate-x-[1.4%] translate-y-[-1.8%] overflow-hidden w-1/4 bg-stone-950 rounded-xl bottom-0 z-2   backdrop-blur-md border-2 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50 transition-all duration-500 ease-in-out">

                <div className="px-4 pb-2 w-[full] bg-stone-700/30">
                    <div className=" flex wrapperDiv w-full mt-2 h-1/6 ">
                        <div className=" flex  titleDiv w-[100%] h-1/6 top-0 justify-between  rounded-xl mr-2">
                            <h1 className="text-stone-200 text-base font-medium">
                                Phone Controls
                            </h1>
                            <button onClick={handlePhoneGuiToggle} className="text-stone-200 h-[1/6] bg-stone-700/30 px-1 rounded-xl cursor-pointer text-base font-medium">
                                {isPhoneGuiOpen ? "Hide" : "Show"}
                            </button>

                        </div>

                    </div>

                </div>



                {/* X, Y, Z ROTATION */}
                <div className={`grid transition-all duration-300 ease-in-out mx-4 mb-2 ${
                    isPhoneGuiOpen ? 'grid-rows-[1fr]': 'grid-rows-[0fr]'
                }`}>
                    <div className="overflow-hidden flex flex-col">
                        <label className="text-sm text-stone-200 pt-1" htmlFor="">Rotate X: </label>
                        <div className="flex justify-between">
                            <input className='w-[95%] mr-2' onChange={(e) => handlePhoneRotation(e, "xRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.x} step="0.01" />
                            <button onClick={(e) => handleControlsReset(e, "xReset")} className='text-stone-200 bg-stone-500 rounded-4xl w-[10%] cursor-pointer'>r</button>
                        </div>


                        <label className="text-sm text-stone-200 pt-1" htmlFor="">Rotate Y: </label>
                        <div className="flex justify-between">
                            <input className='w-[95%] mr-2'  onChange={(e) => handlePhoneRotation(e, "yRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.y} step="0.01"/>
                            <button onClick={(e) => handleControlsReset(e, "yReset")} className='text-stone-200 bg-stone-500 rounded-4xl w-[10%] cursor-pointer'>r</button>
                        </div>


                        <label className="text-sm text-stone-200 pt-1" htmlFor="">Rotate Z: </label>
                        <div className="flex justify-between">
                            <input className='w-[95%] mr-2' onChange={(e) => handlePhoneRotation(e, "zRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.z} step="0.01"/>
                            <button onClick={(e) => handleControlsReset(e, "zReset")} className='text-stone-200 bg-stone-500 rounded-4xl w-[10%] cursor-pointer'>r</button>                            
                        </div>


                        {/*add presets here */}
                        <div className="flex flex-row justify-between pt-4 items-center">
                            <label className="text-sm text-stone-200 pt-1" htmlFor="">Presets: </label>
                            <button onClick={handleFrontView}  className={`text-stone-200 rounded-4xl w-[15%] cursor-pointer ${
                                activePreset === 0 ? 'bg-yellow-500' : 'bg-stone-500'
                            }`}>0</button>  

                            <button onClick={handleFifteenDegreeView} className={`text-stone-200 rounded-4xl w-[15%] cursor-pointer ${activePreset === 15 ? `bg-yellow-300` : `bg-stone-500`}` }>15</button>                            
                            <button onClick={handleThirtyDegreeView} className={`text-stone-200 rounded-4xl w-[15%] cursor-pointer ${activePreset === 30 ? `bg-yellow-300` : `bg-stone-500`}` }>30</button>                            
                            <button onClick={handleFortyFiveDegreeView} className={`text-stone-200 rounded-4xl w-[15%] cursor-pointer ${activePreset === 45 ? `bg-yellow-300` : `bg-stone-500`}` }>45</button>                            
                        </div>

                        {/* RESET */}
                        <div className="flex  items-center justify-between pt-1 mt-1">
                            {/*<button onClick={handleControlsReset} className="text-stone-200 h-[1/6] w-[20%] bg-stone-700/30 px-1 mt-3 rounded-xl ">Reset</button>*/}
                            {/*<CameraButton cameraManager={_cameraManager}/>*/}
                            <button onClick={handleImageCapture} className="rounded-4xl p-2 bg-red-200 cursor-pointer">
                                Cap
                            </button>
                        </div>

                    </div>

                    


                
                </div>





            </div>
        </>
    )
}