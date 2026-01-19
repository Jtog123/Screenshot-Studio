import {useRef, useEffect, useState} from 'react'

const buttonNames = ["Lights", "Effects", "Text"];

export default function ToolBarPanelTab() {

    const[activeTab, setActiveTab] = useState("Lights");

    function handleTabChange(buttonName : string) : void {
        setActiveTab(buttonName);
        console.log("click button" , buttonName);
    }

    return (
        <>
        
        <div className="w-full h-[5%] py-5 bg-stone-950 flex justify-around items-center">
            {
                buttonNames.map((buttonName, index) => (
                   
                    <button key={index} className={`h-[90%] w-[30%] rounded py-3 flex items-center justify-center 
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