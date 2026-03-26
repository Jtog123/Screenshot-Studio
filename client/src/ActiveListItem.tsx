import { useState } from "react";
import { LightManager } from "./LightManager"
import { AssetManager } from "./AssetManager";
import * as THREE from 'three'
import SpotLightIcon from "./IconAssets/SpotLightIcon";
import DirectionalLightIcon from "./IconAssets/DirectionalLightIcon";
import TextIcon from "./IconAssets/TextIcon";
import ImageIcon from "./IconAssets/ImageIcon";
import EyeOpenIcon from "./IconAssets/EyeOpenIcon";
import EyeClosedIcon from "./IconAssets/EyeClosedIcon";
import EyeMidIcon from "./IconAssets/EyeMidIcon";
import PointLightIcon from "./IconAssets/PointLightIcon";
import RectAreaIcon from "./IconAssets/RectAreaIcon";

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
        console.log(itemID);
        if (itemID.startsWith("_DirectionalLight")) {
            return <DirectionalLightIcon className=" w-[24px] h-[24px] text-pink-cherry"/>
        } else if (itemID.startsWith("_SpotLight")) {
            return <SpotLightIcon className=" w-[24px] h-[24px] text-pink-cherry"/>
        } else if (itemID.startsWith("_PointLight")) {
            return <PointLightIcon className=" w-[24px] h-[24px] text-pink-cherry" />
        } else if (itemID.startsWith("_RectAreaLight")) {
            return <RectAreaIcon className=" w-[24px] h-[24px] text-pink-cherry" />
        } else if(itemID.startsWith("sprite_image_")) {
            return <ImageIcon className="w-[20px] h-[20px] text-pink-cherry"/>;
        } else if(itemID.startsWith("text_")) {
            return <TextIcon className="w-[20px] h-[20px] text-pink-cherry"/>;
        } 
        
        
    };

    return (
        <li 
            onClick={handleListItemSelection} 
            className="group/item flex items-center justify-between px-2 py-1.5 rounded-md bg-blue-powder/50 hover:bg-white/30 transition-colors ease-in duration-200 cursor-pointer border-x-1 border-pink-cherry/80 "
        >
            {/* Left side: Icon + Name */}
            <div className="flex items-center gap-2 flex-1 min-w-0 ">
                <div className=" flex justify-center items-center px-1  w-[20%]">
                    <span className="text-sm flex-shrink-0">{getIcon()}</span>
                </div>

                <span className="text-espresso/80 text-sm truncate ">{itemName}</span>
            </div>

            {/* Right side: Actions (show on hover) */}
            <div className="flex items-center gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                {/* Visibility toggle */}
                <button 
                    onClick={toggleItemVisibility}
                    className={`group/eye p-1 rounded hover:bg-espresso/20 transition-colors group ${
                        isItemVisible ? 'text-stone-300' : 'text-stone-600'
                    }`}
                    
                >
                        {isItemVisible ? 
                            // Eye icon
                            <>
                            <EyeOpenIcon className="text-pink-cherry w-[20px] h-[20px] group-hover/eye:hidden  "/>
                            <EyeMidIcon className="text-pink-cherry w-[20px] h-[20px] hidden hidden group-hover/eye:block" />
                            </>
                         : 
                            // Eye-off icon
                            <EyeClosedIcon className="text-pink-cherry w-[20px] h-[20px]  "/>
                        }
                    
                </button>

                {/* Delete button */}
                <button 
                    onClick={handleItemDeletion}
                    className="p-1 rounded hover:bg-red-600/20 text-velvet-rouge hover:text-red-400 transition-colors"
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