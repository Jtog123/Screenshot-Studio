import * as THREE from 'three'
import { GradientBackground } from './GradientBackground';
import { LightManager } from "./LightManager";
import ActiveListItem from './ActiveListItem';
import { LightType } from './Light';
import { useEffect, useState } from 'react';
import { _DirectionalLightHelper, _SpotLightHelper, _PointLightHelper, _RectAreaLightHelper } from './LightHelper';

interface ToolbarBgAndLightingCardProps{
    scene : THREE.Scene;
    isToolbarToggled : boolean
    gradientBackground : GradientBackground
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    lightManager : LightManager
}

export default function ToolbarBgAndLightingCard({scene, isToolbarToggled, gradientBackground, activeListItems, setActiveListItems, lightManager} : ToolbarBgAndLightingCardProps) {

    const[isBgAndLightCardExpanded, setIsBgAndLightCardExpanded] = useState(true);
    const[backgroundColor, setBackgroundColor] = useState("#292524");
    const[isBackgroundSolid, setIsBackgroundSolid] = useState(true);
    const[isLeftToRightGradient , setIsLeftToRightGradient] = useState(true);

    //??
    const[color1 , setColor1] = useState("#FF0000");
    const[color2 , setColor2] = useState("#0000FF");

    function handleBgAndLightCardExpand() : void {
        setIsBgAndLightCardExpanded(!isBgAndLightCardExpanded);
    }


    
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
            if(isLeftToRightGradient) {
                gradientBackground.turnLeftRightGradientOn(color1, color2);
            } else {
                gradientBackground.turnUpDownGradientOn(color1, color2);
            }

            setIsBackgroundSolid(false);

            
        }

    }

    function handleSolidBackground() : void {
        if(!isBackgroundSolid) {
            console.log("solid");
            //restore the solid background
            gradientBackground.turnGradientBackgroundOff();
            let colorValue = backgroundColor.replace("#", "0x");
            scene.background = new THREE.Color(Number(colorValue));
            setIsBackgroundSolid(true);

        }
    }



    //pass in current colrs? pass in color1 and color2 as props? to gradientcolorselector
    // pass in setter functions to gradient background selector as props
    function handleGradientDirectionChange() : void {
        const newDirection = !isLeftToRightGradient;
        setIsLeftToRightGradient(newDirection);
        gradientBackground.switchGradientDirection(newDirection);
        
    }

    return(
        <div className="w-[100%] bg-stone-950 flex-shrink-0 pb-2 ">
            {/* Header - always visible */}
            <div className="flex justify-between items-center py-2">
                <h1 className="text-stone-300 ml-5">Background & Lighting</h1>
                <button onClick={handleBgAndLightCardExpand} className="mr-5 text-stone-300">
                    {isBgAndLightCardExpanded ? '^' : 'v'}
                </button>
            </div>

            {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out ${
                isBgAndLightCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    {/* Background Section */}
                    <h1 className="text-stone-300 ml-5 mt-1 text-sm">Background</h1>
                    <div className="flex justify-between bg-stone-950 py-2">
                        <select className="w-[35%] ml-5 h-[30px] px-1 bg-stone-300 text-stone-900 text-sm rounded-md">
                            <option value="solid">solid</option>
                            <option value="gradient">gradient</option>
                        </select>
                        <input type="color" className="w-[25%] h-[30px] mr-5" />
                    </div>

                    {/* Gradient Settings */}
                    <h1 className="text-stone-200 ml-5 mt-1 text-sm">Gradient Settings</h1>
                    <div className="flex w-[50%] ml-2 justify-around mt-1">
                        <button className="cursor-pointer w-[35%] mx-1 bg-green-300 rounded-lg py-1">LR</button>
                        <button className="cursor-pointer w-[35%] mx-1 bg-red-500 rounded-lg py-1">UD</button>
                    </div>

                    <div className="flex flex-col ml-5 text-sm mt-1">
                        <label className="text-stone-200" htmlFor="">Scale</label>
                        <input className="w-[75%]" type="range" />
                    </div>

                    {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[90%] h-px bg-stone-300/40 my-3"></div>
                    </div>

                    {/* Lighting */}
                    <h1 className="text-stone-200 ml-5 my-1 text-sm">Lighting</h1>
                    <div className="flex w-[100%] ml-5 mb-5">
                        <div className="flex justify-between w-[90%]">
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Dir</button>
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Spot</button>
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Point</button>
                            <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg py-1">Rect</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}