import {BrowserRouter, Routes, Route} from "react-router"
import Editor from "./Routes/protected/Editor";
import HomePage from "./Routes/public/HomePage";
import SuccessPage from "./Routes/protected/PurchaseSuccessPage";

export default function App() {
    return (
        <>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage/>}></Route>
                <Route path="/editor" element={<Editor/>}></Route>
                <Route path="/purchase-success"  element={<SuccessPage/>}></Route>
            </Routes>
            
        </BrowserRouter>
            
        </>
    )
}