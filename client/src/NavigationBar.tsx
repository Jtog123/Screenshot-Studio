import { NavLink } from "react-router"
import OfficialLogo from "./IconAssets/OfficialLogo";
import OfficialNameIcon from "./IconAssets/OfficialName";
import { API_URL } from "./config";
import { useState } from "react";

/*

      <NavLink to="/">
        <img src={myImage} alt="Home" style={{ width: '50px' }} />
      </NavLink>

*/


export default function NavigationBar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setIsMenuOpen(false);
    };

    

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

    return (
        <>
            <div className="fixed top-0 flex h-[7%] w-[100%] z-[100]">
                
                {/* Logo Section */}
                <div className="LogoTitleContainer flex w-full lg:w-[33%] h-[100%] items-center justify-between bg-coffee/80 px-5">
                    {/* Logo */}
                <div className="flex items-center h-full">
                    <div className="h-[90%]">
                        <OfficialLogo className="h-full w-auto"/>
                    </div>
                    <OfficialNameIcon className="h-[90%] w-[70%]"/>
                </div>

                    {/* Hamburger Menu - Mobile Only */}
                    <button 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden text-cream-vanilla flex flex-col gap-1.5 w-8 h-8 justify-center items-center"
                        aria-label="Toggle menu"
                    >
                        <span className={`block w-6 h-0.5 bg-cream-vanilla transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-cream-vanilla transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                        <span className={`block w-6 h-0.5 bg-cream-vanilla transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                    </button>
                </div>

                {/* Navigation Links - Desktop */}
                <div className="navigationLinks hidden lg:flex justify-center w-[77%] h-[100%] bg-coffee/80">
                    <nav className="flex justify-around items-center w-[80%] h-[100%]">
                        <button onClick={() => scrollToSection('hero')} className="text-cream-vanilla font-inter cursor-pointer hover:underline">Home</button>
                        <button onClick={() => scrollToSection('about')} className="text-cream-vanilla font-inter cursor-pointer hover:underline">About</button>
                        <button onClick={() => scrollToSection('pricing')} className="text-cream-vanilla font-inter cursor-pointer hover:underline">Pricing</button>
                        <button onClick={handleAuthRedirect} className="text-cream-vanilla font-inter cursor-pointer hover:underline">Sign In</button>
                    </nav>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`fixed top-[7%] left-0 w-full bg-coffee/95 backdrop-blur-sm z-[99] lg:hidden transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
                <nav className="flex flex-col items-center py-6 gap-6">
                    <button 
                        onClick={() => scrollToSection('hero')}
                        className="text-cream-vanilla font-inter text-xl cursor-pointer hover:text-pink-cherry transition-colors"
                    >
                        Home
                    </button>
                    <button 
                        onClick={() => scrollToSection('about')}
                        className="text-cream-vanilla font-inter text-xl cursor-pointer hover:text-pink-cherry transition-colors"
                    >
                        About
                    </button>
                    <button 
                        onClick={() => scrollToSection('pricing')}
                        className="text-cream-vanilla font-inter text-xl cursor-pointer hover:text-pink-cherry transition-colors"
                    >
                        Pricing
                    </button>
                    <button 
                        onClick={handleAuthRedirect}
                        className="text-cream-vanilla font-inter text-xl cursor-pointer hover:text-pink-cherry transition-colors"
                    >
                        Sign In
                    </button>
                </nav>
            </div>
        </>
    );
}