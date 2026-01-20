import * as THREE from 'three'
import { LightManager } from "./LightManager";
import { LightType } from './Light';
import { useEffect, useState } from 'react';


interface ToolbarLightCatalogProps {
    scene : THREE.Scene,
    lightManager : LightManager
}

//will need to take in the scene
export default function ToolbarLightCatalog({scene, lightManager} : ToolbarLightCatalogProps) {


    function handleDirectionalLightCreation() : void {
        console.log("creating directional light");
        const newLight = lightManager.createLight(LightType.DirectionalLight, new THREE.Vector3(2,2,0));

        const newLight2 = lightManager.createLight(LightType.DirectionalLight, new THREE.Vector3(-2,2,0));
        //Gui Creation happens here

    }


    return (
        <>
        <div className="flex justify-center items-center w-[screen] h-[52.5%] bg-stone-950">
            <div className="grid grid-cols-2 grid-rows-2 w-[90%] h-[90%] bg-yellow-300">
                <button onClick={handleDirectionalLightCreation} className="text-md bg-red-500"> Directional Light</button>
                <button className="text-md bg-purple-500"> Spot Light</button>
                <button className="text-md bg-green-500"> Point Light</button>
                <button className="text-md bg-emerald-500"> Rect Area Light</button>
            </div>
        </div>

        </>
    )
}