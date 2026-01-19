import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'

interface ToolbarBackgroundColorProps {
    scene : THREE.Scene;
}




export default function ToolbarBackgroundColor({scene}: ToolbarBackgroundColorProps) {

    
    const[backgroundColor, setBackgroundColor] = useState("#292524");
    //const[colorString, setColorString] = useState("")

    function updateBackgroundColor(evt : React.ChangeEvent<HTMLInputElement>) : void {
        //value from the input
        let selectedColor = (evt.target as HTMLInputElement).value;

        //convert to number and set the background
        let selectedColorValue = selectedColor.replace("#", "0x");
        scene.background = new THREE.Color(Number(selectedColorValue));

        //update the state
        setBackgroundColor(selectedColor);
        console.log(backgroundColor);

    }

    useEffect(() => {

        const _scene = scene;

        //set initial background color
        let initialColorString = backgroundColor;
        let initialColorValue = initialColorString.replace("#", "0x");
        _scene.background = new THREE.Color(Number(initialColorValue));
        


        /*        //set initial background color
        let initialColorString = this._backgroundColorPicker.value
        console.log(initialColorString)
        let initialColorValue = initialColorString;
        initialColorValue = initialColorValue.replace('#', "0x");
        this._scene.background = new THREE.Color(Number(initialColorValue));
        */






        //Set initial Color
        
        //_scene.background = Number(backgroundColor)

    },[])

    return (
        <>
        <div className="flex w-[100%] h-[5%] items-center justify-between py-5 bg-stone-950">
            <label className="text-md text-stone-200 ml-5">
                Background: 
            </label>

            <input type="color" className="w-[30%] mr-5 rounded-xl" value={backgroundColor} onChange={updateBackgroundColor} />

        </div>
        </>
    )

}

/*


this._backgroundColorPicker.value = "#292524";


import * as THREE from "three"

class BackgroundComponentRect {
    public _scene: THREE.Scene
    public _containerRect : HTMLElement;
    public _backgroundColorPicker : HTMLInputElement;


    constructor(scene : THREE.Scene) {

        this._scene = scene;

        this._containerRect = document.createElement("div");
        

        //div
        const backgroundColorContainer = document.createElement("div");
        backgroundColorContainer.id = "backgroundColorDiv";
        backgroundColorContainer.className = "flex w-[100%] h-[5%] items-center justify-between py-5 bg-stone-950";

        //label for background color
        const backgroundLabel = document.createElement("label");
        backgroundLabel.id = "backgroundLabel";
        backgroundLabel.textContent = "Background: ";
        backgroundLabel.className = "text-md text-stone-200 ml-5";
        
        //label for color picker
        backgroundColorContainer.appendChild(backgroundLabel);

        
        // add the color picker
        this._backgroundColorPicker = document.createElement("input");
        this._backgroundColorPicker.type = "color";
        this._backgroundColorPicker.id = "backgroundColorPicker";
        this._backgroundColorPicker.value = "#292524";
        this._backgroundColorPicker.className = "w-[30%] mr-5 rounded-xl";
        backgroundColorContainer.appendChild(this._backgroundColorPicker);

        this._containerRect.appendChild(backgroundColorContainer)


        //set initial background color
        let initialColorString = this._backgroundColorPicker.value
        console.log(initialColorString)
        let initialColorValue = initialColorString;
        initialColorValue = initialColorValue.replace('#', "0x");
        this._scene.background = new THREE.Color(Number(initialColorValue));

        this.listenforBackgroundColorChange()

    }


    
    public listenforBackgroundColorChange() {
        this._backgroundColorPicker.addEventListener("input" , (evt: Event) => {
            this.updateBackgroundColor(evt);
        });
    }
    
    /*
    public show() : void {
        this._containerRect.className = `${this.baseClasses}`;
            
    }
    
    public hide() : void {
        this._containerRect.className = `${this.baseClasses} hidden`;
    }
        
        
        
    public updateBackgroundColor(event: Event) : void {
            const selectedColor = event.target as HTMLInputElement;
            let colorString = selectedColor.value.replace("#", "0x");
            
            const colorValue = Number(colorString);
            this._scene.background = new THREE.Color().setHex(colorValue);
    }

    public getComponent() : HTMLElement {
        return this._containerRect;
    }
}

export {BackgroundComponentRect}
*/