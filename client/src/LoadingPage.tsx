import OfficialLogo from "./IconAssets/OfficialLogo"

export default function LoadingPage() {

    return(
        <div className="fixed inset-0 bg-chocolate backdrop-blur-sm z-[100] flex items-center justify-center">
            <div className=" flex flex-col justify-center items-center w-[1100px] h-[400px] rounded-2xl border-3 border-cream-vanilla">
                <div className="flex justify-center items-center w-[80%] h-[25%] mt-4 ">
                    <OfficialLogo className="h-[100px] w-[100px] mr-4" />
                    <h1 className="text-6xl text-cream-vanilla whitespace-nowrap"> Loading. One Moment Please.</h1>
                </div>
                <div className="flex justify-center items-center w-[80%]  mt-2">
                        <h1 className="text-cream-vanilla text-2xl whitespace-nowrap">Redirecting to Stripe Payments.</h1>
                </div>
                
            </div>


        </div>
    )
}