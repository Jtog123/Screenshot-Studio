import * as THREE from 'three'
import { GradientBackground } from './GradientBackground';
import { LightManager } from "./LightManager";
import DirectionalLightIcon from './IconAssets/DirectionalLightIcon';
import SpotLightIcon from './IconAssets/SpotLightIcon';
import ActiveListItem from './ActiveListItem';
import { LightType } from './Light';
import { useEffect, useState, useRef } from 'react';

import { _DirectionalLightHelper, _SpotLightHelper, _PointLightHelper, _RectAreaLightHelper } from './LightHelper';
import PointLightIcon from './IconAssets/PointLightIcon';
import RectAreaIcon from './IconAssets/RectAreaIcon';
import LeftRightGradIcon from './IconAssets/LeftRightGradientIcon';
import UpDownGradIcon from './IconAssets/UpDownGradientIcon';
import MenuKarrotIcon from './IconAssets/MenuKarrotIcon';

interface ToolbarBgAndLightingCardProps{
    scene : THREE.Scene;
    isToolbarToggled : boolean
    gradientBackground : GradientBackground
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    lightManager : LightManager
}

/*
Use a binary selected gradient logic if gradient is toggled by the input on
LR gradient is selected and the button highlighted but the button is disabled so we cant click it again, when we click up 
down gradient we elect that button and highlight it but diabled the buttons functionality
*/

