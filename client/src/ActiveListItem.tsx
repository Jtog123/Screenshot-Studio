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

    // Get icon based on item type
    const getIcon = () => {
        if(itemID.startsWith("sprite_image_")) return "🖼️";
        if(itemID.startsWith("text_")) return "T";
        return "💡"; // Light icon
    };

    return (
        <li 
            onClick={handleListItemSelection} 
            className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-stone-700/50 transition-colors cursor-pointer border-x-1 border-stone-400 hover:border-stone-600/50"
        >
            {/* Left side: Icon + Name */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm flex-shrink-0">{getIcon()}</span>
                <span className="text-stone-200 text-sm truncate">{itemName}</span>
            </div>

            {/* Right side: Actions (show on hover) */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Visibility toggle */}
                <button 
                    onClick={toggleItemVisibility}
                    className={`p-1 rounded hover:bg-stone-600 transition-colors ${
                        isItemVisible ? 'text-stone-300' : 'text-stone-600'
                    }`}
                    title={isItemVisible ? "Hide" : "Show"}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isItemVisible ? (
                            // Eye icon
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        ) : (
                            // Eye-off icon
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                        )}
                    </svg>
                </button>

                {/* Delete button */}
                <button 
                    onClick={handleItemDeletion}
                    className="p-1 rounded hover:bg-red-600/20 text-stone-400 hover:text-red-400 transition-colors"
                    title="Delete"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </li>
    )

}