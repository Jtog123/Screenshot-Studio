export default function FooterMenu() {
    return (
        <>
            <div className="absolute p-1.5 z-dropdown bg-bg-000 border border-border-200 backdrop-blur-xl rounded-xl min-w-[16rem] text-text-300 shadow-lg max-h-[24rem] overflow-y-auto mx-0.5 bottom-15 right-0">
            
                {/* Email header */}
                <div className="text-text-500 pt-1 px-2 pb-2 truncate">
                    {/*appUser.email*/}
                </div>

                {/* Menu item */}
                <a href="/settings" className="flex items-center gap-2 min-h-8 px-2 py-1.5 rounded-lg hover:bg-bg-200 cursor-pointer">
                    {/* Icon here */}
                    <span>Settings</span>
                </a>

                {/* Divider */}
                <div className="h-[0.5px] bg-border-300 my-1.5 mx-2" />

                {/* More menu items */}
                <a href="/upgrade" className="flex items-center gap-2 min-h-8 px-2 py-1.5 rounded-lg hover:bg-bg-200 cursor-pointer">
                    <span>Upgrade plan</span>
                </a>


                {/* Divider */}
                <div className="h-[0.5px] bg-border-300 my-1.5 mx-2" />

                {/* Logout */}
                <a href="/logout" className="flex items-center gap-2 min-h-8 px-2 py-1.5 rounded-lg hover:bg-bg-200 cursor-pointer">
                    <span>Log out</span>
                </a>

            </div>
        </>
    )
}

