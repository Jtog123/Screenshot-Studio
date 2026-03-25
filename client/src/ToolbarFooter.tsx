import { useEffect, useState } from "react";
import { AppUser, SubscriptionType } from "./AppUser"
import FooterMenu from "./FooterMenu";
import OfficialLogo from "./IconAssets/OfficialLogo";
import { div } from "three/src/nodes/TSL.js";

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
                const response = await fetch("http://localhost:5050/api/userdata", {
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
            isToolbarToggled ? `flex   transition-all ease-in duration-100 w-full items-center justify-center [7%] bg-cream-golden py-2 hover:bg-crust-graham cursor-pointer` : `flex justify-end  transition-all ease-in duration-100  w-full items-center justify-between h-[7%] bg-cream-golden px-4 hover:bg-crust-graham cursor-pointer`
            } onClick={handleFooterMenu}>

            {/*{!isToolbarToggled && <OfficialLogo className="h-14 w-14"/>}*/}
            
            {appUser ? (
                <div className="flex justify-end h-[6%] items-center gap-2">

                    {!isToolbarToggled && (
                        <div className="flex flex-col "> 
                            
                            <span className="text-espresso text-sm">
                                {appUser.display_name}
                            </span>
                            <span className="text-xs text-espresso/80 text-end">
                            
                            {userSubscriptionPlan} plan
                            </span>
                        </div>
                    )}

                    <img 
                        src={appUser.profile_picture} 
                        alt={appUser.display_name}
                        className="h-10 w-10 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                    />

 


                </div>
            ) : (
                <div className="h-12 w-12 rounded-full bg-crust-light animate-pulse" />
            )}

            {isFooterMenuVisible && (<FooterMenu/>)}
        </div>
    );
}