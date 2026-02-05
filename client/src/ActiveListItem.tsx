import { useState } from "react";
import { LightManager } from "./LightManager"
import { AssetManager } from "./AssetManager";
import * as THREE from 'three'

interface ActiveListItemProps {
    itemName : string
    itemID : string // lightID for now
    activeListItems : {id:string, name:string}[]
    setActiveListItems : React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    lightManager : LightManager
    assetManager : AssetManager
  
    
}

/*
Will have to add the assetmanager in here somehow and also combine the light logic with other component logic


*/

export default function ActiveListItem({itemName, itemID, activeListItems, setActiveListItems, lightManager, assetManager}:ActiveListItemProps) {

    const[isItemVisible, setItemVisibility] = useState(true);


    //NOT WORKING YET, WANt to select an item by clcking on the listItem
    function handleListItemSelection() : void {


        if(itemID.startsWith("sprite_image_") || itemID.startsWith("text_")) {
            const component = assetManager.getComponent(itemID);

            //if the component not visible bail out
            if(! component?._underlyingComponent?.visible) {
                return;
            }

            if(assetManager._selectedComponentID !== null) {
                assetManager.deselectComponent(assetManager._selectedComponentID);
            }
            assetManager.selectComponentByID(itemID);

        } else {
            const light = lightManager.getLight(itemID);

            if(!light?._light.visible) {
                return;
            }

            if(lightManager._selectedLightID !== null) {
                console.log("light is already selected");
                //deselect the current selection
                lightManager.deselectLight(lightManager._selectedLightID as string);
            }

            lightManager.selectLightByID(itemID);
        }

    }

    function toggleItemVisibility(e: React.MouseEvent) : void {
        e.stopPropagation();
        setItemVisibility(!isItemVisible);

        if(itemID.startsWith("sprite_image_") || itemID.startsWith("text_")) {
            assetManager.toggleVisibility(itemID);
        } else {
            //we have lights
            lightManager.toggleVisibility(itemID);
        }
        

    }

    //if a light Is NOT visible we should be be able to open its gui

    //need to move the camera back up or down


    //might hav to adjust this as it seems we are assuming its an image component
    function handleItemDeletion(e: React.MouseEvent): void {
        e.stopPropagation();  // Stop propagation first
        
        if (itemID.startsWith("sprite_image_") || itemID.startsWith("text_")) {

            if (assetManager._selectedComponentID === itemID) {
                assetManager.deselectComponent(itemID);
            }
            assetManager.removeComponent(itemID);
        } else {
            // Handle light deletion
            if (lightManager._selectedLightID === itemID) {
                lightManager.deselectLight(itemID);
            }
            lightManager.removeLight(itemID);
        }
        
        const newList = activeListItems.filter((item) => item.id !== itemID);
        setActiveListItems(newList);
    }

    return (
        <>
            <li onClick={handleListItemSelection} className="flex cursor-pointer flex-row w-[100%] h-[15%] bg-stone-600 items-center justify-between">
                <button onClick={toggleItemVisibility} className="bg-blue-200 ml-3 px-3 rounded-l">visible</button>
                <label onClick={handleListItemSelection} className="cursor-pointer" htmlFor="">{itemName}</label>
                <button onClick={handleItemDeletion} className="bg-red-500 mr-3 px-3 rounded-l">trash</button>
                
            </li>
        </>
    )

}