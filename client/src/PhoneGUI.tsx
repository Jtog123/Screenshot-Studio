import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'
import CameraButton from './CameraButton'
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
    cameraManager: CameraManager
}

export default function PhoneGUI({phoneModel, cameraManager}:PhoneGUIProps) {


    const[phoneRotation, setPhoneRotation] = useState({
        x: 0,
        y: 0,
        z: 0
    });

    const[isPhoneGuiOpen, setPhoneGuiOpen] = useState(true);

    function handlePhoneGuiToggle() : void {
        setPhoneGuiOpen(!isPhoneGuiOpen);
    }

    function handleControlsReset() : void {
        setPhoneRotation({
            x: 0,
            y: 0,
            z: 0
        });

        (phoneModel as THREE.Group).rotation.x = 0;
        (phoneModel as THREE.Group).rotation.y = 0;
        (phoneModel as THREE.Group).rotation.z = 0;

    }

    function handlePhoneRotation(e: React.ChangeEvent<HTMLInputElement>, sliderName : string) : void {
        if(sliderName === "xRot") {
            setPhoneRotation({
                x: Number(e.target.value),
                y: Number(phoneRotation.y),
                z: Number(phoneRotation.z)
            });
            //phoneModel.rotateX(phoneRotation.x);
            (phoneModel as THREE.Group).rotation.x = phoneRotation.x;
            console.log("rotation x")
        } else if(sliderName === "yRot") {
            console.log("rotation y");
            setPhoneRotation({
                x: Number(phoneRotation.x),
                y: Number(e.target.value),
                z: Number(phoneRotation.z)
            });
            //phoneModel.rotateY(phoneRotation.y);
            (phoneModel as THREE.Group).rotation.y = phoneRotation.y;
        } else {
            setPhoneRotation({
                x: Number(phoneRotation.x),
                y: Number(phoneRotation.y),
                z: Number(e.target.value)
            });
            (phoneModel as THREE.Group).rotation.z = phoneRotation.z;
            //phoneModel.rotateZ(phoneRotation.z);
            console.log("rotation z")
        }
    }

    return(
        <>
            <div className="fixed flex flex-col left-[calc(100vw/2)] z-22 transform translate-x-[-175%] translate-y-[-5%] overflow-hidden w-1/4 bg-stone-950 rounded-xl bottom-0 z-2 px-4 pb-3 pt-2 backdrop-blur-md border-2 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50 transition-all duration-500 ease-in-out">

                <div className=" flex wrapperDiv w-full h-1/6 ">
                    <div className=" flex flex-row titleDiv w-[95%] h-1/6 top-0 flex justify-center bg-stone-700/30 rounded-xl mr-2">
                        <h1 className="text-stone-200 text-lg">
                            Phone Controls
                        </h1>

                    </div>

                    <button onClick={handlePhoneGuiToggle} className="text-stone-200 h-[1/6]  bg-stone-700/30 px-1 rounded-xl">
                        {isPhoneGuiOpen ? "Hide" : "Show"}
                    </button>
                </div>

                {/* X, Y, Z ROTATION */}
                <div className={`grid transition-all duration-300 ease-in-out ${
                    isPhoneGuiOpen ? 'grid-rows-[1fr]': 'grid-rows-[0fr]'
                }`}>
                    <div className="overflow-hidden flex flex-col">
                        <label className="text-sm text-stone-200 pt-1" htmlFor="">Rotate X: </label>
                        <input onChange={(e) => handlePhoneRotation(e, "xRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.x} step="0.01" />

                        <label className="text-sm text-stone-200 pt-1" htmlFor="">Rotate Y: </label>
                        <input onChange={(e) => handlePhoneRotation(e, "yRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.y} step="0.01"/>

                        <label className="text-sm text-stone-200 pt-1" htmlFor="">Rotate Z: </label>
                        <input onChange={(e) => handlePhoneRotation(e, "zRot")} type="range" min={"-1"} max={"1"} value={phoneRotation.z} step="0.01"/>

                        {/* RESET */}
                        <div className="flex  items-center justify-between pt-1">
                            <button onClick={handleControlsReset} className="text-stone-200 h-[1/6] w-[20%] bg-stone-700/30 px-1 mt-3 rounded-xl ">Reset</button>
                            <CameraButton cameraManager={cameraManager}/>
                        </div>

                    </div>

                    


                
                </div>





            </div>
        </>
    )
}