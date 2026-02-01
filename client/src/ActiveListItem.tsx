import { useState } from "react";
import { LightManager } from "./LightManager"
import { AssetManager } from "./AssetManager";

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
    const[clickedItem, setClickedItem] = useState(null);



    //NOT WORKING YET, WANt to select an item by clcking on the listItem
    function handleListItemSelection() : void {
        //how do we check?
        console.log("id:" ,itemID);

        if(itemID.startsWith("above_") || itemID.startsWith("below_")) {
            console.log("now selecting component");
            //we have an _directional light call lightManager
            if(assetManager._selectedComponentID !== null) {
                assetManager.deselectComponent(assetManager._selectedComponentID);
            }
            assetManager.selectComponentByID(itemID);

        } else {
            if(lightManager._selectedLightID !== null) {
                console.log("light is already selected");
                //deselect the current selection
                lightManager.deselectLight(lightManager._selectedLightID as string);
                //lightManager.selectLightByID(itemID);
            }
            lightManager.selectLightByID(itemID);
        }




        //console.log(itemID);
        //const item = lightManager.selectLightByID(itemID);
    }

    function toggleItemVisibility(e: React.MouseEvent) : void {
        e.stopPropagation();
        setItemVisibility(!isItemVisible);
        //hjave the lightmanager hide it
        lightManager.toggleVisibility(itemID);

    }

    function handleItemDeletion(e: React.MouseEvent) : void {
        if(lightManager._selectedLightID !== null) {
            lightManager.deselectLight(lightManager._selectedLightID);
        }
        e.stopPropagation();
        //remove it from the light manager
        lightManager.removeLight(itemID);
        //update teh state
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