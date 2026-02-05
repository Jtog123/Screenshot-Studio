import { AssetManager } from "./AssetManager";
import { SceneComponent } from "./SceneComponent";
import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'

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
            z: componentPos.z
        });

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
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950  pb-5 z-2 backdrop-blur-md border-1 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50">

                
                <div onMouseDown={handleMouseDown} className="dragbar flex items-center justify-between cursor-pointer bg-stone-700/30 w-[100%] h-[1/4] py-1 pl-5 pr-2">
                    <div className="titlebox ">
                        <h1 className="title text-stone-200 text-lg">
                            {imageComponent?._title}
                        </h1>
                    </div>

                    <button onClick={handleGUIWindowClose}  className="rounded-xl right-0 mr-1 w-[10%] bg-red-500">
                        X
                    </button>
                </div>
                

                <div className="innerContents flex flex-col w-[100%] [h-100%] bg-stone-950 p-5">


                    <label className="text-sm text-stone-200" htmlFor="">Position X:</label>
                    <input name="xPos" className="w-full h-1" onChange={(e) => handlePosSlidersChange(e, "xPos")} type="range" min={"-10"} max={"10"} value={componentPos.x} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Y:</label>
                    <input name="yPos" className="w-full h-1" onChange={(e) => handlePosSlidersChange(e, "yPos")}type="range" min={"-10"} max={"10"} value={componentPos.y} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Z:</label>
                    <input name="zPos" className="w-full h-1" onChange={(e) => handlePosSlidersChange(e, "zPos")} type="range" min={"-10"} max={"10"} value={componentPos.z} step={"0.1"}/>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>

                    <label htmlFor="" className="text-sm text-stone-200"> Scale: </label>
                    <input name="scale" className="w-full h-1" onChange={(e) =>handleScaleSlidersChange(e)} type="range" min={"0.3"} value={componentScale.x} max={"3"} step={"0.1"}/>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>

                    <label htmlFor="" className="text-sm text-stone-200"> Opacity: </label>
                    <input name="opacity" className="w-full h-1" onChange={(e) => handleOpacityChange(e)} type="range" min={"0.1"} value={componentOpacity} max={"1"} step={"0.01"}/>



                </div>
                
            </div>
        }
        </>
    )

}