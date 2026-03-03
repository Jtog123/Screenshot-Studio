import {BrowserRouter, Routes, Route} from "react-router"
import Editor from "./Routes/protected/Editor";
import HomePage from "./Routes/public/HomePage";

export default function App() {
    return (
        <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage/>}></Route>
            <Route path="/editor" element={<Editor/>}></Route>
        </Routes>
            
        </BrowserRouter>
            
        </>
    )
}