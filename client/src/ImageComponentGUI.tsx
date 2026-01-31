import { AssetManager } from "./AssetManager";
import { SceneComponent } from "./SceneComponent";
import {useRef, useEffect, useState} from 'react'

interface ImageComponentGUIProps {
     _componentID : string;
     _assetManager : AssetManager
}

export default function ImageComponentGUI({_componentID, _assetManager} : ImageComponentGUIProps) {

    const imageComponent = _assetManager.getComponent(_componentID)

    const[guiPosition, setGuiPosition] = useState({x:imageComponent!._guiX, y:imageComponent!._guiY});
    return(
        <>
                {
            <div style={{
                transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}
                className="absolute rounded-xl right-[800px] top-[200px] min-w-[300px] min-h-[150px] max-w-[450px] overflow-auto bg-stone-950  pb-5 z-2 backdrop-blur-md border-1 border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3),0_0_0_4px_rgba(28,25,23,1),0_0_0_5px_rgba(168,162,158,0.5)] ring-1 ring-stone-700/50">

                    putting some content in

                {/* 
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
                */}

                <div className="innerContents flex flex-col w-[100%] [h-100%] bg-stone-950 p-5">

                    {/* Position 
                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>

                    <label className="text-sm text-stone-200" htmlFor="">Position X:</label>
                    <input name="xPos" onChange={(e) => handlePosSlidersChange(e, "xPos")} type="range" min={"-10"} max={"10"} value={lightPos.x} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Y:</label>
                    <input name="yPos" onChange={(e) => handlePosSlidersChange(e, "yPos")}type="range" min={"-10"} max={"10"} value={lightPos.y} step={"0.1"}/>

                    <label className="text-sm text-stone-200" htmlFor="">Position Z:</label>
                    <input name="zPos" onChange={(e) => handlePosSlidersChange(e, "zPos")} type="range" min={"-10"} max={"10"} value={lightPos.z} step={"0.1"}/>

                    <div className="divider w-full h-px bg-stone-300/40 my-3"></div>*/}





                </div>
                
            </div>
        }
        </>
    )

}