export default function ToolbarBgAndLightingCard({scene, isToolbarToggled, gradientBackground, activeListItems, setActiveListItems, lightManager} : ToolbarBgAndLightingCardProps) {

    const[isBgAndLightCardExpanded, setIsBgAndLightCardExpanded] = useState(true);
    const[backgroundColor, setBackgroundColor] = useState("#2D0610");
    const[isBackgroundSolid, setIsBackgroundSolid] = useState(true);
    const[isLeftToRightGradient , setIsLeftToRightGradient] = useState(true);
    const[selectedBackgroundValue, setSelectedBackgroundValue] = useState("solid");

    //??
    const[color1 , setColor1] = useState("#D946EF");
    const[color2 , setColor2] = useState("#000000");
    const[gradientScale, setGradientScale] = useState(2.5);

    //useRef array of THREE.Vec3 positions
    const lightPositionRefArray = useRef<THREE.Vector3[]>([]);


    function handleBgAndLightCardExpand() : void {
        setIsBgAndLightCardExpanded(!isBgAndLightCardExpanded);
    }

    // have an array of positions, or a map?
    // upon creating a light check if the array is empty 
    // if empty just store the first position
    // if not empty check which position is in the array
    // dont assign the already assigned position



    
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



    function handleBackgroundChange() : void {
        //if background is solid swtich to gradient
        if(isBackgroundSolid) {
            scene.background = null;
            if(isLeftToRightGradient) {
                gradientBackground.turnLeftRightGradientOn(color1, color2);
            } else {
                gradientBackground.turnUpDownGradientOn(color1, color2);
            }

            setIsBackgroundSolid(false);
            setSelectedBackgroundValue("gradient");
            
        } else {
            //restore the solid background
            gradientBackground.turnGradientBackgroundOff();
            let colorValue = backgroundColor.replace("#", "0x");
            scene.background = new THREE.Color(Number(colorValue));
            setIsBackgroundSolid(true);
            setSelectedBackgroundValue("solid")
        }
    }






    //pass in current colrs? pass in color1 and color2 as props? to gradientcolorselector
    // pass in setter functions to gradient background selector as props
    function handleGradientDirectionChange() : void {
        const newDirection = !isLeftToRightGradient;
        setIsLeftToRightGradient(newDirection);
        gradientBackground.switchGradientDirection(newDirection);
        
    }



    function generateLightPosition() : THREE.Vector3 | void {

        //Max amount of lights reached
        if(lightPositionRefArray.current.length >= 15) return;

        const MIN = -2;
        const MAX = 2;
        const MIN_DISTANCE = 0.5; // Minimum distance between lights
        const MAX_ATTEMPTS = 50; // Prevent infinite loops
        
        let attempts = 0;
        let newPosition: THREE.Vector3;
        let isValidPosition = false;
        
        while (!isValidPosition && attempts < MAX_ATTEMPTS) {
            // Generate random position within bounds
            newPosition = new THREE.Vector3(
                Math.random() * (MAX - MIN) + MIN,
                Math.random() * (MAX - MIN) + MIN,
                1
            );
            
            // Check if position is far enough from all existing lights
            isValidPosition = true;
            for (let i = 0; i < lightPositionRefArray.current.length; i++) {
                const existingPos = lightPositionRefArray.current[i];
                const distance = newPosition.distanceTo(existingPos);
                
                if (distance < MIN_DISTANCE) {
                    isValidPosition = false;
                    break;
                }
            }
            
            attempts++;
        }
        
        // If we couldn't find a valid position after MAX_ATTEMPTS, just use the last generated one
        if (!isValidPosition) {
            console.warn('Could not find non-overlapping position, using closest available');
        }
        
        lightPositionRefArray.current.push(newPosition!);
        return newPosition!;
    }

    function handleGradientScaleChange(e : React.ChangeEvent<HTMLInputElement>) : void {
        console.log(e.target.value);
        const scaleValue = Number(e.target.value)
        gradientBackground.updateGradientScale(scaleValue);
        setGradientScale(scaleValue);
    }

    ///////////////////////// LIGHT CREATION ////////////////////////////////

    function handleDirectionalLightCreation() : void {
        //console.log("creating directional light");
        const lightPos = generateLightPosition() as THREE.Vector3;


        //const newLight = lightManager.createLight(LightType.DirectionalLight, new THREE.Vector3(-2,1.75,1));
        const newLight = lightManager.createLight(LightType.DirectionalLight, lightPos);

        //read in information to create list items
        const listItemName = (newLight._lightHelper as _DirectionalLightHelper)._title;
        const listItemID = (newLight._lightHelper as _DirectionalLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);

        //setActiveListItems([...activeListItems, <ActiveListItem key={listItemID} itemName={listItemName}/> ])
        //setAc
    }

    function handleSpotLightCreation() : void {

        const lightPos = generateLightPosition() as THREE.Vector3;
        const newLight = lightManager.createLight(LightType.SpotLight, lightPos);

        const listItemName = (newLight._lightHelper as _SpotLightHelper)._title;
        const listItemID = (newLight._lightHelper as _SpotLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);
        //Gui Creation happens here

    }

    function handlePointLightCreation() : void {
        const lightPos = generateLightPosition() as THREE.Vector3;
        const newLight = lightManager.createLight(LightType.PointLight, lightPos);

        const listItemName = (newLight._lightHelper as _PointLightHelper)._title;
        const listItemID = (newLight._lightHelper as _PointLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);
    }

    function handleRectAreaLightCreation() : void {
        const lightPos = generateLightPosition() as THREE.Vector3;
        const newLight = lightManager.createLight(LightType.RectAreaLight,lightPos);

        const listItemName = (newLight._lightHelper as _RectAreaLightHelper)._title;
        const listItemID = (newLight._lightHelper as _RectAreaLightHelper).name;

        setActiveListItems([...activeListItems, {id:listItemID, name:listItemName}]);
    }    

    return(
        <div  className={ isToolbarToggled ? `hidden` : `w-[100%] bg-velvet-darkest flex-shrink-0 pb-2`}>
            {/* Header - always visible */}
            <div onClick={handleBgAndLightCardExpand}  className="flex justify-between items-center py-2 cursor-pointer">
                <h1 className="text-cream-dark ml-5 text-sm" style={{ fontFamily: 'lato' }}>Background & Lighting</h1>
                <button onClick={handleBgAndLightCardExpand} className="mr-5 text-cream">
                    <MenuKarrotIcon className={`text-cream w-[20px] h-[20px] cursor-pointer transition-all ease-in duration-300 ${isBgAndLightCardExpanded ? `` : `rotate-180`}`} />
                </button>
            </div>

            {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out ${
                isBgAndLightCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    {/* Background Section */}
                    <h1 className="text-cream-dark ml-5 mt-1 text-xs" style={{ fontFamily: 'lato' }}>Style</h1>
                    <div className="flex justify-between bg-velvet-darkest py-2">
                        <select value={selectedBackgroundValue} onChange={handleBackgroundChange} className="w-[35%] ml-5 h-[30px] px-1 bg-velvet-accent text-cream text-sm rounded-md">
                            <option value="solid" >solid</option>
                            <option value="gradient">gradient</option>
                        </select>

                        {isBackgroundSolid ? 
                            <input type="color" className="w-[60px] h-[30px] mr-5  rounded-lg"  value={backgroundColor} onChange={updateBackgroundColor}/> :
                            (
                            <div className="flex w-[40%]  mr-5">
                                <input className='w-[50%] h-[30px]'  type="color" name="" id="" value={color1} onChange={handleColor1Change}/>
                                <label className='text-cream/40 mx-2' htmlFor=""> | </label>
                                <input className='w-[50%] h-[30px]' type="color" name="" id="" value={color2} onChange={handleColor2Change}/>
                            </div>
                            )
                        }
                        
                    </div>

                    {/* Gradient Settings */}
                    <h1 className="text-cream-dark ml-5 mt-1 text-xs" style={{ fontFamily: 'lato' }}>Gradient Settings</h1>
                    <div className="flex w-[50%] ml-2 justify-around mt-1">
                        <button 
                            onClick={handleGradientDirectionChange} 
                            className={`flex justify-center items-center w-[50px] h-[35px] mx-1 rounded-lg py-1 transition-all duration-200
                                ${!isBackgroundSolid && isLeftToRightGradient 
                                    ? 'bg-stone-500 pointer-events-none' 
                                    : 'bg-stone-700 hover:bg-stone-600 cursor-pointer'
                                }
                                ${isBackgroundSolid ? 'opacity-50 pointer-events-none' : ''}
                            `}
                        >
                            <LeftRightGradIcon 
                                className={!isBackgroundSolid && isLeftToRightGradient ? 'text-[#D946EF]' : 'text-cream-dark'} 
                            />
                        </button>

                        <button 
                            onClick={handleGradientDirectionChange} 
                            className={`flex justify-center items-center w-[50px] h-[35px] mx-1 rounded-lg py-1 transition-all duration-200
                                ${!isBackgroundSolid && !isLeftToRightGradient 
                                    ? 'bg-stone-500 pointer-events-none' 
                                    : 'bg-stone-700 hover:bg-stone-600 cursor-pointer'
                                }
                                ${isBackgroundSolid ? 'opacity-50 pointer-events-none' : ''}
                            `}
                        >
                            <UpDownGradIcon 
                                className={!isBackgroundSolid && !isLeftToRightGradient ? 'text-[#D946EF]' : 'text-stone-300'} 
                            />
                        </button>
                    </div>

                    <div className="flex flex-col ml-5 text-sm mt-1">
                        <label className={ isBackgroundSolid ? `text-cream-dark/40 mt-1 text-xs` : `text-cream-dark mt-1 text-xs`}  style={{ fontFamily: 'lato' }} htmlFor="">Scale</label>
                        <input onChange={handleGradientScaleChange} disabled={isBackgroundSolid} value={gradientScale} max={"5"} min={"1"} step={"0.1"} className={isBackgroundSolid ? `w-[75%] h-1 my-1 accent-[#4A0A1C] opacity-40` : ` w-[75%] h-1 my-1 accent-[#C14A5C] `} type="range" />
                    </div>

                    {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[90%] h-px bg-cream/40 my-3"></div>
                    </div>

                    {/* Lighting */}
                    <div className='flex w-[100%] justify-center'>
                        <div className='flex  w-[90%] justify-center '>
                            <h1 className="text-cream-dark  my-1 text-sm"  style={{ fontFamily: 'lato' }}>Lighting</h1>
                        </div>
                    </div>

                   
                    <div className="flex w-[100%] justify-center mt-2 mb-5">
                        <div className="flex justify-between w-[80%] h-auto">
                            <button onClick={handleDirectionalLightCreation} className=" flex cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-velvet-accent hover:bg-velvet text-cream-dark hover:text-cream-light transition-colors duration-200 rounded-lg py-1 justify-center  items-center ">
                                <DirectionalLightIcon className='w-[48px] h-[48px]  '/>
                            </button>

                            <button onClick={handleSpotLightCreation} className=" flex justify-center items-center cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-stone-700 hover:bg-stone-500 hover:bg-stone-500 text-stone-300 hover:text-[#D946EF] transition-colors duration-200 rounded-lg py-1">
                                <SpotLightIcon className='w-[32px] h-[32px]  ' />
                            </button>

                            <button onClick={handlePointLightCreation} className=" flex justify-center items-center cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-stone-700 hover:bg-stone-500 hover:bg-stone-500 text-stone-300 hover:text-[#D946EF] transition-colors duration-200 rounded-lg py-1">
                                <PointLightIcon className='w-[32px] h-[32px] transition-all duration-200 ease-in  '/>
                            </button>
                            <button onClick={handleRectAreaLightCreation} className=" flex justify-center items-center cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-stone-700 hover:bg-stone-500 hover:bg-stone-500 text-stone-300 hover:text-[#D946EF] transition-colors duration-200 rounded-lg py-1">
                                <RectAreaIcon className="w-[40px] h-[40px]"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}