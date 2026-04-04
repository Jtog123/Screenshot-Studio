import {BrowserRouter, Routes, Route} from "react-router"
import Editor from "./Routes/protected/Editor";
import HomePage from "./Routes/public/HomePage";
import SuccessPage from "./Routes/protected/PurchaseSuccessPage";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfService from "./TermsOfService";
import UserSettings from "./Routes/protected/UserSettings";

export default function App() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}></Route>
                <Route path="/editor" element={<Editor/>}></Route>
                <Route path="/purchase-success"  element={<SuccessPage/>}></Route>
                <Route path = "/privacy" element={<PrivacyPolicy/>}> </Route>
                <Route path = "/terms" element={<TermsOfService/>}> </Route>
                <Route path="/user-settings" element={<UserSettings/>}> </Route>
            </Routes>
            
        </BrowserRouter>
            
        </>
    )
}