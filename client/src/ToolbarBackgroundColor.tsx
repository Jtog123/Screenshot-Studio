import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'

interface ToolbarBackgroundColorProps {
    scene : THREE.Scene;
}




export default function ToolbarBackgroundColor({scene}: ToolbarBackgroundColorProps) {

    
    const[backgroundColor, setBackgroundColor] = useState("#292524");

    //takes an implicit event
    function updateBackgroundColor(evt : React.ChangeEvent<HTMLInputElement>) : void {
        //value from the input
        let selectedColor = (evt.target as HTMLInputElement).value;

        //convert to number and set the background
        let selectedColorValue = selectedColor.replace("#", "0x");
        scene.background = new THREE.Color(Number(selectedColorValue));

        //update the state
        setBackgroundColor(selectedColor);
        //console.log(backgroundColor);

    }

    useEffect(() => {

        const _scene = scene;

        //set initial background color
        let initialColorString = backgroundColor;
        let initialColorValue = initialColorString.replace("#", "0x");
        _scene.background = new THREE.Color(Number(initialColorValue));
        

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

