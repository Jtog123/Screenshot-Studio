import { NavLink } from "react-router"


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
        window.location.href = "http://localhost:5050/auth/google";

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
            <div className="fixed flex h-[10%] w-[100%] bg-red-300 z-21">
                
                <div className="LogoTitleContainer flex w-[33%] h-[100%] items-center justify-between bg-blue-300">
                    {/*img here */}
                    <div>img here</div>
                    <h1>Screenshot Sweet</h1>
                </div>

                <div className="navigationLinks flex justify-center  w-[77%] h-[100%]  bg-green-600">
                    <nav className="flex  justify-around items-center w-[80%] h-[100%] ">
                        <NavLink to="/" end> Home </NavLink>
                        <NavLink to="/About" end> About </NavLink>
                        <NavLink to="/Pricing" end> Pricing </NavLink>
                        <NavLink to="" onClick={handleAuthRedirect} end> Sign In </NavLink>
                    </nav>

                </div>
               

            </div>
        </>
    )
}