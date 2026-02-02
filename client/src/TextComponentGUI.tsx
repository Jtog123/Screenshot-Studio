import { AssetManager } from "./AssetManager";
import { SceneComponent } from "./SceneComponent";
import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'

interface TextComponentGUIProps {
    _componentID : string;
    onClose : (id: string) => void

}

export default function TextComponentGUI({_componentID} : TextComponentGUIProps) {

    //const textComponent = _assetManager.getComponent(_componentID);
    const[isDragging, setIsDragging] = useState(false);
    const offset = useRef({x:0,y:0});
    //const[guiPosition, setGuiPosition] = useState({x:textComponent!._guiX, y:textComponent!._guiY});
    const[guiPosition, setGuiPosition] = useState({x:100, y:100});
    const[componentOpacity, setComponentOpacity] = useState(1);

    /*
    const[componentPos , setComponentPos] = useState({
        x: 1,
        y: 2,
        z: 0
    });
    */

    

    function handleMouseDown(e : React.MouseEvent) : void {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - guiPosition.x,
            y : e.clientY - guiPosition.y
        };
        e.preventDefault()
    }



    function handleOpacityChange(e :  React.ChangeEvent<HTMLInputElement>) : void {
        const opacityFactor = Number(e.target.value);
        setComponentOpacity(opacityFactor);

        //if(textComponent) {
        //    (textComponent._underlyingComponent as THREE.Sprite).material.opacity = opacityFactor;
        //}


    }


    return(
        <>
                {
            <div style={{
                transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950  pb-5 z-2 backdrop-blur-md border-1 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50">

                
                <div onMouseDown={handleMouseDown} className="dragbar flex items-center justify-between cursor-pointer bg-stone-700/30 w-[100%] h-[1/4] py-1 pl-5 pr-2">
                    <div className="titlebox ">
                        <h1 className="title text-stone-200 text-lg">
                       
                        </h1>
                    </div>

                    <button  className="rounded-xl right-0 mr-1 w-[10%] bg-red-500">
                        X
                    </button>
                </div>
                

                <div className="innerContents flex flex-col w-[100%] [h-100%] bg-stone-950 p-5">

                    {/* 
                    <label className="text-sm text-stone-200" htmlFor="">Position X:</label>
                    <input name="xPos" onChange={(e) => handlePosSlidersChange(e, "xPos")} type="range" min={"-10"} max={"10"} value={componentPos.x} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Y:</label>
                    <input name="yPos" onChange={(e) => handlePosSlidersChange(e, "yPos")}type="range" min={"-10"} max={"10"} value={componentPos.y} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Z:</label>
                    <input name="zPos" onChange={(e) => handlePosSlidersChange(e, "zPos")} type="range" min={"-10"} max={"10"} value={componentPos.z} step={"0.1"}/>
                    */}

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>


                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>

                    <label htmlFor="" className="text-sm text-stone-200"> Opacity: </label>
                    <input name="opacity" onChange={(e) => handleOpacityChange(e)} type="range" min={"0.1"} value={componentOpacity} max={"1"} step={"0.01"}/>










                </div>
                
            </div>
        }
        </>
    )

}