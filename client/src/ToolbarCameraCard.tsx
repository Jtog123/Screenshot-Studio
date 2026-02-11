
import {useRef, useEffect, useState} from 'react'
export default function ToolbarCameraCard() { 

    const[isCameraCardExpanded, setIsCameraCardExpanded] = useState(false);
        //const[contentHeight, setContentHeight] = useState(0);
    
    function handleImgAndTextCardExpand() : void {
            setIsCameraCardExpanded(!isCameraCardExpanded);
    }

    
    const[zoom, setZoom] = useState(2);
    const[height, setHeight] = useState(6);
    /*


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
        */
    return (
        <>
        <div className="rounded-t-xl bg-stone-950 flex-1 -mt-2 z-10 border-t-1 border-x-1 border-stone-300 transition-all duration-500 ease-in-out  ">
            <div className="flex justify-between items-center py-2">
                <h1 className="ml-5 text-stone-300">Camera</h1>
                <button onClick={handleImgAndTextCardExpand} className="mr-5 text-stone-300">
                     {isCameraCardExpanded ? '^' : 'v'}
                </button>
            </div>

                        {/* using grid to epxnad content*/}
            <div className={`grid transition-all duration-300 ease-in-out  ${
                isCameraCardExpanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}>
                <div className="overflow-hidden">
                    {/* stuff here*/}
                    
                    <div className="ZoomInOut flex bg-stone-950 h-[1/8] w-[100%] justify-between items-center">
                        <div className="flex justify-between">
                            <label className="ml-5 mr-3 text-md text-stone-300" htmlFor="">Zoom: </label>
                            <label className="text-stone-300 " htmlFor="">{zoom}</label>
                        </div>

                        <div className="button flex justiify-between container w-[50%] p-1 mr-5">
                            <button  className="cursor-pointer w-[25%] mx-1 bg-red-500 rounded-lg py-1"> + </button>
                            <button  className="cursor-pointer w-[25%] mx-1 bg-red-500 rounded-lg py-1"> - </button>
                            <button className="cursor-pointer w-[25%] mx-1 bg-red-500 rounded-lg py-1"> r</button>
                        </div>
                    </div>

                    {/* HEIGHT */}
                    <div className="CameraUpDown flex  h-[1/8] w-[100%] justify-between items-center">
                        <div className="flex justify-between">
                            <label className="text-stone-300 ml-5 mr-3" htmlFor="">Height: </label>
                            <label className="text-stone-300" htmlFor="">{height}</label>
                        </div>

                        <div className="button flex justiify-between container w-[50%] p-1 mr-5 pb-2">
                            <button className="cursor-pointer w-[25%] mx-1 bg-red-500 rounded-lg py-1"> ^ </button>
                            <button className="cursor-pointer w-[25%] mx-1 bg-red-500 rounded-lg py-1"> - </button>
                            <button className="cursor-pointer w-[25%] mx-1 bg-red-500 rounded-lg py-1"> r</button>
                        </div>
                    </div>


                    {/*}
                    <div className="CameraUpDown flex bg-purple-300 h-[1/8] w-[100%] justify-between items-center">
                        <div>
                            <label className="ml-7 mr-3" htmlFor="">FOV: </label>
                            <label className="bg-purple-100" htmlFor="">2</label>
                        </div>

                        <div className="button flex justiify-between container bg-red-200 w-[40%] p-1">
                            <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> ^ </button>
                            <button className="w-[50%] h-[30px] rounded-4xl bg-red-400 m-1"> - </button>
                        </div>
                    </div>
                    */}

                    

                    


                   



                </div>
            </div>

        </div>
        </>
    )
}