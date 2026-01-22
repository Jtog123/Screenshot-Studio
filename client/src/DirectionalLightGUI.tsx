import { useEffect, useRef, useState } from "react";
import { LightManager } from "./LightManager";
import { _DirectionalLightHelper } from "./LightHelper";
import { Light } from "./Light";
import * as THREE from 'three'

interface DirectionalLightGUIProps {
    _lightID : string;
    _lightManager  : LightManager

}

//copy gui code
export default function DirectionalLightGUI({_lightID, _lightManager} : DirectionalLightGUIProps) {

    const light = _lightManager.getLight(_lightID);

    const[guiPosition, setGuiPosition] = useState({x:light!._guiX, y:light!._guiY});
    const[isDragging, setIsDragging] = useState(false);
    const[lightColor, setLightColor] = useState("#FFFFFF")
    const offset = useRef({x:0,y:0});
    //const dragItem = useRef<{clientX:number, clientY:number} | null>(null);

    // Light Positions
    const[lightPos , setLightPos] = useState({
        x: 0,
        y: 2,
        z: 0
    })


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

        //update light color
        //updateLightColor()

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
    }, [isDragging]);


    function handleGUIWindowClose() : void {
        _lightManager.deselectLight(_lightID);
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

       

    }

    function handleLightColorChange(evt: React.ChangeEvent<HTMLInputElement>) : void {


        //grab the color from the secletor
        let selectedColor = (evt.target as HTMLInputElement).value;
        let selectedColorValue = selectedColor.replace("#", "0x");

        //store internally in the class
        light!._lightColor = selectedColorValue;

        //Set threejs and update teh state
        light?._light.color!.set(Number(selectedColorValue));
        setLightColor(selectedColor);
        //console.log("color rep is: ",light?._lightColor);

    }

    function handleMouseUp() : void {

        setIsDragging(false);
    }



    
    
    return (
        <>
        {
            <div style={{
                transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950  pb-5 z-2 backdrop-blur-md border-1 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50">

                <div onMouseDown={handleMouseDown} className="dragbar flex items-center justify-between bg-stone-700/30 w-[100%] h-[1/4] py-1 pl-5 pr-2">
                    <div className="titlebox ">
                        <h1 className="title text-stone-200 text-lg">
                            {(light?._lightHelper as _DirectionalLightHelper)._title}
                        </h1>
                    </div>

                    <button onClick={handleGUIWindowClose}  className="rounded-xl right-0 mr-1 w-[10%] bg-red-500">
                        X
                    </button>
                </div>

                <div className="innerContents flex flex-col w-[100%] [h-100%] bg-stone-950 p-5">
                    <div className="colorContainer flex w-[100%] h-[100%] items-center">
                        <label className="text-sm text-stone-200 pr-5" htmlFor="">Light Color: </label>
                        <input onChange={handleLightColorChange} type="color" value={lightColor} />

                    </div>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>

                    <label className="text-sm text-stone-200" htmlFor="">Position X:</label>
                    <input name="xPos" onChange={(e) => handlePosSlidersChange(e, "xPos")} type="range" min={"-10"} max={"10"} value={lightPos.x} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Y:</label>
                    <input name="yPos" onChange={(e) => handlePosSlidersChange(e, "yPos")}type="range" min={"-10"} max={"10"} value={lightPos.y} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Z:</label>
                    <input name="zPos" onChange={(e) => handlePosSlidersChange(e, "zPos")} type="range" min={"-10"} max={"10"} value={lightPos.z} step={"0.1"}/>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>


                    {/* ROTATION */}

                    <label className="text-sm text-stone-200" htmlFor="">Rotation X:</label>
                    <input type="range" min={"-10"} max={"10"} value={"0"} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Rotation Z:</label>
                    <input type="range" min={"-10"} max={"10"} value={"0"} step={"0.1"}/>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>


                    {/* INTNESITY */}
                    <label className="text-sm text-stone-200" htmlFor="">Intensity:</label>
                    <input type="range" min={"0"} max={"50"} value={"5"} step={"0.1"}/>

                </div>
                
            </div>
        }
        </>
    )

}