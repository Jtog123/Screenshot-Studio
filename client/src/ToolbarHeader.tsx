import {useRef, useEffect, useState} from 'react'
import ToolbarHeaderArrow from './ToolbarHeaderArrow'
import OfficialLogo from './IconAssets/OfficialLogo'

interface ToolbarHeaderProps {
    isToolbarToggled : boolean
    setToolbarToggled: React.MouseEventHandler<HTMLButtonElement>
}

//bg-orange-tangy
export default function ToolbarHeader({isToolbarToggled, setToolbarToggled} : ToolbarHeaderProps) {
    return (
        <>
            <div className={isToolbarToggled ? `flex w-full items-center justify-center  h-[5%] bg-coffee/80 py-2` : `flex w-full items-center justify-between h-[5%] bg-coffee/80 px-3`}>
                <button onClick={setToolbarToggled} className="flex justify-center cursor-pointer items-center h-[30px] w-[40px] bg-espresso transition-colors duration-300 hover:bg-toffee rounded-xl group">
                    <ToolbarHeaderArrow className={`transition-transform duration-300 text-pink-cherry group-hover:text-espresso ${
                        isToolbarToggled ? 'rotate-180' : 'rotate-0'
                    }`}/> 
                </button>

                <h1 className={isToolbarToggled ? "hidden" : "h-[80%] w-[1/3]  text-cream-vanilla rounded-xl flex items-center justify-center"}>
                    <OfficialLogo className='h-11 w-11'/>
                </h1>
            </div>
        </>
    )
}


/*
    constructor() {
        this._containerRect = document.createElement("div");
        this._containerRect.className = "flex w-full items-center justify-between h-[5%] bg-red-600";

        this._toggleToolbarButton = document.createElement("button");
        this._toggleToolbarButton.id = "collapseToolbarButton";
        this._toggleToolbarButton.textContent = "->";
        this._toggleToolbarButton.className = "h-[80%] min-w-[40px] bg-emerald-300 rounded-xl ml-3 shrink-0";

        this._containerRect.appendChild(this._toggleToolbarButton);

        this._logo = document.createElement("h1");
        this._logo.id = "toolbarLogo";
        this._logo.textContent = "Logo Here";
        this._logo.className = `${this.logoBaseClasses}`;
        this._containerRect.appendChild(this._logo);

    }

*/