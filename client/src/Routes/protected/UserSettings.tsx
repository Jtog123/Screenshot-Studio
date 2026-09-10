/*
 * ============================================================================
 * SCREENSHOTSTUDIO - USER SETTINGS PAGE (COMMENTED OUT - DO NOT DELETE)
 * Handled Stripe subscription status + cancellation. Unreachable now that auth/payments are removed (route commented out in App.tsx). Preserved for potential restoration.
 * ============================================================================
 * To restore: remove the leading "//" from each line below.
 */
//import { useEffect, useState } from "react"
//import OfficialLogo from "../../IconAssets/OfficialLogo"
//import { API_URL } from "../../config"
//import { Link, redirect } from "react-router";
//import { useNavigate } from "react-router";
//
///*
//Fwetch user data
//if user is not equal to free than allow the unsubscribe button to be clicked
//once the button is clicked handle the unsubscribe
//*/
//
//export default function UserSettings() {
//
//    const navigate = useNavigate();
//
//    const[userEmail, setUserEmail] = useState("");
//    const[userDisplayName, setUserDisplayName] = useState("");
//    const[userSubscriptionType, setUserSubscriptionType] = useState("");
//
//
//    async function getUserData() {
//        try {
//            //fetch user info, store it
//            const response = await fetch(`${API_URL}/api/userdata`, {
//                credentials: "include",
//                method: "GET"
//            });
//
//            if(!response) return;
//
//            const userData = await response.json();
//
//            setUserEmail(userData.user_email);
//            setUserDisplayName(userData.user_display_name);
//            setUserSubscriptionType(userData.subscription_type);
//
//            console.log(userData);
//
//        } catch(err) {
//            console.error("Error fetching user data", err);
//        }
//    }
//
//
//
//
//    useEffect(() => {
//
//        //call it upon loading
//        getUserData();
//
//    }, []);
//
//    async function handleUnsubscribe() : Promise<void> {
//        //create a note if you are on the weekend waro=rior pass, you will automatically be downgraded to a free membership after your 2 day pass expires
//
//        try {
//            const response = await fetch(`${API_URL}/api/cancel-subscription`, {
//                method: "POST",
//                credentials: "include"
//            });
//
//            const userData = await response.json();
//
//            if(response.ok ) {
//                if(userData.auto_expire) {
//                    alert("Your Weekend Warrior pass will automatically expire after 48 hours.");
//                } else if(userData.success) {
//                    alert("Unsubscribe Success. Your subscription will be cancelled at the end of your billing period. You'll keep access until then.");
//                    //getUserData();
//                    await getUserData();
//                    
//                } else {
//                    alert(userData.message)
//                }
//            } else {
//                alert(userData.error || "Failed to cancel subscription");
//            }
//
//        } catch(err) {
//            console.error("Unsubscribe Error:", err);
//            alert("An error occurred. Please try again.");
//
//        }
//
//        
//
//
//    }
//
//    /*
//         <Link 
//            to="/editor" 
//            className="fixed left-8 top-8 text-3xl text-cream-vanilla hover:text-pink-cherry transition-colors z-50"
//        >
//            
//        </Link>
//    */
//
//    return(
//        <div className="flex justify-center  min-h-screen min-w-screen bg-chocolate  mt-20">
//
//
//
//            <button className="fixed left-8 top-8 text-3xl text-cream-vanilla hover:text-pink-cherry transition-colors z-50" onClick={() => navigate(-1)}>✕</button>
//
//            <div className=" flex flex-col   w-[1000px] h-[400px] rounded-xl border-3 border-cream-vanilla">
//
//                            
//                <div className="flex justify-between items-center w-[100%] h-[25%]  mt-4  ">
//                    
//                    <h1 className="text-5xl text-cream-vanilla ml-6"> Hello, {userDisplayName}</h1>
//                    <OfficialLogo className="h-[100px] w-[100px] mr-4" />
//                </div>
//                <div className="flex justify-start items-center w-[100%]  mt-2  ">
//                    <h1 className="text-2xl text-cream-vanilla ml-6 mb-2"> User Settings:</h1>
//
//                </div>
//                    <div className="ml-8 w-[100%] ">
//                        <h1 className="ml-14 mb-2 text-cream-vanilla">Subscription Status: <span className="ml-4"> {userSubscriptionType}</span></h1>
//                        <div className="flex">
//                            <h1 className="ml-14 mr-4 text-cream-vanilla">Unsubscribe:</h1>
//                            <button onClick={handleUnsubscribe} className=" cursor-pointer bg-stone-600 rounded-lg h-[30px] w-[120px] hover:bg-stone-400 text-cream-vanilla">Unsubscribe</button>
//                        </div>
//
//
//                    </div>
//
//                
//            </div>
//
//
//        </div>
//    )
//}
