export default function FooterMenu() {


  /*
  useEffect(() => {
    fetch("http://localhost:5050/auth/google/me", {
      method: "GET",
      credentials: "include",
      headers: {}
    }).then(response => response.json())
    .then(userData => {
      setAppUser(userData.userProfile);
    })
    .catch(err => {
      console.error("Error", err);
    })

  },[]);
  */

    function handleUserLogout() : void {
        //send a log out reuqest to the backend
        const userLogout = async () => {
            try {
                const response = await fetch("http://localhost:5050/auth/logout", {
                    method: "POST",
                    credentials: "include"
                });

                console.log(response);

                if(!response.ok) {
                    console.error("Logout failed with status", response.status, " redirecting anyway");
                    throw new Error("Logout failed");
                }

                const userData = await response.json();

                if(userData.success) {
                    console.log("Logout success, redirecting");
                    window.location.href = "http://localhost:5173/";

                }

            } catch(err) {
                //navigate home anyway
                window.location.href = "http://localhost:5173/";
                console.error("Error", err);
            }
            

        }

        userLogout();
    }


    return (
        <>
            <div className="absolute p-1.5 z-dropdown bg-espresso border border-pink-cherry/80 backdrop-blur-xl rounded-xl min-w-[16rem] text-cream-vanilla shadow-lg max-h-[24rem] overflow-y-auto mx-0.5 bottom-15 right-4">
            
                {/* Email header */}
                <div className="text-cream-vanilla pt-1 px-2 truncate">
                    {/*appUser.email*/}
                </div>

                {/* Menu item 
                <a href="/settings" className="flex items-center gap-2 min-h-8 px-2 py-1.5 rounded-lg hover:bg-bg-200 cursor-pointer hover:bg-mocha/70">
                    {/* Icon here 
                    <span>Settings</span>
                </a>
                */}

                {/* Divider */}
                <div className="h-[0.5px] bg-border-300  mx-2" />

                {/* More menu items */}
                <a href="/upgrade" className="flex items-center gap-2 min-h-8 px-2  rounded-lg hover:bg-bg-200 cursor-pointer hover:bg-mocha/70">
                    <span>Upgrade plan</span>
                </a>


                {/* Divider */}
                <div className="h-[0.5px] bg-border-300 my-1.5 mx-2" />

                {/* Logout */}
                <a onClick={handleUserLogout} className="flex items-center gap-2 min-h-8 px-2  rounded-lg hover:bg-bg-200 cursor-pointer hover:bg-mocha/70">
                    <span>Log out</span>
                </a>

            </div>
        </>
    )
}

