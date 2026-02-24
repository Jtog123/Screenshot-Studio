import { _RectAreaLightHelper } from "./LightHelper";
import { LightManager } from "./LightManager";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'

interface RectAreaLightGUIProps {
    _lightID : string;
    _lightManager  : LightManager
}

export default function RectAreaLightGUI({_lightID, _lightManager} : RectAreaLightGUIProps) {

    const light = _lightManager.getLight(_lightID);
    const[guiPosition, setGuiPosition] = useState({x:light!._guiX, y:light!._guiY});

    const[isDragging , setIsDragging] = useState(false);
    const offset = useRef({x:0, y:0});

    const[lightPosition, setLightPosition]= useState({
        x: light?._light.position.x,
        y: light?._light.position.y,
        z: light?._light.position.z,
    });

    const [expandedSections, setExpandedSections] = useState({
        position: true,
        appearance: true,
    });

    const[lightIntensity, setLightIntensity] = useState(light?._lightIntensity);
    const[lightColor, setLightColor] = useState("#FFFFFF");
    const[lightWidth, setLightWidth] = useState(2);
    const[lightHeight, setLightHeight] = useState(1);

    //on mounting update state
    useEffect(() => {
        const lightIntensity = light?._lightIntensity;
        setLightIntensity(lightIntensity);

        const hexString = "#" + String(light?._light.color.getHexString());
        setLightColor(hexString);

        const width = (light?._light as THREE.RectAreaLight).width;
        setLightWidth(width);

        const height = (light?._light as THREE.RectAreaLight).height;
        setLightHeight(height);

    },[_lightID]);


    //FOR MOVING GUI AROUND
    useEffect(() => {
        function handleMouseMove(e: MouseEvent) : void {
            if(!isDragging) return;

            const newX = e.clientX - offset.current.x
            const newY = e.clientY - offset.current.y

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

    //GUI SLIDERS
    function handlePosSliderChange(e: React.ChangeEvent<HTMLInputElement>, sliderName: string) : void {
        if(sliderName === "xPos") {
            setLightPosition({
                x: Number(e.target.value),
                y: Number(lightPosition.y),
                z: Number(lightPosition.z)
            });
            light!._light.position.setX(Number(e.target.value));

        } else if(sliderName === "yPos") {
            setLightPosition({
                x: Number(lightPosition.x),
                y: Number(e.target.value),
                z: Number(lightPosition.z)
            });
            light!._light.position.setY(Number(e.target.value));
        } else {
            setLightPosition({
                x: Number(lightPosition.x),
                y: Number(lightPosition.y),
                z: Number(e.target.value)
            });
            light!._light.position.setZ(Number(e.target.value));
        }

        //(light?._lightHelper as _RectAreaLightHelper).update();
    }

    function handleLightIntensityChange(e : React.ChangeEvent<HTMLInputElement>) : void {
        if(light) {
            light._light.intensity = Number(e.target.value);
            light._lightIntensity = Number(e.target.value);
        }
        setLightIntensity(Number(e.target.value));
    }

    function handleLightColorChange(e : React.ChangeEvent<HTMLInputElement>) : void {
        let selectedColor = e.target.value;
        let selectedColorValue = selectedColor.replace("#", "0x");

        if(light) {
            light._lightColor = selectedColorValue;
            light._light.color.set(Number(selectedColorValue));
        }

        setLightColor(selectedColor);
    }

    function handleLightWidthChange(e : React.ChangeEvent<HTMLInputElement>) : void {
        if(light) {
            //set internally?

            //set in threejs
            (light._light as THREE.RectAreaLight).width = Number(e.target.value);
        }
        setLightWidth(Number(e.target.value));
    }

    function handleLightHeightChange(e : React.ChangeEvent<HTMLInputElement>) : void {
        if(light) {
            //set internally?

            //set in threejs
            (light._light as THREE.RectAreaLight).height = Number(e.target.value);
        }
        setLightHeight(Number(e.target.value));
    }

    //GUI DRAG LOGIC
    function handleMouseDown(e : React.MouseEvent) : void {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - guiPosition.x,
            y : e.clientY - guiPosition.y
        };
        e.preventDefault()
    }

    function handleGUIWindowClose() : void {
        _lightManager.deselectLight(_lightID);
    }

    function toggleSection(section: keyof typeof expandedSections) {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }

    return (
        <>
        {
            <div style={{
                transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}  
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950 pb-3 z-50 backdrop-blur-md border border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3)] ring-1 ring-stone-700/50"
                >
                <div onMouseDown={handleMouseDown} className="sticky top-0 flex items-center justify-between cursor-move bg-stone-700/30 bg-red-200 w-full py-2 px-4 z-10">
                    <div className="titlebox ">
                        <h1 className="text-stone-200 text-base font-medium">
                            {(light?._lightHelper as _RectAreaLightHelper)._title}
                        </h1>
                    </div>

                    <button onClick={handleGUIWindowClose} className="rounded px-2 py-1 bg-red-500 text-white text-sm hover:bg-red-600">
                        ✕
                    </button>
                </div>

                <div className="px-4 py-2 space-y-2">
                    {/* POSITION SECTION */}
                    <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button onClick={() => toggleSection('position')}
                            className="w-full flex justify-between items-center px-3 py-2 bg-stone-800/50 hover:bg-stone-800 text-stone-200 text-sm">
                                <span>Position</span>
                                <span>{expandedSections.position ? '▼' : '▶'}</span>
                        </button>

                        {expandedSections.position && (
                            <div className="p-3 space-y-2 bg-stone-900/30">
                                <div className="grid grid-cols-1 gap-1">
                                    <div>
                                        <label className="text-sm text-stone-200" htmlFor="">X:</label>
                                        <input onChange={(e) => handlePosSliderChange(e, "xPos")} className="w-full h-1 accent-[#D946EF]" type="range" min={"-10"} max={"10"} value={lightPosition.x} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-sm text-stone-200" htmlFor="">Y:</label>
                                        <input onChange={(e) => handlePosSliderChange(e, "yPos")} className="w-full h-1 accent-[#D946EF]" type="range" min={"-10"} max={"10"} value={lightPosition.y} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-sm text-stone-200" htmlFor="">Z:</label>
                                        <input onChange={(e) => handlePosSliderChange(e, "zPos")} className="w-full h-1 accent-[#D946EF]" type="range" min={"-10"} max={"10"} value={lightPosition.z} step={"0.1"}/>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* APPEARANCE SECTION */}
                    <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleSection('appearance')}
                            className="w-full flex justify-between items-center px-3 py-2 bg-stone-800/50 hover:bg-stone-800 text-stone-200 text-sm"
                        >
                            <span>Appearance</span>
                            <span>{expandedSections.appearance ? '▼' : '▶'}</span>
                        </button>

                        {expandedSections.appearance && (
                            <div className="p-3 space-y-3 bg-stone-900/30">
                                <div className="grid grid-cols-1 gap-3">

                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-stone-300 pr-5" htmlFor="">Light Color: </label>
                                        <input onChange={handleLightColorChange} type="color" value={lightColor} />
                                    </div>

                                    <div>
                                        <label className="text-sm text-stone-200" htmlFor="">Width:</label>
                                        <input onChange={(e) => handleLightWidthChange(e)} className="h-1 w-full accent-[#D946EF]" type="range" min={"1"} max={"3.5"} value={lightWidth} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-sm text-stone-200" htmlFor="">Height:</label>
                                        <input onChange={(e) => handleLightHeightChange(e)} className="h-1 w-full accent-[#D946EF]" type="range" min={"1"} max={"3.5"} value={lightHeight} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-sm text-stone-200" htmlFor="">Intensity:</label>
                                        <input onChange={(e) => handleLightIntensityChange(e)} className="h-1 w-full accent-[#D946EF]" type="range" min={"1"} max={"10"} value={lightIntensity} step={"0.1"}/>
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