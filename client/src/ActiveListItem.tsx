import { useState } from "react";
import { LightManager } from "./LightManager"

interface ActiveListItemProps {
    itemName : string
    itemID : string // lightID for now
    activeListItems : {id:string, name:string}[]
    setActiveListItems : React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    lightManager : LightManager
}

/*
Key distinction we are toggling threejs meshes, not DOM components
these visibility function are in the lightmanager class

on toggling visiblity



*/

export default function ActiveListItem({itemName, itemID, activeListItems,setActiveListItems, lightManager}:ActiveListItemProps) {

    const[isItemVisible, setItemVisibility] = useState(true);

    function toggleItemVisibility() : void {
        setItemVisibility(!isItemVisible);
        //hjave the lightmanager hide it
        lightManager.toggleVisibility(itemID);

    }

    function handleItemDeletion() : void {
        //remove it from the light manager
        lightManager.removeLight(itemID);

        //update teh state
        const newList = activeListItems.filter((item) => item.id !== itemID);
        setActiveListItems(newList);

    }

    return (
        <>
            <li className="flex flex-row w-[100%] h-[15%] bg-stone-600 items-center justify-between">
                <button onClick={toggleItemVisibility} className="bg-blue-200 ml-3 px-3 rounded-l">visible</button>
                <label htmlFor="">{itemName}</label>
                <button onClick={handleItemDeletion} className="bg-red-500 mr-3 px-3 rounded-l">trash</button>
                
            </li>
        </>
    )

}