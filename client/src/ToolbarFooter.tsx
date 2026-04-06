import { useEffect, useState } from "react";
import { AppUser, SubscriptionType } from "./AppUser"
import FooterMenu from "./FooterMenu";
import OfficialLogo from "./IconAssets/OfficialLogo";
import { div } from "three/src/nodes/TSL.js";
import { API_URL } from "./config";

interface ToolbarFooterProps {
    isToolbarToggled : boolean
    setToolbarToggled: React.MouseEventHandler<HTMLButtonElement>
    appUser: AppUser | null;
}

export default function ToolbarFooter({isToolbarToggled, setToolbarToggled, appUser}: ToolbarFooterProps) {

    const[isFooterMenuVisible, setFooterMenuVisible] = useState(false);
    const[userSubscriptionPlan , setUserSubscriptionPlan] = useState<SubscriptionType>(SubscriptionType.Free);

    useEffect(() => {
        const checkUserMembership = async() => {
            try {
                const response = await fetch(`${API_URL}/api/userdata`, { //"http://localhost:5050/api/userdata"
                    method: "GET",
                    credentials: "include"
                });

                if(!response.ok) {
                    console.error("Failed to get user data.");
                    return;

                }

                const userData = await response.json();
                setUserSubscriptionPlan(userData.subscription_type);

            } catch(err) {
                console.error(err ," Could not get user data for toolbar footer.")
            }
        }

        checkUserMembership();

    }, [])

    function handleFooterMenu() :  any {
        console.log("handle footer menu");
        setFooterMenuVisible(!isFooterMenuVisible);
    }



    return (
        <div className= {
            isToolbarToggled ? `flex   transition-all ease-in duration-100 w-full items-center justify-center min-h-[7%] bg-coffee/80 py-2 hover:bg-espresso cursor-pointer` : `flex justify-end  transition-all ease-in duration-100  w-full items-center justify-between min-h-[7%] bg-coffee/80 px-4 hover:bg-espresso cursor-pointer`
            } onClick={handleFooterMenu}>

            {/*{!isToolbarToggled && <OfficialLogo className="h-14 w-14"/>}*/}
            
            {appUser ? (
                <div className={!isToolbarToggled ? `flex  w-[100%] items-center justify-start gap-2 pl-2` : `flex w-[100%] items-center justify-center gap-2 pl-2` }>

                    <div className="fkex-shrink-0">
                        <img 
                            src={appUser.profile_picture} 
                            alt={appUser.display_name}
                            className="h-10 w-10 rounded-full object-cover mr-2"
                            referrerPolicy="no-referrer"
                        />
                    </div>


                    {!isToolbarToggled && (
                        <div className="flex flex-col min-w-0 "> 
                            
                            <span className="text-cream-vanilla text-sm">
                                {appUser.display_name}
                            </span>
                            <span className="text-xs text-cream-vanilla/80 text-start">
                            
                            {userSubscriptionPlan} plan 
                            </span>
                            
                        </div>
                    )}



 


                </div>
            ) : (
                <div className="h-12 w-12 rounded-full bg-crust-light animate-pulse" />
            )}

            {isFooterMenuVisible && (<FooterMenu/>)}
        </div>
    );
}