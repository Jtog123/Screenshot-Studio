import { div } from "three/src/nodes/TSL.js";
import { AssetManager } from "./AssetManager";
import { SceneComponent } from "./SceneComponent";
import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'
import MenuKarrotIcon from "./IconAssets/MenuKarrotIcon";

interface ImageComponentGUIProps {
     _componentID : string;
     _assetManager : AssetManager
}

export default function ImageComponentGUI({_componentID, _assetManager} : ImageComponentGUIProps) {

    const imageComponent = _assetManager.getComponent(_componentID);
    const[isDragging, setIsDragging] = useState(false);
    const offset = useRef({x:0,y:0});
    const[guiPosition, setGuiPosition] = useState({x:imageComponent!._guiX, y:imageComponent!._guiY});
    const[componentScale, setComponentScale] = useState({x:1, y:1, z:1});
    const[componentOpacity, setComponentOpacity] = useState(1);

    const[componentPos , setComponentPos] = useState({
        x: 1,
        y: 2,
        z: 0
    });

    const [expandedSections, setExpandedSections] = useState({
        position: true,
        appearance: true,
        border: false
    });


    useEffect(() => {

        //now the position
        const guiPosX = imageComponent?._guiX;
        const guiPosY = imageComponent?._guiY;
        setGuiPosition({x: guiPosX as number , y:guiPosY as number});

        //get the current pos
        const currentXPos = (imageComponent?._underlyingComponent as THREE.Sprite).position.x;
        const currentYPos = (imageComponent?._underlyingComponent as THREE.Sprite).position.y;
        const currentZPos = (imageComponent?._underlyingComponent as THREE.Sprite).position.z;

        setComponentPos({
            x: Number(currentXPos),
            y: Number(currentYPos),
            z: Number(currentZPos)
        });

        const currentXScale = (imageComponent?._underlyingComponent as THREE.Sprite).scale.x;
        const currentYScale = (imageComponent?._underlyingComponent as THREE.Sprite).scale.y;
        const currentZScale = (imageComponent?._underlyingComponent as THREE.Sprite).scale.z;

        setComponentScale({
            x: Number(currentXScale),
            y: Number(currentYScale),
            z: Number(currentZScale)
        })

        //opacity
        const currentOpacity = (imageComponent?._underlyingComponent as THREE.Sprite).material.opacity;
        setComponentOpacity(currentOpacity);


    },[_componentID]);

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) : void {
            if(!isDragging) return;
            //const light = _lightManager.getLight(_lightID);

            const newX = e.clientX - offset.current.x
            const newY = e.clientY - offset.current.y

            //assign it to the class
            imageComponent!._guiX = newX;
            imageComponent!._guiY = newY;

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


    function toggleSection(section: keyof typeof expandedSections) {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }

    function handlePosSlidersChange(e: React.ChangeEvent<HTMLInputElement>, sliderName:string) : void {
        

        console.log("listening on" , e.target.value);
        //get the light
        //const light = _lightManager.getLight(_lightID);

        if(sliderName === "xPos") {
            setComponentPos({
                x: Number(e.target.value),
                y: Number(componentPos.y),
                z: Number(componentPos.z)},
            );
            // Want fresh state
            imageComponent?._underlyingComponent?.position.setX(Number(e.target.value));
        } else if(sliderName == "yPos") {
            setComponentPos({
                x: Number(componentPos.x),
                y: Number(e.target.value),
                z: Number(componentPos.z)},
            );
            imageComponent?._underlyingComponent?.position.setY(Number(e.target.value));
        } else {
            setComponentPos({
                x: Number(componentPos.x),
                y: Number(componentPos.y),
                z: Number(e.target.value)},
            );    
            imageComponent?._underlyingComponent?.position.setZ(Number(e.target.value));
        }

        //(light?._lightHelper as _DirectionalLightHelper).update();

    }

     //GUI DRAG LOGIC
    function handleGUIWindowClose() : void {
        _assetManager.deselectComponent(_componentID);
    }

    function handleMouseDown(e : React.MouseEvent) : void {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - guiPosition.x,
            y : e.clientY - guiPosition.y
        };
        e.preventDefault()
    }

    function handleScaleSlidersChange(e :  React.ChangeEvent<HTMLInputElement>) : void {
        console.log(e.target.value);
        const scaleFactor = Number(e.target.value);
        //update the state in react
        setComponentScale({
            x: scaleFactor,
            y: scaleFactor,
            z: componentScale.z
        });

        if(imageComponent && imageComponent._originalScale) {
            imageComponent._originalScale.set(scaleFactor,scaleFactor, 1);
        }
        //update three.js
        imageComponent?._underlyingComponent?.scale.set(scaleFactor,scaleFactor, 1);
    }

    function handleOpacityChange(e :  React.ChangeEvent<HTMLInputElement>) : void {
        const opacityFactor = Number(e.target.value);
        setComponentOpacity(opacityFactor);

        if(imageComponent) {
            (imageComponent._underlyingComponent as THREE.Sprite).material.opacity = opacityFactor;
        }


    }


    return(
        <>
                {
            <div style={{
                transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950 pb-3 z-50 backdrop-blur-md border border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3)] ring-1 ring-stone-700/50">

                
                <div onMouseDown={handleMouseDown} style={{ fontFamily: 'lato' }}  className="sticky top-0 flex items-center justify-between  cursor-move bg-stone-700/30  w-full py-2 px-4 z-10">
                    <div className="titlebox ">
                        <h1 className="text-stone-200  text-base font-medium">
                            {imageComponent?._title}
                        </h1>
                    </div>

                    <button onClick={handleGUIWindowClose}  className="rounded px-2 py-1 bg-red-500 text-white text-sm hover:bg-red-600">
                        ✕
                    </button>
                </div>

                <div className="px-4 py-2 space-y-2">

                    {/* POSITION SECTION */}
                    <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleSection('position')}
                            className="w-full flex justify-between items-center px-3 py-2 bg-stone-800/50 hover:bg-stone-800 text-stone-200 text-sm"
                        >
                            <span style={{ fontFamily: 'lato' }} >Position</span>
                            <span>{<MenuKarrotIcon className={`text-stone-300 w-[20px] h-[20px] cursor-pointer transition-all ease-in duration-100 ${expandedSections.position ? `` : `rotate-180`}`}/>}</span>

                        </button>

                        {expandedSections.position && (
                            <div className="p-3 space-y-2 bg-stone-900/30"> 
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <label className="text-xs text-stone-300" style={{ fontFamily: 'lato' }}  htmlFor="">X:</label>
                                        <input name="xPos" className="w-full h-1 accent-[#D946EF]" onChange={(e) => handlePosSlidersChange(e, "xPos")} type="range" min={"-10"} max={"10"} value={componentPos.x} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-xs text-stone-300" style={{ fontFamily: 'lato' }}  htmlFor="">Y:</label>
                                        <input name="yPos" className="w-full h-1 accent-[#D946EF]" onChange={(e) => handlePosSlidersChange(e, "yPos")}type="range" min={"-10"} max={"10"} value={componentPos.y} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label className="text-xs text-stone-300" style={{ fontFamily: 'lato' }}  htmlFor="">Z:</label>
                                        <input name="zPos" className="w-full h-1 accent-[#D946EF]" onChange={(e) => handlePosSlidersChange(e, "zPos")} type="range" min={"-10"} max={"10"} value={componentPos.z} step={"0.1"}/>
                                    </div>

                                </div>
                            </div>
                        )}


                    </div>

                    {/* APPEARANCE */}


                    <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleSection("appearance")}
                            className="w-full flex justify-between items-center px-3 py-2 bg-stone-800/50 hover:bg-stone-800 text-stone-200 text-sm"
                        >
                            <span style={{ fontFamily: 'lato' }} >Appearance</span>

                            <span>{<MenuKarrotIcon className={`text-stone-300 w-[20px] h-[20px] cursor-pointer transition-all ease-in duration-100 ${expandedSections.appearance ? `` : `rotate-180`}`}/>}</span>
                        </button>

                        {expandedSections.appearance && (
                            <div className="p-3 space-y-2 bg-stone-900/30"> 
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <label htmlFor="" className="text-xs text-stone-300" style={{ fontFamily: 'lato' }} > Scale: </label>
                                        <input name="scale" className="w-full h-1 accent-[#D946EF]" onChange={(e) =>handleScaleSlidersChange(e)} type="range" min={"0.3"} value={componentScale.x} max={"3"} step={"0.1"}/>
                                    </div>

                                    <div>
                                        <label htmlFor="" className="text-xs text-stone-300" style={{ fontFamily: 'lato' }} > Opacity: </label>
                                        <input name="opacity" className="w-full h-1 accent-[#D946EF]" onChange={(e) => handleOpacityChange(e)} type="range" min={"0.1"} value={componentOpacity} max={"1"} step={"0.01"}/>
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