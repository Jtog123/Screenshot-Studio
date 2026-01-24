import {useRef, useEffect, useState} from 'react'



interface ToolbarPanelProps {
    isToolbarToggled : boolean
    activeTab : string
    handleTabChange : (buttonName: string) => void
}

export default function ToolBarPanelTab({isToolbarToggled, activeTab, handleTabChange} : ToolbarPanelProps) {
    const buttonNames = ["Lights", "Effects", "Text"];

    return (
        <>
        
        <div className={isToolbarToggled ? `hidden` :`w-full h-[5%] px-3 py-5 bg-stone-950 flex justify-around items-center`}>
            {
                buttonNames.map((buttonName, index) => (
                   
                    <button key={buttonName} className={`h-[90%] w-[30%] rounded py-3 flex items-center justify-center 
                        ${activeTab === buttonName ? "bg-yellow-600" : "bg-yellow-300"}` }   
                            onClick={() => handleTabChange(buttonName)}>
                            {buttonName}
                    </button>
                ))
            }


        </div>
        </>
    )
}