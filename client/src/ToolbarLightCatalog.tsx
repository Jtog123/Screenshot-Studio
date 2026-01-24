import * as THREE from 'three'
import { JSX } from 'react';
import { LightManager } from "./LightManager";
import ActiveListItem from './ActiveListItem';
import { LightType } from './Light';
import { useEffect, useState } from 'react';
import { _DirectionalLightHelper, _SpotLightHelper, _PointLightHelper, _RectAreaLightHelper } from './LightHelper';


interface ToolbarLightCatalogProps {
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    isToolbarToggled : boolean
    scene : THREE.Scene,
    lightManager : LightManager

}

/*

key distnction we are hiding threejs meshes not DOM components use the lightmanager
*/

//will need to take in the scene
export default function ToolbarLightCatalog({activeListItems, setActiveListItems, isToolbarToggled, scene, lightManager} : ToolbarLightCatalogProps) {


    function handleDirectionalLightCreation() : void {
        //console.log("creating directional light");
        const newLight = lightManager.createLight(LightType.DirectionalLight, new THREE.Vector3(2,2,0));

        //read in information to create list items
        const listItemName = (newLight._lightHelper as _DirectionalLightHelper)._title;
        const listItemID = (newLight._lightHelper as _DirectionalLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);

        //setActiveListItems([...activeListItems, <ActiveListItem key={listItemID} itemName={listItemName}/> ])
        //setAc
    }

    function handleSpotLightCreation() : void {
        console.log("creating directional light");
        const newLight = lightManager.createLight(LightType.SpotLight, new THREE.Vector3(2,2,0));

        const listItemName = (newLight._lightHelper as _SpotLightHelper)._title;
        const listItemID = (newLight._lightHelper as _SpotLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);
        //Gui Creation happens here

    }

    function handlePointLightCreation() : void {
        const newLight = lightManager.createLight(LightType.PointLight, new THREE.Vector3(2,2,0));

        const listItemName = (newLight._lightHelper as _PointLightHelper)._title;
        const listItemID = (newLight._lightHelper as _PointLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);
    }

    function handleRectAreaLightCreation() : void {
        const newLight = lightManager.createLight(LightType.RectAreaLight, new THREE.Vector3(2,2,0));

        const listItemName = (newLight._lightHelper as _RectAreaLightHelper)._title;
        const listItemID = (newLight._lightHelper as _RectAreaLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);
    }


    return (
        <>
        <div className={isToolbarToggled ? `hidden`:`flex justify-center items-center w-[screen] h-[52.5%] bg-stone-950`}>
            <div className="grid grid-cols-2 grid-rows-2 w-[90%] h-[90%] bg-yellow-300">
                <button onClick={handleDirectionalLightCreation} className="text-md bg-red-500"> Directional Light</button>
                <button onClick={handleSpotLightCreation} className="text-md bg-purple-500"> Spot Light</button>
                <button onClick={handlePointLightCreation} className="text-md bg-green-500"> Point Light</button>
                <button onClick={handleRectAreaLightCreation} className="text-md bg-emerald-500"> Rect Area Light</button>
            </div>
        </div>

        </>
    )
}