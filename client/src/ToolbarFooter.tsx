import { AppUser } from "./AppUser"

interface ToolbarFooterProps {
    isToolbarToggled : boolean
    setToolbarToggled: React.MouseEventHandler<HTMLButtonElement>
    appUser: AppUser | null;
}

export default function ToolbarFooter({isToolbarToggled, setToolbarToggled, appUser}: ToolbarFooterProps) {
    return (
        <div className={
            isToolbarToggled 
                ? "flex w-full items-center justify-center h-[7%] bg-cream-golden py-2" 
                : "flex w-full items-center justify-between h-[7%] bg-cream-golden px-4"
        }>
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
        </div>
    );
}