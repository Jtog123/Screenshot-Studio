import { NavLink } from "react-router"


export default function NavigationBar() {
    return(
        <>
            <div className="fixed flex h-[10%] w-[100%] bg-red-300 z-21">
                
                <div className="LogoTitleContainer flex w-[33%] h-[100%] items-center justify-between bg-blue-300">
                    {/*img here */}
                    <div>img here</div>
                    <h1>Screenshot Sweet</h1>
                </div>

                <div className="navigationLinks flex justify-center  w-[77%] h-[100%]  bg-green-600">
                    <nav className="flex  justify-around items-center w-[80%] h-[100%] ">
                        <NavLink to="/" end> Home </NavLink>
                        <NavLink to="/editor" end> Sign In </NavLink>
                        <NavLink to="/About" end> About </NavLink>
                        <NavLink to="/Pricing" end> Pricing </NavLink>
                        <NavLink to="/Contact" end> Contact </NavLink>
                    </nav>

                </div>
               

            </div>
        </>
    )
}