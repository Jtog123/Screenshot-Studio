import { CameraManager } from "./CameraManager"

interface ToolbarCameraProps {
    isToolbarToggled : boolean
    _cameraManager : CameraManager
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

export default function ToolbarEffectsCatalog({isToolbarToggled, _cameraManager}:ToolbarCameraProps) {
    return (
        <>
        <div className={isToolbarToggled ? `hidden`:`flex flex-col justify-center items-center w-[screen] h-[52.5%] bg-stone-950`}>
            <div className="flex flex-col w-[90%] h-[90%] bg-yellow-300">

                <h1 className="mb-2 ml-2 text-xl">Camera Settings:</h1>

                <div className="ZoomInOut flex bg-purple-300 h-[1/8] w-[100%] justify-between items-center">

                    <div>
                        <label className="ml-7 mr-3" htmlFor="">Zoom: </label>
                        <label className="bg-purple-100" htmlFor="">2</label>
                    </div>


                    {/* this will control the cameras z-axis we start at 5 on init, user sees it as 0  */}
                    <div className="button flex justiify-between container bg-red-200 w-[40%] p-1">
                        <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> + </button>
                        <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> - </button>
                    </div>


                </div>

                <div className="CameraUpDown flex bg-purple-300 h-[1/8] w-[100%] justify-between items-center">

                    <div>
                        <label className="ml-7 mr-3" htmlFor="">Height: </label>
                        <label className="bg-purple-100" htmlFor="">2</label>
                    </div>


                    {/* this will control the cameras z-axis we start at 5 on init, user sees it as 0  */}
                    <div className="button flex justiify-between container bg-red-200 w-[40%] p-1">
                        <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> ^ </button>
                        <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> - </button>
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

            <div className="flex flex-col w-[90%] h-[90%] bg-yellow-300 justify-between ">
                <h1 className="mb-2 ml-2 text-xl bg-red-200">Camera Presets:</h1>
                <div className="flex flex-col w-[100%] h-[90%]  bg-yellow-500 items-center justify-between">
                    
                    <div className="grid grid-rows-2 grid-cols-2 w-[100%] h-[100%] bg-blue-200">
                        <button className="bg-red-200 h-[100%] w-[100%]">
                            btu 1
                        </button>
                        <button className="bg-red-300 h-[100%] w-[100%]">
                            btu 1
                        </button>
                        <button className="bg-red-400 h-[100%] w-[100%]">
                            btu 1
                        </button>
                        <button className="bg-red-500 h-[100%] w-[100%]">
                            btu 1
                        </button>

                    </div>
                </div>  
                
 
            </div>

            

          

            
            </div>
        </>
    )
}