import {useRef, useEffect, useState} from 'react'

import * as THREE from 'three'
import { GradientBackground } from './GradientBackground';

interface ToolbarBackgroundColorProps {
    scene : THREE.Scene;
    isToolbarToggled : boolean
    gradientBackground : GradientBackground
}




export default function ToolbarBackgroundColor({scene, isToolbarToggled, gradientBackground}: ToolbarBackgroundColorProps) {

    
    const[backgroundColor, setBackgroundColor] = useState("#292524");
    const[isBackgroundSolid, setIsBackgroundSolid] = useState(true);
    const[isLeftToRightGradient , setIsLeftToRightGradient] = useState(true);

    //??
    const[color1 , setColor1] = useState("#FF0000");
    const[color2 , setColor2] = useState("#0000FF");

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

    function handleColor1Change(e : React.ChangeEvent<HTMLInputElement>) : void {
        const newColor = e.target.value;
        setColor1(newColor);
        gradientBackground.updateGradientColors(newColor,color2);
    }

    function handleColor2Change(e : React.ChangeEvent<HTMLInputElement>) : void {
        const newColor = e.target.value;
        setColor2(newColor);
        gradientBackground.updateGradientColors(color1,newColor);
    }

    useEffect(() => {
        const _scene = scene;

        //set initial background color
        if(isBackgroundSolid) {
            let initialColorString = backgroundColor;
            let initialColorValue = initialColorString.replace("#", "0x");
            _scene.background = new THREE.Color(Number(initialColorValue));
        }
        //let initialColorString = backgroundColor;
        //let initialColorValue = initialColorString.replace("#", "0x");
        //_scene.background = new THREE.Color(Number(initialColorValue));
        

    },[]);

    function handleGradientBackground(){
        console.log("gradient");
        if(isBackgroundSolid) {
            scene.background = null;
            gradientBackground.turnLeftRightGradientOn();
            setIsBackgroundSolid(false);

            
            
        }

    }

    function handleSolidBackground() : void {
        if(!isBackgroundSolid) {
            console.log("solid");
            gradientBackground.turnGradientBackgroundOff();
            let colorValue = backgroundColor.replace("#", "0x");
            scene.background = new THREE.Color(Number(colorValue));
            setIsBackgroundSolid(true);

        }
    }



    //pass in current colrs? pass in color1 and color2 as props? to gradientcolorselector
    // pass in setter functions to gradient background selector as props
    function handleGradientDirectionChange() : void {
        if(isLeftToRightGradient) {
            setIsLeftToRightGradient(false);
            gradientBackground.switchGradientDirection(isLeftToRightGradient);
        } else {
            setIsLeftToRightGradient(true);
            gradientBackground.switchGradientDirection(isLeftToRightGradient);
            
        }


    }



    {/* if the background is not solid, then we want to enable the buttons as visible */}

    return (
        <>
        <div className={isToolbarToggled ? `hidden` : `flex w-[100%] h-[5%] items-center justify-between py-5 bg-stone-950`}>
            <label className="text-md text-stone-200 ml-5">
                Background: 
            </label>

            <div className='flex justify-center items-center w-[100%] bg-red-200'>
                {/* conitionally render the inputs bansed on what background is selected */}
                { isBackgroundSolid? 
                    <input type="color" className=" w-[40%] mr-5 rounded-xl" value={backgroundColor} onChange={updateBackgroundColor} /> 
                    : 
                    (
                        <div className="flex">
                            <input type="color" name="" id="" value={color1} onChange={handleColor1Change}/>
                            <label htmlFor=""> to</label>
                            <input type="color" name="" id="" value={color2} onChange={handleColor2Change}/>
                        </div>
                    )

                    
                }

                <div className='flex justify-around w-[50%] bg-blue-200'>
                    <button className='bg-yellow-500 text-sm cursor-pointer' onClick={handleSolidBackground}> sol </button>
                    <button className='bg-yellow-500 text-sm cursor-pointer' onClick={handleGradientBackground}> grad </button>
                </div>

                
                {!isBackgroundSolid && (
                    <button className='cursor-pointer' onClick={handleGradientDirectionChange}>
                        {isLeftToRightGradient ? "UD" : "LR"}
                    </button>
                    
                )}
               

            </div>
        




        </div>
        </>
    )

}

