import {useRef, useEffect, useState} from 'react'
import GradientBackgroundSelector from './GradientBackgroundSelector';
import * as THREE from 'three'

interface ToolbarBackgroundColorProps {
    scene : THREE.Scene;
    isToolbarToggled : boolean
}




export default function ToolbarBackgroundColor({scene, isToolbarToggled}: ToolbarBackgroundColorProps) {

    
    const[backgroundColor, setBackgroundColor] = useState("#292524");
    const[isSolidBackground, setIsSolidBackground] = useState(true);

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
        

    },[]);


    function handleSolidBackground() : void {
        console.log("solid");
         setIsSolidBackground(true);

    }

    function handleGradientBackground() : void {
        console.log("gradient");
        setIsSolidBackground(false);
    }

    return (
        <>
        <div className={isToolbarToggled ? `hidden` : `flex w-[100%] h-[5%] items-center justify-between py-5 bg-stone-950`}>
            <label className="text-md text-stone-200 ml-5">
                Background: 
            </label>

            <div className='flex justify-center items-center w-[100%] bg-red-200'>
                {/* conitionally render the inputs bansed on what background is selected */}
                { isSolidBackground ? 
                    <input type="color" className=" w-[40%] mr-5 rounded-xl" value={backgroundColor} onChange={updateBackgroundColor} /> 
                    : 
                    <GradientBackgroundSelector/>
                    
                }


                <div className='flex justify-around w-[50%] bg-blue-200'>
                    <button className='bg-yellow-500 text-sm cursor-pointer' onClick={handleSolidBackground}> sol </button>
                    <button className='bg-yellow-500 text-sm cursor-pointer' onClick={handleGradientBackground}> grad </button>
                </div>

            </div>
        




        </div>
        </>
    )

}

