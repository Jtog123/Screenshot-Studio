import {useRef, useEffect, useState} from 'react'
export default function ToolbarHeader() {
    return (
        <>
            <div className= "flex w-full items-center justify-between h-[5%] bg-red-600">
                <button className= "h-[80%] min-w-[40px] bg-emerald-300 rounded-xl ml-3 shrink-0">
                    collapse
                </button>

                <h1 className= "h-[80%] w-[1/3] bg-emerald-300 rounded-xl mr-3">
                    Logo here
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