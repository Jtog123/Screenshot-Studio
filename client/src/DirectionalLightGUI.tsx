import { useEffect, useRef, useState } from "react";
import { LightManager } from "./LightManager";
import { _DirectionalLightHelper } from "./LightHelper";
import { Light } from "./Light";
import * as THREE from 'three'
import { div } from "three/src/nodes/TSL.js";
import MenuKarrotIcon from "./IconAssets/MenuKarrotIcon";

interface DirectionalLightGUIProps {
    _lightID : string;
    _lightManager  : LightManager

}

//copy gui code
export default function DirectionalLightGUI({_lightID, _lightManager} : DirectionalLightGUIProps) {

    const light = _lightManager.getLight(_lightID);

    const[guiPosition, setGuiPosition] = useState({x:light!._guiX, y:light!._guiY});
    const[isDragging, setIsDragging] = useState(false);
    const[lightColor, setLightColor] = useState("#FFFFFF");
    const offset = useRef({x:0,y:0});
    const[intensity, setLightIntensity] = useState(light!._lightIntensity);
    //const dragItem = useRef<{clientX:number, clientY:number} | null>(null);

    // Light Positions
    const[lightPos , setLightPos] = useState({
        x: 0,
        y: 2,
        z: 0
    });

    const [expandedSections, setExpandedSections] = useState({
        position: true,
        appearance: true,
        border: false
    });

    //on mounting recall past state
    useEffect(() => {

        //now the position
        const guiPosX = light?._guiX;
        const guiPosY = light?._guiY;
        setGuiPosition({x: guiPosX as number , y:guiPosY as number});

        //get the current pos
        const currentXPos = light?._light.position.x;
        const currentYPos = light?._light.position.y;
        const currentZPos = light?._light.position.z;

        setLightPos({
            x: Number(currentXPos),
            y: Number(currentYPos),
            z: Number(currentZPos)
        })

        //now the Light Color
        const hexString = "#" + light?._light.color.getHexString();
        setLightColor(hexString);

        //get the intensity
        const intensity = Number(light?._lightIntensity);
        setLightIntensity(intensity);


    },[_lightID]);


    useEffect(() => {
        function handleMouseMove(e: MouseEvent) : void {
            if(!isDragging) return;
            //const light = _lightManager.getLight(_lightID);

            const newX = e.clientX - offset.current.x
            const newY = e.clientY - offset.current.y

            //assign it to the class
            light!._guiX = newX;
            light!._guiY = newY;

            setGuiPosition({x: newX, y: newY});
        }

        function handleMouseUp() {
            setIsDragging(false);
        }

        if(isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);

        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
    }, [isDragging]);


     //GUI DRAG LOGIC
    function handleGUIWindowClose() : void {
        _lightManager.deselectLight(_lightID);
    }

    function toggleSection(section: keyof typeof expandedSections) {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }

    function handleMouseDown(e : React.MouseEvent) : void {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - guiPosition.x,
            y : e.clientY - guiPosition.y
        };
        e.preventDefault()
    }


    function handlePosSlidersChange(e: React.ChangeEvent<HTMLInputElement>, sliderName:string) : void {
        
        //setLightXPos(e.target.value);

        //
        //light?._light.position.setX(Number(lightXPos));

        console.log("listening on" , e.target.value);
        //get the light
        //const light = _lightManager.getLight(_lightID);

        if(sliderName === "xPos") {
            setLightPos({
                x: Number(e.target.value),
                y: Number(lightPos.y),
                z: Number(lightPos.z)},
            );
            // Want fresh state
            light?._light.position.setX(Number(e.target.value));
        } else if(sliderName == "yPos") {
            setLightPos({
                x: Number(lightPos.x),
                y: Number(e.target.value),
                z: Number(lightPos.z)},
            );
            light?._light.position.setY(Number(e.target.value));
        } else {
            setLightPos({
                x: Number(lightPos.x),
                y: Number(lightPos.y),
                z: Number(e.target.value)},
            );    
            light?._light.position.setZ(Number(e.target.value));
        }

        (light?._lightHelper as _DirectionalLightHelper).update();

    }



    function handleLightColorChange(evt: React.ChangeEvent<HTMLInputElement>) : void {

        //grab the color from the secletor
        let selectedColor = evt.target.value;
        let selectedColorValue = selectedColor.replace("#", "0x");

        if(light) {
            //store internally in the class
            light._lightColor = selectedColorValue;
            //Set threejs and update teh state
            light._light.color!.set(Number(selectedColorValue));
        }

        setLightColor(selectedColor);
        //console.log("color rep is: ",light?._lightColor);

    }

    function handleLightIntensityChange(evt : React.ChangeEvent<HTMLInputElement>) : void {
        
        
        if(light) {
            //set threejs
            light._light.intensity = Number(evt.target.value);

            //set the light internally in the class
            light._lightIntensity = Number(evt.target.value);
            
            console.log(light._lightIntensity);
        }
        setLightIntensity(Number(evt.target.value));

    }

    

    
    return (
        <>
        {
            <div style={{
                transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-cream-vanilla overflow-auto  pb-3 z-50 backdrop-blur-md border border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3)] ring-1 ring-stone-700/50">

                <div onMouseDown={handleMouseDown} className="sticky top-0 flex items-center justify-between  cursor-move bg-blue-powder  w-full py-2 px-4 z-10">
                    <div className="titlebox ">
                        <h1 className="text-espresso text-base font-medium" style={{ fontFamily: 'lato' }} >
                            {(light?._lightHelper as _DirectionalLightHelper)._title}
                        </h1>
                    </div>

                    <button onClick={handleGUIWindowClose}  className=" transition-all ease-in duration-100 rounded-lg px-2 py-1 bg-stone-700 text-cream-light text-sm hover:bg-red-600 hover:text-cream-light cursor-pointer">
                         ✕
                    </button>
                </div>

                <div className="px-4 py-2 space-y-2">
                    {/* POSITION SECTION */}
                    <div className="border border-espresso rounded-lg overflow-hidden">
                        <button onClick={() => toggleSection('position')}
                            className="w-full flex justify-between items-center px-3 py-2 transition-all ease-in duration-100 bg-blue-powder hover:bg-blue-cobalt/30 text-espresso text-sm">
                                <span style={{ fontFamily: 'lato' }} >Position</span>
                                <span>{expandedSections.position ? <MenuKarrotIcon className="text-blue-cobalt w-[20px] h-[20px] rotate-180"/> : <MenuKarrotIcon className="text-blue-cobalt w-[20px] h-[20px]"/> }</span>
                        </button>

                        {expandedSections.position && (
                            <div className="p-3 space-y-2 bg-cream-vanilla">
                                <div className="grid grid-cols-1 gap-1">

                                    <div>
                                        <label className="text-xs text-espresso" style={{ fontFamily: 'lato' }}  htmlFor="">X:</label>
                                        <input name="xPos" className="w-full h-1  accent-[#4695E8]" onChange={(e) => handlePosSlidersChange(e, "xPos")} type="range" min={"-10"} max={"10"} value={lightPos.x} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-xs text-espresso" style={{ fontFamily: 'lato' }}  htmlFor="">Y:</label>
                                        <input name="yPos" className="w-full h-1 accent-[#4695E8]" onChange={(e) => handlePosSlidersChange(e, "yPos")}type="range" min={"-10"} max={"10"} value={lightPos.y} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-xs text-espresso" style={{ fontFamily: 'lato' }}  htmlFor="">Z:</label>
                                        <input name="zPos" className="w-full h-1 accent-[#4695E8]" onChange={(e) => handlePosSlidersChange(e, "zPos")} type="range" min={"-10"} max={"10"} value={lightPos.z} step={"0.1"}/>
                                    </div>

                                </div>
                            </div>
                        )}

                    </div>

                    {/* Appearance SECTION */}
                    <div className="border border-espresso rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleSection('appearance')}
                            className="w-full flex justify-between items-center px-3 py-2 bg-blue-powder  hover:hover:bg-blue-cobalt/30 text-espresso text-sm"
                        >
                            <span style={{ fontFamily: 'lato' }} >Appearance</span>
                            <span>{expandedSections.appearance ? <MenuKarrotIcon className="text-blue-cobalt w-[20px] h-[20px] rotate-180"/> : <MenuKarrotIcon className="text-blue-cobalt w-[20px] h-[20px]"/>}</span>
                        </button>

                        {expandedSections.appearance && (
                            <div className="p-3 space-y-3 bg-cream-vanilla">

                                <div className="grid grid-cols-1 gap-3 ">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-espresso pr-5" htmlFor="" style={{ fontFamily: 'lato' }} >Light Color: </label>
                                        <input onChange={handleLightColorChange} type="color" value={lightColor} />

                                    </div>

                                    <div>
                                        {/* INTNESITY */}
                                        <label className="text-xs text-espresso pr-5" htmlFor="" style={{ fontFamily: 'lato' }} >Intensity:</label>
                                        <input onChange={(e) => handleLightIntensityChange(e)} className="w-full h-1 accent-[#4695E8]" type="range" min={"0"} max={"50"} value={intensity} step={"0.1"}/>
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>
                </div>
                
            </div>
        }
        </>
    )

}