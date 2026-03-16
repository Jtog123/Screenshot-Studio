import {useRef, useEffect, useState} from 'react'
import { CameraManager } from "./CameraManager"
import RefreshStartIcon from './IconAssets/RefreshStartIcon'
import * as THREE from 'three'
import CameraZoomInIcon from './IconAssets/CameraZoomInIcon'
import CameraZoomOutIcon from './IconAssets/CameraZoomOutIcon'
import CameraUpIcon from './IconAssets/CameraUpIcon'
import CameraDownIcon from './IconAssets/CameraDownIcon'
import MenuKarrotIcon from './IconAssets/MenuKarrotIcon'
import { AspectRatio } from './ComponentInterfaces'

interface ToolbarCameraCardProps {
    isToolbarToggled : boolean
    _cameraManager : CameraManager
    _phoneModel : THREE.Group
    aspectRatio : AspectRatio
    setAspectRatio : React.Dispatch<React.SetStateAction<AspectRatio>>
}

export default function ToolbarCameraCard({isToolbarToggled, _cameraManager, _phoneModel, aspectRatio, setAspectRatio} : ToolbarCameraCardProps) { 

    const[isCameraCardExpanded, setIsCameraCardExpanded] = useState(false);
        //const[contentHeight, setContentHeight] = useState(0);
    
    function handleCameraCardExpand() : void {
            setIsCameraCardExpanded(!isCameraCardExpanded);
    }

    
    const[zoom, setZoom] = useState(2);
    const[height, setHeight] = useState(6);
    


    function handleCameraZoomIn() : void {
        if( _cameraManager.zoomCameraIn()) {
            setZoom(count => count + 1);
        }

    }

    function handleCameraZoomOut() : void {
        if(_cameraManager.zoomCameraOut()) {
            setZoom(count => count - 1);
        }

    }


    function handleCameraHeightIncrease() : void {
        if(_cameraManager.increaseCameraHeight()) {
            setHeight(count => count + 1);
        }

    }

    function handleCameraHeightDecrease() : void {
        if(_cameraManager.decreaseCameraHeight()) {
            setHeight(count => count - 1);
        }

    }

    function handleHeightReset() : void {
        //update internally
        _cameraManager.resetCamera();
        setHeight(6);
    }

    function handleZoomReset() : void {
        _cameraManager.resetZoom();
        setZoom(2);
    }

    function handleAspectRatioChange(e : React.ChangeEvent<HTMLSelectElement>) : void {
        /*
        if e.target.value === "2688x1242"
        */
       console.log("changing the aspect ratio", e.target.value);

        if (e.target.value === "1242x2688") {
            setAspectRatio({
                width:1242,
                height:2688,
                type: "default"
            });
        } else if(e.target.value === "2688x1242") {
            setAspectRatio({
                width:2688,
                height:1242,
                type: "wide"
            });
        }   
    }
        
    return (
        <>
        <div  className={isToolbarToggled ? `hidden` : `rounded-t-xl bg-cream-vanilla flex-1 -mt-2 z-10 border-t-1 border-x-1 border-orange-juicy/80 transition-all duration-500 ease-in-out `}>
            <div onClick={handleCameraCardExpand} className="flex justify-between items-center py-2 cursor-pointer">
                <h1 className="ml-5 text-espresso text-sm font-bold" style={{ fontFamily: 'lato' }}>Camera</h1>
                <button onClick={handleCameraCardExpand} className="mr-5 text-stone-300">
                    <MenuKarrotIcon className={`text-orange-caramel w-[20px] h-[20px] cursor-pointer transition-all ease-in duration-300 ${isCameraCardExpanded ? `` : `rotate-180`}`} />
                </button>
            </div>

                        {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out  ${
                isCameraCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    {/* stuff here*/}
                    
                    <div className="ZoomInOut flex bg-cream-vanilla h-[1/8] w-[100%] justify-between items-center ">
                        <div className="flex justify-between">
                            <label className="ml-5 mr-3 text-md text-espresso text-xs" style={{ fontFamily: 'lato' }} htmlFor="">Zoom: </label>
                            <label className="text-espresso/70 text-xs " style={{ fontFamily: 'lato' }} htmlFor="">{zoom}</label>
                        </div>

                        <div className="button flex justiify-between container w-[50%] p-1 mr-5">
                            <button onClick={handleCameraZoomIn}  className="flex justify-center items-center cursor-pointer p-1 h-[30px] w-[40px] mx-1 bg-crust-graham/70 hover:bg-orange-juicy/50 text-espresso hover:text-cream-light transition-all duration-200  rounded-lg py-1"> 
                                <CameraZoomInIcon className="text-espresso"/>
                            </button>
                            <button onClick={handleCameraZoomOut} className="flex justify-center items-center cursor-pointer p-1 h-[30px] w-[40px] mx-1 bg-crust-graham/70 hover:bg-orange-juicy/50 text-espresso hover:text-cream-light  transition-all duration-200  rounded-lg py-1"> 
                                <CameraZoomOutIcon className='text-espresso'/>
                            </button>
                            <button onClick={handleZoomReset} className="flex justify-center items-center bg-crust-graham/70 hover:bg-orange-juicy/50 text-espresso hover:text-cream-light  transition-all duration-200  rounded-xl h-[30px] w-[30px] cursor-pointer group">
                                <RefreshStartIcon className="transition-transform duration-300 group-hover:-rotate-90" />
                            </button>
                        </div>
                    </div>

                    {/* HEIGHT */}
                    <div className="CameraUpDown flex  h-[1/8] w-[100%] justify-between items-center">
                        <div className="flex justify-between">
                            <label className="text-espresso ml-5 mr-3 text-xs" style={{ fontFamily: 'lato' }} htmlFor="">Height: </label>
                            <label className="text-espresso/70 text-xs" htmlFor="">{height}</label>
                        </div>

                        <div className="button flex justiify-between container w-[50%] p-1 mr-5 pb-2">
                            <button onClick={handleCameraHeightIncrease} className="flex justify-center items-center cursor-pointer p-1 h-[30px] w-[40px] mx-1 bg-crust-graham/70 hover:bg-orange-juicy/50 text-espresso hover:text-cream-light  transition-all duration-200  rounded-lg py-1">
                                 <CameraUpIcon className=''/>
                            </button>

                            <button onClick={handleCameraHeightDecrease} className="flex justify-center items-center cursor-pointer p-1 h-[30px] w-[40px] mx-1 bg-crust-graham/70 hover:bg-orange-juicy/50 text-espresso hover:text-cream-light  transition-all duration-200  rounded-lg py-1">
                                 <CameraDownIcon className=''/>
                            </button>

                            <button onClick={handleHeightReset} className="flex justify-center items-center bg-crust-graham/70 hover:bg-orange-juicy/50 text-espresso hover:text-cream-light  transition-all duration-200 rounded-xl h-[30px] w-[30px] cursor-pointer group">
                                <RefreshStartIcon className="transition-transform duration-300 group-hover:-rotate-90" />
                            </button>
                        </div>
                    </div>

                    {/*Aspect ratio */}
                    <div className="aspectRatio flex h-[1/8] w-[100%] justify-between items-center ">
<div className="flex justify-between">
                            <label className="text-espresso ml-5 mr-3 text-xs" style={{ fontFamily: 'lato' }} htmlFor="">Aspect Ratio </label>
                            <label className="text-espresso/70 text-xs" htmlFor=""></label>
                        </div>

                        <div className="button flex justiify-between container w-[50%] p-1 mr-5 pb-2">
                            <select name="" className="bg-crust-graham/70 text-espresso text-sm rounded-md cursor-pointer h-[30px] w-[75%]" id="" onChange={(e) => handleAspectRatioChange(e)} >
                                <option value="1242x2688" >1242 x 2688</option>
                                <option value="2688x1242">2688 x 1242</option>
                                <option value="2400x1200">2400 x 1200</option>
                            </select>

                        </div>
                    

                    </div>


                    {/*
                    
                    */}

                    

                    


                   



                </div>
            </div>

        </div>
        </>
    )
}