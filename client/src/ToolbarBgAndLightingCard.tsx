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
import { Grid } from './Grid';

interface ToolbarBgAndLightingCardProps{
    scene : THREE.Scene;
    isToolbarToggled : boolean
    gradientBackground : GradientBackground
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    lightManager : LightManager
    grid: Grid
}

/*
Use a binary selected gradient logic if gradient is toggled by the input on
LR gradient is selected and the button highlighted but the button is disabled so we cant click it again, when we click up 
down gradient we elect that button and highlight it but diabled the buttons functionality
*/

export default function ToolbarBgAndLightingCard({scene, isToolbarToggled, gradientBackground, activeListItems, setActiveListItems, lightManager, grid} : ToolbarBgAndLightingCardProps) {

    const[isBgAndLightCardExpanded, setIsBgAndLightCardExpanded] = useState(true);
    const[backgroundColor, setBackgroundColor] = useState("#1f1f1f");
    const[isBackgroundSolid, setIsBackgroundSolid] = useState(true);
    const[isLeftToRightGradient , setIsLeftToRightGradient] = useState(true);
    const[selectedBackgroundValue, setSelectedBackgroundValue] = useState("solid");
    const [isGridVisible, setIsGridVisible] = useState(true);
    

    //??
    const[color1 , setColor1] = useState("#4695E8");
    const[color2 , setColor2] = useState("#FFFFFF");
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

    //restore settings
    useEffect(() => {
        // dont run unitl grid is ready
        if(!grid) return;

        let savedScene = localStorage.getItem("screenshotsweet_scene");
        
        if(!savedScene) {
            
            const defaults = {
                isGridOn : "true",
                backgroundColor : "#1f1f25",
                isBackgroundSolid : "true",
                isLeftToRightGradient : "true",
                gradientColor1 : "#4695E8",
                gradientColor2: "#FFFFFF",
                gradientScale: "2.5",
                phone: {
                    rotation : {x: "0", y:"0", z: "0"}
                }
                //add more later
            };
            localStorage.setItem("screenshotsweet_scene", JSON.stringify(defaults));
            savedScene = JSON.stringify(defaults);
        }

        const userSettings = JSON.parse(savedScene);
        console.log(userSettings);

        //restore grid
        const isGridOn = userSettings.isGridOn === "true";
        setIsGridVisible(isGridOn);
        (grid.getGridHelper() as THREE.GridHelper).visible = isGridOn;

        //restore backgroundColor
        //setBackgroundColor(lastBackgroundColor);
        if(userSettings.backgroundColor && scene) {
            console.log("last color was ", userSettings.backgroundColor);
            setBackgroundColor(userSettings.backgroundColor);
            scene.background = new THREE.Color((userSettings.backgroundColor));
        }

        //restore background style and gradient colors
        const wasBackgroundSolid = userSettings.isBackgroundSolid === "true";
        setIsBackgroundSolid(wasBackgroundSolid);

        //restore no maatter whar
        if(userSettings.gradientColor1) setColor1(userSettings.gradientColor1);
        if(userSettings.gradientColor2) setColor2(userSettings.gradientColor2);

        //restore gradient
        const wasGradientLeftToRight = userSettings.isLeftToRightGradient === "true";
        //console.log("on loading gradient was left to right " , wasGradientLeftToRight);
        setIsLeftToRightGradient(wasGradientLeftToRight);

        if(wasBackgroundSolid) {
            setSelectedBackgroundValue("solid");
            scene.background = new THREE.Color((userSettings.backgroundColor));
        } else {
            setSelectedBackgroundValue("gradient");
            setColor1(userSettings.gradientColor1);
            setColor2(userSettings.gradientColor2);

            if(wasGradientLeftToRight) {  
                gradientBackground.turnLeftRightGradientOn(userSettings.gradientColor1, userSettings.gradientColor2);
            } else {
                gradientBackground.turnUpDownGradientOn(userSettings.gradientColor1, userSettings.gradientColor2);
            }
        }

        //restore gradient scale
        const previousGradientScale = Number(userSettings.gradientScale);
        setGradientScale(previousGradientScale);
        //console.log("previous scale value was: ",previousGradientScale)
        gradientBackground.updateGradientScale(previousGradientScale);



    }, [grid ,scene ]);

    /*
    function updateBackgroundColor(evt : React.ChangeEvent<HTMLInputElement>) : void {
        const selectedColor = (evt.target as HTMLInputElement).value;

        if(/^#[0-9A-Fa-f]{6}$/.test(selectedColor)) {
            scene.background = new THREE.Color(selectedColor);
            setBackgroundColor(selectedColor);

            //update the local storage
            let userData = localStorage.getItem("screenshotsweet_scene");
            let userSettings = userData ? JSON.parse(userData) : {};
            userSettings.backgroundColor = selectedColor;

            localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));
        }
    }
        */



    
    //takes an implicit event
    function updateBackgroundColor(evt : React.ChangeEvent<HTMLInputElement>) : void {
        //value from the input
        let selectedColor = (evt.target as HTMLInputElement).value;

        //convert to number and set the background
        //let selectedColorValue = selectedColor.replace("#", "0x");
        scene.background = new THREE.Color((selectedColor));

        //update the state
        setBackgroundColor(selectedColor);

        //update the local storage
        let userData = localStorage.getItem("screenshotsweet_scene");
        let userSettings = userData ? JSON.parse(userData) : {};
        userSettings.backgroundColor = selectedColor;

        localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));

        //console.log(backgroundColor);

    }
        

    function handleColor1Change(e : React.ChangeEvent<HTMLInputElement>) : void {
        const newColor = e.target.value;
        setColor1(newColor);
        gradientBackground.updateGradientColors(newColor,color2);

        //update the local storage
        let userData = localStorage.getItem("screenshotsweet_scene");
        let userSettings = userData ? JSON.parse(userData) : {};
        userSettings.gradientColor1 = newColor;
        localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));

        //update gradient colors
    }

    function handleColor2Change(e : React.ChangeEvent<HTMLInputElement>) : void {
        const newColor = e.target.value;
        setColor2(newColor);
        gradientBackground.updateGradientColors(color1, newColor);

        //update the local storage
        let userData = localStorage.getItem("screenshotsweet_scene");
        let userSettings = userData ? JSON.parse(userData) : {};
        userSettings.gradientColor2 = newColor;
        localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));

        //update gradient colors
    }

    /*
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
    */
    

    



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

            //update the local storage to toggle gradient on
            let userData = localStorage.getItem("screenshotsweet_scene");
            let userSettings = userData ? JSON.parse(userData) : {};
            userSettings.isBackgroundSolid = "false";
         
            localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));


            
        } else {
            //restore the solid background
            gradientBackground.turnGradientBackgroundOff();
            let colorValue = backgroundColor.replace("#", "0x");
            scene.background = new THREE.Color(Number(colorValue));
            //scene.background = new THREE.Color(colorValue);
            setIsBackgroundSolid(true);
            setSelectedBackgroundValue("solid");

            //update the local storage to toggle gradient on
            let userData = localStorage.getItem("screenshotsweet_scene");
            let userSettings = userData ? JSON.parse(userData) : {};
            userSettings.isBackgroundSolid = "true";

            localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));
        }
    }






    //pass in current colrs? pass in color1 and color2 as props? to gradientcolorselector
    // pass in setter functions to gradient background selector as props
    function handleGradientDirectionChange() : void {
        const newDirection = !isLeftToRightGradient;
        console.log("Gradient is left to right ", newDirection);
        setIsLeftToRightGradient(newDirection);
        gradientBackground.switchGradientDirection(newDirection);

        //update localstorage
        
        let userData = localStorage.getItem("screenshotsweet_scene");
        let userSettings = userData ? JSON.parse(userData) : {};
        if(newDirection) {
            userSettings.isLeftToRightGradient = "true";
        } else {
            userSettings.isLeftToRightGradient = "false";
        }
        console.log("Gradient is left to right ", userSettings.isLeftToRightGradient);
        localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));
        
    
        
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

        let userData = localStorage.getItem("screenshotsweet_scene");
        let userSettings = userData ? JSON.parse(userData) : {};
        userSettings.gradientScale = e.target.value;
        localStorage.setItem("screenshotsweet_scene", JSON.stringify(userSettings));
        console.log("user settings ", userSettings.gradientScale);
    


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
    
    function toggleGridVisibility() : void {
      if(isGridVisible ) { // || isRendering
          (grid!.getGridHelper() as THREE.GridHelper).visible = false;
          setIsGridVisible(false);

          //update localstorage internally
          let userSettings = localStorage.getItem("screenshotsweet_scene");
          let userObject = userSettings ? JSON.parse(userSettings) : {};
          if(userObject) {
            userObject.isGridOn = "false";
            localStorage.setItem("screenshotsweet_scene", JSON.stringify(userObject))
          }

      } else {
            (grid!.getGridHelper() as THREE.GridHelper).visible = true;
            setIsGridVisible(true);

            let userSettings = localStorage.getItem("screenshotsweet_scene");
            let userObject = userSettings ? JSON.parse(userSettings) : {};
            if(userObject) {
                userObject.isGridOn = "true";
                localStorage.setItem("screenshotsweet_scene", JSON.stringify(userObject))
            }

      }
    }

    return(
        <div  className={ isToolbarToggled ? `hidden` : `w-[100%] bg-chocolate flex-shrink-0 pb-2`}>
            {/* Header - always visible */}
            <div onClick={handleBgAndLightCardExpand}  className="flex justify-between items-center py-2 cursor-pointer">
                <h1 className="text-cream-vanilla ml-5 text-sm font-semibold" style={{ fontFamily: 'lato' }}>Background & Lighting</h1>
                <button onClick={handleBgAndLightCardExpand} className="mr-5 text-cream-vanilla">
                    <MenuKarrotIcon className={`text-pink-cherry w-[20px] h-[20px] cursor-pointer transition-all ease-in duration-300 ${isBgAndLightCardExpanded ? `` : `rotate-180`}`} />
                </button>
            </div>

            {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out ${
                isBgAndLightCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    {/* Background Section */}
                    <h1 className="text-cream-vanilla ml-5 mt-1 text-xs" style={{ fontFamily: 'lato' }}>Style</h1>
                    <div className="flex justify-between bg-chocolate py-2">
                        <select value={selectedBackgroundValue} onChange={handleBackgroundChange} className="w-[35%] ml-5 h-[30px] px-1 bg-mocha text-cream-vanilla text-sm rounded-md cursor-pointer">
                            <option value="solid" >solid</option>
                            <option value="gradient">gradient</option>
                        </select>

                        {isBackgroundSolid ? 
                            <input type="color" className="w-[60px] h-[30px] mr-5  rounded-lg"  value={backgroundColor} onChange={updateBackgroundColor}/> :
                            (
                            <div className="flex w-[40%]  mr-5">
                                <input className='w-[50%] h-[30px]'  type="color" name="" id="" value={color1} onChange={handleColor1Change}/>
                                <label className='text-cream-vanilla/40 mx-2' htmlFor=""> | </label>
                                <input className='w-[50%] h-[30px]' type="color" name="" id="" value={color2} onChange={handleColor2Change}/>
                            </div>
                            )
                        }
                        
                    </div>

                    {/* Gradient Settings */}
                    <h1 className="text-cream-vanilla ml-5 mt-1 mb-2 text-xs" style={{ fontFamily: 'lato' }}>Gradient Settings</h1>
                    <div className="flex w-[50%] ml-2 justify-around mt-1 ">
                        <button 
                            onClick={handleGradientDirectionChange} 
                            className={`flex justify-center items-center w-[50px] h-[35px] mx-1 rounded-lg py-1 transition-all ease-in duration-200
                                ${!isBackgroundSolid && isLeftToRightGradient 
                                    ? 'bg-cream-vanilla/30 pointer-events-none' 
                                    : 'bg-caramel-dark/50 hover:bg-caramel-dark/50 cursor-pointer'
                                }
                                ${isBackgroundSolid ? ' opacity-50 pointer-events-none' : ''}
                            `}
                        >
                            <LeftRightGradIcon 
                                className={!isBackgroundSolid && isLeftToRightGradient ? 'text-[#D946EF]' : 'text-cream-dark'} 
                            />
                        </button>

                        <button 
                            onClick={handleGradientDirectionChange} 
                            className={`flex justify-center items-center w-[50px] h-[35px] mx-1 rounded-lg py-1 transition-all ease-in duration-200
                                ${!isBackgroundSolid && !isLeftToRightGradient 
                                    ? 'bg-cream-vanilla/30 pointer-events-none' 
                                    : 'bg-caramel-dark/50 hover:bg-caramel-dark/50  cursor-pointer'
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
                        <label className={ isBackgroundSolid ? `text-cream-vanilla mt-1 text-xs` : `text-cream-vanilla mt-1 text-xs`}  style={{ fontFamily: 'lato' }} htmlFor="">Scale</label>
                        <input onChange={handleGradientScaleChange} disabled={isBackgroundSolid} value={gradientScale} max={"5"} min={"1"} step={"0.1"} className={isBackgroundSolid ? `w-[75%] h-1 my-1 accent-[#7D5328] opacity-40` : ` w-[75%] h-1 my-1 accent-[#B88347]`} type="range" />
                    </div>

                    <div className="flex flex-row ml-5 text-sm mt-2">
                        <label className="text-cream-vanilla mt-1 text-xs mr-4" style={{ fontFamily: 'lato' }} htmlFor="">Grid

                        </label>

                        <input className='accent-[#7D5328] mt-1' checked={isGridVisible} onChange={toggleGridVisibility} type="checkbox" name="" id="" />
                    </div>

                    {/* Divider */}
                    <div className="flex w-[100%] justify-center my-1">
                        <div className="w-[90%] h-px bg-pink-cherry/80 my-3"></div>
                    </div>

                    {/* Lighting */}
                    <div className='flex w-[100%] justify-center'>
                        <div className='flex  w-[90%] justify-center '>
                            <h1 className="text-cream-vanilla  my-1 text-sm"  style={{ fontFamily: 'lato' }}>Lighting</h1>
                        </div>
                    </div>

                   
                    <div className="flex w-[100%] justify-center mt-2 mb-5">
                        <div className="flex justify-between w-[80%] h-auto">
                            <button onClick={handleDirectionalLightCreation} className=" flex cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-coffee/80 hover:bg-amber/80 text-cream-vanilla hover:text-blue-frost transition-colors duration-200 rounded-lg py-1 justify-center  items-center ">
                                <DirectionalLightIcon className='w-[48px] h-[48px]  '/>
                            </button>

                            <button onClick={handleSpotLightCreation} className=" flex justify-center items-center cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-coffee/80 hover:bg-amber/80 text-cream-vanilla hover:text-blue-frost transition-colors duration-200 rounded-lg py-1">
                                <SpotLightIcon className='w-[32px] h-[32px]  ' />
                            </button>

                            <button onClick={handlePointLightCreation} className=" flex justify-center items-center cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-coffee/80 hover:bg-amber/80 text-cream-vanilla hover:text-blue-frost transition-colors duration-200 rounded-lg py-1">
                                <PointLightIcon className='w-[32px] h-[32px] transition-all duration-200 ease-in  '/>
                            </button>
                            <button onClick={handleRectAreaLightCreation} className=" flex justify-center items-center cursor-pointer w-[36px] h-[36px] transition-all duration-200 ease-in bg-coffee/80 hover:bg-amber/80 text-cream-vanilla hover:text-blue-frost transition-colors duration-200 rounded-lg py-1">
                                <RectAreaIcon className="w-[40px] h-[40px]"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}