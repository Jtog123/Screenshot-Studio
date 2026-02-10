export default function ToolbarBgAndLightingCard() {
    return(
        <>
            <div className="w-[100%] bg-yellow-600">
                <h1 className="text-stone-200 ml-5 mt-1">Background</h1>
                <div className="flex justify-between bg-red-600 py-2">
                    <select  className=" w-[35%] ml-5 h-[30px] px-1  bg-stone-300 text-stone-900 border-default-medium text-heading text-sm rounded-md focus:ring-brand focus:border-brand shadow-xs placeholder:text-body">
                        <option value="solid">solid</option>
                        <option value="gradient">gradient</option>
                    </select>
                    <input type="color" className="w-[25%] h-[30px] mr-5" name="" id="" />

                    

                </div>

{               /*GRADIENT SETTINGS DISABLED IF SOLID BACKGROUND */}
                <h1 className="text-stone-200 ml-5 mt-1">Gradient Settings</h1>
                <div className="flex w-[50%] ml-2 justify-around mt-1">
                    <button className="cursor-pointer w-[35%] mx-1 bg-green-300 rounded-lg">LR</button>
                    <button className="cursor-pointer w-[35%] mx-1 bg-red-500 rounded-lg">UD</button>

                </div>

                <div className="flex flex-col ml-5 text-sm mt-1 ">
                    <label className="text-stone-200" htmlFor="">Scale</label>
                    <input className="w-[75%]" type="range" name="" id="" />
                </div>

                <div className="flex w-[100%] justify-center my-1 ">
                    <div className="divider w-[90%] h-px bg-stone-300/40 my-3"></div>
                </div>


                {/*LIGHTING */}
                <h1 className="text-stone-200 ml-5 my-1">Lighting</h1>
                <div className="flex w-[100%] ml-5 mb-5">
                    <div className="buttonBox flex justify-between w-[90%]">
                        <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg" >Dir</button>
                        <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg">Spot</button>
                        <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg">Point</button>
                        <button className="cursor-pointer w-[18%] bg-green-300 rounded-lg">Rect</button>
                    </div>


                </div>




            </div>
        
        </>
    )
}