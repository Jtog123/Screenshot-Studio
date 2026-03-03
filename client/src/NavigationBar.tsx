export default function NavigationBar() {
    return(
        <>
            <div className="fixed flex h-[10%] w-[100%] bg-red-300 z-21">
                
                <div className="LogoTitleContainer flex w-[33%] h-[100%] items-center justify-between bg-blue-300">
                    {/*img here */}
                    <div>img here</div>
                    <h1>Screenshot Sweet</h1>
                </div>

                <div className="navigationLinks flex items-center w-[77%] h-[100%] justify-around bg-green-600">
                    <a  className="text-stone-300" href="">Home</a>
                    <a  className="text-stone-300" href="">Sign In</a>
                    <a  className="text-stone-300" href="">About</a>
                    <a  className="text-stone-300" href="">Pricing</a>
                    <a  className="text-stone-300" href="">Contact</a>


                </div>
               

            </div>
        </>
    )
}