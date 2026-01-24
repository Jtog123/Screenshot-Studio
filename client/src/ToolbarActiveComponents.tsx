import ActiveListItem from "./ActiveListItem"
import { JSX } from "react"

interface ToolbarLightCatalogProps {
    activeListItems: {id:number, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: number; name: string; }[]>>
    isToolbarToggled : boolean
}



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


export default function ToolbarActiveComponents({activeListItems, setActiveListItems ,isToolbarToggled} : ToolbarLightCatalogProps) {
    return (
        <>
            <div className={ isToolbarToggled ? `hidden` : `flex h-[32.5%] w-[screen] bg-stone-500 items-center justify-center`}>

                <div className="flex h-[90%] w-[90%] bg-red-200 overflow-auto">
                    <ul className="w-[100%]">
                        {
                            activeListItems.map((item) => (
                                <ActiveListItem key={item.id} itemName={item.name} />
                            ))
                        }
    

                    </ul>

                </div>
                
            </div>
        </>
    )
}