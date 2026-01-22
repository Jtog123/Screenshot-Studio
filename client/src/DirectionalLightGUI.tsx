import { useEffect, useRef, useState } from "react";
import { LightManager } from "./LightManager";
import { _DirectionalLightHelper } from "./LightHelper";

interface DirectionalLightGUIProps {
    _lightID : string;
    _lightManager  : LightManager

}

//copy gui code
export default function DirectionalLightGUI({_lightID, _lightManager} : DirectionalLightGUIProps) {
    const[position, setPosition] = useState({x:100, y:200});
    const[isDragging, setIsDragging] = useState(false);
    const offset = useRef({x:0,y:0});
    const dragItem = useRef<{clientX:number, clientY:number} | null>(null);

    const light = _lightManager.getLight(_lightID);

    function handleGUIWindowClose() : void {
        _lightManager.deselectLight(_lightID);
    }

    function handleMouseDown(e : React.MouseEvent) : void {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - position.x,
            y : e.clientY - position.y
        };
        e.preventDefault()
    }

    useEffect(() => {
        function handleMouseMove(e: MouseEvent) : void {
            if(!isDragging) return;
            const newX = e.clientX - offset.current.x
            const newY = e.clientY - offset.current.y

            setPosition({x: newX, y: newY});
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



    function handleMouseUp() : void {
        setIsDragging(false);
    }

    /*

    protected listenForLightColorChange() : void {
        //add an event listener on the gui windows
        this._colorInput.addEventListener("input", (evt: Event) => {
            this.updateLightColor(evt);
        })
    }

    // send in the each light?
    protected updateLightColor(event: Event) : void {
        const colorInput = event.target as HTMLInputElement;
        let colorString = colorInput.value.replace("#", "0x");
        
        const colorValue = new THREE.Color(Number(colorString));
        this._light._light.color = colorValue;
        console.log(colorString);

    }
    */

    
    
    return (
        <>
        {
            <div style={{
                transform: `translate(${position.x}px, ${position.y}px)`}}
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950  pb-5 z-2 backdrop-blur-md border-1 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50">

                <div onMouseDown={handleMouseDown}  className="dragbar flex items-center justify-between bg-stone-700/30 w-[100%] h-[1/4] py-1 pl-5 pr-2">
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
                        <input type="color" />

                    </div>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>

                    <label className="text-sm text-stone-200" htmlFor="">Position X:</label>
                    <input type="range" min={"-10"} max={"10"} value={"0"} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Y:</label>
                    <input type="range" min={"-10"} max={"10"} value={"0"} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Z:</label>
                    <input type="range" min={"-10"} max={"10"} value={"0"} step={"0.1"}/>

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