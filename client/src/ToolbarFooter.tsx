interface ToolbarFooterProps {
    isToolbarToggled : boolean
    setToolbarToggled: React.MouseEventHandler<HTMLButtonElement>
}

export default function ToolbarFooter({isToolbarToggled, setToolbarToggled}: ToolbarFooterProps) {
    return(
        <>
            <div className={isToolbarToggled ? `flex w-full items-center justify-center  h-[7%] bg-[#FF6B9D] py-2 bottom-0` : `flex w-full items-center justify-between h-[7%] bg-velvet-accent`}>
                
                <h1 className={isToolbarToggled ? "hidden" : "h-[80%] w-[1/3]  text-cream rounded-xl flex items-center justify-center ml-3"}>
                    Logo here
                </h1>

                <div className=" flex w-[20%] h-[100%] mr-1 py-1 justify-center items-center">
                    <div className="profileImg w-[50px] h-[48px] bg-blue-200 rounded-4xl">
                    </div>
                </div>


            </div>
        </>
    )
}