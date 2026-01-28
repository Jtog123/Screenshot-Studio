import { CameraManager } from "./CameraManager"
import {useRef, useEffect, useState} from 'react'
import * as THREE from 'three'

interface ToolbarCameraProps {
    isToolbarToggled : boolean
    _cameraManager : CameraManager
    _phoneModel : THREE.Group
}

//add camera setting here
//pass a camera manager instance

/*
FOV- a little bit


4. Presets
"Front View" / "3/4 View" / "Side View" / "Top Down"
One-click camera positions for common angles
Huge time-saver
*/

export default function ToolbarCameraCatalog({isToolbarToggled, _cameraManager, _phoneModel}:ToolbarCameraProps) {

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



    return (
        <>
        <div className={isToolbarToggled ? `hidden`:`flex flex-col justify-center items-center w-[screen] h-[52.5%] bg-stone-950`}>
            <div className="flex flex-col w-[90%] h-[90%] bg-yellow-300">

                <h1 className="mb-2 ml-2 text-xl">Camera Settings:</h1>

                <div className="ZoomInOut flex bg-purple-300 h-[1/8] w-[100%] justify-between items-center">

                    <div className="flex justify-between">
                        <label className="ml-7 mr-3" htmlFor="">Zoom: </label>
                        <label className="bg-purple-100 " htmlFor="">{zoom}</label>
                        
                    </div>


                    {/* this will control the cameras z-axis we start at 5 on init, user sees it as 0  */}
                    <div className="button flex justiify-between container bg-red-200 w-[50%] p-1">
                        <button onClick={handleZoomReset} className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> r</button>
                        <button onClick={handleCameraZoomIn} className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> + </button>
                        <button onClick={handleCameraZoomOut} className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> - </button>
                    </div>


                </div>

                <div className="CameraUpDown flex bg-purple-300 h-[1/8] w-[100%] justify-between items-center">

                    <div className="flex justify-between">
                        <label className="ml-7 mr-3" htmlFor="">Height: </label>
                        <label className="bg-purple-100" htmlFor="">{height}</label>
                    </div>


                    {/* this will control the cameras z-axis we start at 5 on init, user sees it as 0  */}
                    <div className="button flex justify-between container bg-red-200 w-[50%] p-1">
                         <button onClick={handleHeightReset} className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> r</button>
                        <button onClick={handleCameraHeightIncrease} className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> ^ </button>
                        <button onClick={handleCameraHeightDecrease} className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> - </button>
                    </div>


                </div>

                <div className="CameraUpDown flex bg-purple-300 h-[1/8] w-[100%] justify-between items-center">

                    <div>
                        <label className="ml-7 mr-3" htmlFor="">FOV: </label>
                        <label className="bg-purple-100" htmlFor="">2</label>
                    </div>


                    {/* this will control the cameras z-axis we start at 5 on init, user sees it as 0  */}
                    <div className="button flex justiify-between container bg-red-200 w-[40%] p-1">
                        <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> ^ </button>
                        <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> - </button>
                    </div>


                </div>
 
            </div>

            <div className="flex flex-col w-[90%] h-[90%] mb-5 bg-yellow-700 justify-between">
                <h1 className="mb-2 ml-2 text-xl bg-red-200 ">Phone Presets:</h1>
                <div className="flex flex-col w-[100%] h-[90%]  bg-yellow-500 items-center justify-between">
                    

                </div>  
                
 
            </div>

            

          

            
            </div>
        </>
    )
}