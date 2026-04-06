import { div } from "three/src/nodes/TSL.js";
import OfficialLogo from "../../IconAssets/OfficialLogo";
import { useEffect } from "react";
import { FRONTEND_URL } from "../../config";

/*
settimeout()
App logo
h1 - Purchase Success
h1 you will now be redirected to the application 
chage redirect on stripe server
have successpage redirect to App
*/
export default function SuccessPage() {

    useEffect(() => {
        setTimeout(() => {
            window.location.href = `${FRONTEND_URL}/editor` //"http://localhost:5173/editor"
        }, 2500);
    }, [])


    return(
        <div className="flex justify-center  min-h-screen min-w-screen bg-chocolate  mt-20">
            <div className=" flex flex-col justify-center items-center w-[1000px] h-[400px] rounded-xl border-3 border-cream-vanilla">
                <div className="flex justify-center items-center w-[80%] h-[25%] mt-4 ">
                    <OfficialLogo className="h-[100px] w-[100px] mr-4" />
                    <h1 className="text-6xl text-cream-vanilla"> Purchase Success!</h1>
                </div>
                <div className="flex justify-center items-center w-[80%]  mt-2">
                        <h1 className="text-cream-vanilla text-2xl">You will now be redirected to the application.</h1>
                </div>
                
            </div>


        </div>
    )
}