import { useState } from "react"
import { GradientBackground } from "./GradientBackground"

interface GradientBackgroundSelectorProps {
    gradientBackground : GradientBackground
}


export default function GradientBackgroundSelector({gradientBackground} : GradientBackgroundSelectorProps) {
    const[color1 , setColor1] = useState("#FF0000");
    const[color2 , setColor2] = useState("#0000FF");

    function handleColor1Change(e : React.ChangeEvent<HTMLInputElement>) : void {
        const newColor = e.target.value;
        setColor1(newColor);
        gradientBackground.updateGradientColors(newColor,color2);
    }

    function handleColor2Change(e : React.ChangeEvent<HTMLInputElement>) : void {
        const newColor = e.target.value;
        setColor2(newColor);
        gradientBackground.updateGradientColors(color1,newColor);
    }

    return (
        <>
            <div className="flex">
                <input type="color" name="" id="" value={color1} onChange={handleColor1Change}/>
                <label htmlFor=""> to</label>
                <input type="color" name="" id="" value={color2} onChange={handleColor2Change}/>
            </div>
        </>
    )
}