import { _SpotLightHelper } from "./LightHelper";
import { LightManager } from "./LightManager";
import { useEffect, useRef, useState } from "react";


interface SpotLightGUIProps {
    _lightID : string;
    _lightManager  : LightManager

}

export default function SpotLightGUI({_lightID, _lightManager} : SpotLightGUIProps) {

    const light = _lightManager.getLight(_lightID);
    const[guiPosition, setGuiPosition] = useState({x:light!._guiX, y:light!._guiY});

    const[isDragging , setIsDragging] = useState(false);
    const offset = useRef({x:0, y:0});

    const[lightPosition, setLightPosition]= useState({
        x: light?._light.position.x,
        y: light?._light.position.y,
        z: light?._light.position.z,
    });

    //on mounting update state
    //need to recolor the spot light helper every update
    useEffect(() => {


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
    }

    (light?._lightHelper as _SpotLightHelper).update();
    //nneed to recolor the spotlight helper every update


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







    
    return (
        <>
        {
            <div style={{
                transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}  
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950  pb-5 z-2 backdrop-blur-md border-1 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50"
                >
                <div onMouseDown={handleMouseDown} className="dragbar flex items-center justify-between bg-stone-700/30 w-[100%] h-[1/4] py-1 pl-5 pr-2">
                    <div className="titlebox ">
                        <h1 className="title text-stone-200 text-lg">
                            {(light?._lightHelper as _SpotLightHelper)._title}
                        </h1>
                    </div>

                    <button onClick={handleGUIWindowClose}  className="rounded-xl right-0 mr-1 w-[10%] bg-red-500">
                        X
                    </button>
                </div>

                <div className="innerContents flex flex-col w-[100%] [h-100%] bg-stone-950 p-5">
                    <div className="colorContainer flex w-[100%] h-[100%] items-center">
                        <label className="text-sm text-stone-200 pr-5" htmlFor="">Light Color: </label>
                        <input type="color" />

                    </div>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>

                    <label className="text-sm text-stone-200" htmlFor="">Position X:</label>
                    <input onChange={(e) => handlePosSliderChange(e, "xPos")} type="range" min={"-10"} max={"10"}  value={lightPosition.x} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Y:</label>
                    <input onChange={(e) => handlePosSliderChange(e, "yPos")} type="range" min={"-10"} max={"10"} value={lightPosition.y} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Z:</label>
                    <input  onChange={(e) => handlePosSliderChange(e, "zPos")} type="range" min={"-10"} max={"10"} value={lightPosition.z} step={"0.1"}/>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>


                    {/* ROTATION 

                    <label className="text-sm text-stone-200" htmlFor="">Rotation X:</label>
                    <input type="range" min={"-10"} max={"10"} value={"0"} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Rotation Z:</label>
                    <input type="range" min={"-10"} max={"10"} value={"0"} step={"0.1"}/>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>
                    */}


                    {/* INTNESITY */}
                    <label className="text-sm text-stone-200" htmlFor="">Intensity:</label>
                    <input type="range" min={"0"} max={"50"}  step={"0.1"}/>

                </div>
                
            </div>
        }
        </>
    )

}