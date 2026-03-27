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
            <div className={ isToolbarToggled ? `hidden` : `flex flex-col h-[325px]  flex-shrink-0 w-[screen] bg-chocolate justify-center items-center `}>
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-pink-cherry/80">
                    <h2 className="text-cream-vanilla text-sm font-medium tracking-wide" style={{ fontFamily: 'lato' }}>Scene Collection</h2>
                    <span className="text-cream-vanilla/50 text-xs ml-3" style={{ fontFamily: 'lato' }}>{activeListItems.length} items</span>
                </div>
                
            <div className="flex-1 w-[80%]  bg-chocolate overflow-y-auto overflow-x-hidden px-3 py-2 scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-stone-900 ">
                {activeListItems.length === 0 ? (
                    <div className="flex items-center justify-center h-full ">
                        <p className="text-cream-vanilla/50 text-sm" style={{ fontFamily: 'lato' }}>No items in scene</p>
                    </div>
                ) : (
                    <ul className="space-y-1">
                        {activeListItems.map((item) => (
                            <ActiveListItem 
                                key={item.id} 
                                itemID={item.id} 
                                itemName={item.name} 
                                activeListItems={activeListItems} 
                                setActiveListItems={setActiveListItems} 
                                lightManager={lightManager} 
                                assetManager={assetManager}  
                            />
                        ))}
                    </ul>
                )}
            </div>


                
            </div>
        </>
    )
}