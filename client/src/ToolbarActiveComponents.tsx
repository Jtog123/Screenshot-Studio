import ActiveListItem from "./ActiveListItem"
import { AssetManager } from "./AssetManager";
import { LightManager } from "./LightManager";
import * as THREE from 'three'
import { JSX } from "react"
import { useEffect, useState } from 'react';




/*
Every time we create an item in the scene we will create a list item for it
and append it into a container that sores all our active scene items
we will then render it out here
*/

/*
on trashing an item we need to find the key of that item id
its key is its generatedid

on 

*/

interface ToolbarLightCatalogProps {
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    isToolbarToggled : boolean
    lightManager : LightManager
    assetManager : AssetManager

}



export default function ToolbarActiveComponents({activeListItems, setActiveListItems, isToolbarToggled, lightManager, assetManager} : ToolbarLightCatalogProps) {




    return (
        <>
            <div className={ isToolbarToggled ? `hidden` : `flex h-[325px] flex-shrink-0 w-[screen] bg-stone-500 items-center justify-center`}>

                <div className="flex h-[90%] w-[90%] bg-red-200 overflow-auto">
                    <ul className="w-[100%]">
                        {
                            activeListItems.map((item) => (
                                <ActiveListItem key={item.id} itemID={item.id} itemName={item.name} activeListItems={activeListItems} setActiveListItems={setActiveListItems} lightManager={lightManager} assetManager={assetManager}  />
                                
                            ))
                        }
    

                    </ul>

                </div>
                
            </div>
        </>
    )
}