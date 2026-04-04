import { useEffect, useState } from "react"
import OfficialLogo from "../../IconAssets/OfficialLogo"
import { API_URL } from "../../config"
/*
Fwetch user data
if user is not equal to free than allow the unsubscribe button to be clicked
once the button is clicked handle the unsubscribe
*/

export default function UserSettings() {

    const[userEmail, setUserEmail] = useState("");
    const[userDisplayName, setUserDisplayName] = useState("");
    const[userSubscriptionType, setUserSubscriptionType] = useState("");

    useEffect(() => {

        const getUserData = async() => {
            try {
                //fetch user info, store it
                const response = await fetch(`${API_URL}/api/userdata`, {
                    credentials: "include",
                    method: "GET"
                });

                if(!response) return;

                const userData = await response.json();

                setUserEmail(userData.user_email);
                setUserDisplayName(userData.user_display_name);
                setUserSubscriptionType(userData.subscription_type);

                console.log(userData);


            } catch(err) {
                console.error("Error fetching user data", err);
            }
        }

        getUserData();



    }, []);

    function handleUnsubscribe() : void {
        if(userSubscriptionType !== "Free") {
            // start a stripe unsubscribe
        }

    }

    return(
        <div className="flex justify-center  min-h-screen min-w-screen bg-chocolate  mt-20">
            <div className=" flex flex-col   w-[1000px] h-[400px] rounded-xl border-3 border-cream-vanilla">
                <div className="flex justify-between items-center w-[100%] h-[25%]  mt-4  ">
                    
                    <h1 className="text-5xl text-cream-vanilla ml-6"> Hello, {userDisplayName}</h1>
                    <OfficialLogo className="h-[100px] w-[100px] mr-4" />
                </div>
                <div className="flex justify-start items-center w-[100%]  mt-2  ">
                    <h1 className="text-2xl text-cream-vanilla ml-6 mb-2"> User Settings:</h1>

                </div>
                    <div className="ml-8 w-[100%] ">
                        <h1 className="ml-14 mb-2 text-cream-vanilla">Subscription Status: <span className="ml-4"> {userSubscriptionType}</span></h1>
                        <div className="flex">
                            <h1 className="ml-14 mr-4 text-cream-vanilla">Unsubscribe:</h1>
                            <button onClick={handleUnsubscribe} className=" cursor-pointer bg-stone-600 rounded-lg h-[30px] w-[120px] hover:bg-stone-400 text-cream-vanilla">Unsubscribe</button>
                        </div>


                    </div>

                
            </div>


        </div>
    )
}