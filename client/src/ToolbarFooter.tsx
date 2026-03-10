import { useState } from "react";
import { AppUser } from "./AppUser"
import FooterMenu from "./FooterMenu";

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

            {!isToolbarToggled && <h1 className="text-text-espresso">Logo here</h1>}
            
            {appUser ? (
                <div className="flex  h-[6%] items-center gap-2">

                    {!isToolbarToggled && (
                        <span className="text-text-espresso text-sm">
                            {appUser.displayName}
                        </span>
                    )}

                    <img 
                        src={appUser.profilePicture} 
                        alt={appUser.displayName}
                        className="h-10 w-10 rounded-full object-cover"
                    />

 


                </div>
            ) : (
                <div className="h-12 w-12 rounded-full bg-crust-light animate-pulse" />
            )}

            {isFooterMenuVisible && (<FooterMenu/>)}
        </div>
    );
}