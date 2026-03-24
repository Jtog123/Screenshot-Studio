import { useState } from "react";
import { AppUser } from "./AppUser"
import FooterMenu from "./FooterMenu";
import OfficialLogo from "./IconAssets/OfficialLogo";

interface ToolbarFooterProps {
    isToolbarToggled : boolean
    setToolbarToggled: React.MouseEventHandler<HTMLButtonElement>
    appUser: AppUser | null;
}

export default function ToolbarFooter({isToolbarToggled, setToolbarToggled, appUser}: ToolbarFooterProps) {

    const[isFooterMenuVisible, setFooterMenuVisible] = useState(false);

    function handleFooterMenu() :  any {
        console.log("handle footer menu");
        setFooterMenuVisible(!isFooterMenuVisible);
    }


    return (
        <div className= {
            isToolbarToggled ? `flex transition-all ease-in duration-100 w-full items-center justify-center [7%] bg-cream-golden py-2 hover:bg-crust-graham cursor-pointer` : `flex transition-all ease-in duration-100  w-full items-center justify-between h-[7%] bg-cream-golden px-4 hover:bg-crust-graham cursor-pointer`
            } onClick={handleFooterMenu}>

            {!isToolbarToggled && <OfficialLogo className="h-14 w-14"/>}
            
            {appUser ? (
                <div className="flex  h-[6%] items-center gap-2">

                    {!isToolbarToggled && (
                        <span className="text-text-espresso text-sm">
                            {appUser.display_name}
                        </span>
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