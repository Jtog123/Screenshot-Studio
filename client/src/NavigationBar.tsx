import { NavLink } from "react-router"
import OfficialLogo from "./IconAssets/OfficialLogo";
import OfficialNameIcon from "./IconAssets/OfficialName";
import { API_URL } from "./config";

/*

      <NavLink to="/">
        <img src={myImage} alt="Home" style={{ width: '50px' }} />
      </NavLink>

*/


export default function NavigationBar() {

    /*
    -triggers a redirect to the backend
    -the backend triggers a redirect to google
    -user signs authenticates
    -google returns a callback (google redirects back to backend with an auth code)
    -that function stores user data who just signed in?
        1. Receives authorization code from Google
        2. Exchanges code for access token (backend calls Google's API)
        3. Uses access token to get user info (email, name, etc.)
        4. **Stores user data** (in database)
        5. **Creates auth session** (cookie or JWT)
        6. **Redirects to frontend** (back to your React app)
    -redirect to frontend/editor 
    */
    function handleAuthRedirect() {
        //route that takes me to the google sign in page, as specified by my server
        window.location.href = `${API_URL}/auth/google`;

        console.log("this gets called immidiatley")

       /*
       fetch("http://localhost:5050/", {
        method: "GET",
        credentials: "include",
        headers: {
            
        },
        //body: JSON.stringify({name: "Example Name sending req"})
       })
       .then(response => response.json())
       .then(data => {
        console.log("We are good?", data);
       })
       .catch(err => {
        console.error("error", err);
       })
        */
    }

    /*

    soemthing like this
    router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/auth/failure'}), (req, res) => {
        res.redirect('http://localhost:3000'); 
        
        // Redirect to the client-side route
    })
    */

    return(
        <>
            <div className="fixed flex h-[7%] w-[100%] z-21">
                
                <div className="LogoTitleContainer flex w-[33%] h-[100%] items-center  bg-coffee/80">
                    {/*img here */}
                    <div className="h-[90%]">
                        <OfficialLogo className="h-[100%] w-20  ml-5"/>
                    </div>

                    <OfficialNameIcon className="h-[100%] w-60 "/>
                </div>

                <div className="navigationLinks flex justify-center  w-[77%] h-[100%]  bg-coffee/80">
                    <nav className="flex  justify-around items-center w-[80%] h-[100%] ">
                        <NavLink to="/" className="text-cream-vanilla font-inter cursor-pointer no-underline hover:underliner" end > Home </NavLink>
                        <NavLink to="/About" className="text-cream-vanilla font-inter cursor-pointer" end> About </NavLink>
                        <NavLink to="/Pricing" className="text-cream-vanilla font-inter cursor-pointer" end > Pricing </NavLink>
                        <NavLink to="" className="text-cream-vanilla font-inter cursor-pointer" onClick={handleAuthRedirect} end> Sign In </NavLink>
                    </nav>

                </div>
               

            </div>
        </>
    )
}