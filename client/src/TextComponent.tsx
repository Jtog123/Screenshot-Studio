import { useEffect, useRef, useState } from "react"
import TextComponentGUI from "./TextComponentGUI";
import { AssetManager } from "./AssetManager";
import * as THREE from 'three'


interface TextComponentProps {
    
    position : string
    assetManager : AssetManager
    onMount : (id: string, name: string) => void
    onUnmount : (id: string) => void

}

export default function TextComponent({position, assetManager ,onMount, onUnmount} : TextComponentProps) { 
    const [componentID] = useState(`text_${Date.now()}`);
    //const textRef = useRef<HTMLDivElement>(null);
    const [showGUI, setShowGUI] = useState(false);
    const [text, setText] = useState("Type Here");
    const [fontSize, setFontSize] = useState(16);
    const[fontColor, setFontColor] = useState("#FFFFFF");
    const[backgroundColor, setBackgroundColor] = useState("#000000");
    //const[isBackgroundVisible, setIsBackgroundVisible] = useState(false);
    const[componentOpacity, setComponentOpacity ] = useState("1");
    const [borderColor, setBorderColor] = useState("#FFFFFF");
    const [borderWidth, setBorderWidth] = useState(2);
    const [borderStyle, setBorderStyle] = useState<"solid" | "dashed" | "dotted" | "none">("none");
    const [borderRadius, setBorderRadius] = useState(0);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(80);
    const [width, setWidth] = useState(150);
    const [height, setHeight] = useState(50);
    const [textSprite, setTextSprite] = useState<THREE.Sprite | null>(null);

    useEffect(() => {
        const sprite = assetManager.createTextSprite(
            componentID, text, fontSize, fontColor, backgroundColor, width, height
        );

        sprite.name = componentID;
        console.log(sprite.name);
        sprite.position.set(0,2.2,0);
        //assetManager._assetsMap.
        assetManager._assetGroup.add(sprite);
        setTextSprite(sprite);

        onMount(componentID, "Text Component");

        const handleComponentSelected = (data : any) => {
            
            if(data.id === componentID) {
                setShowGUI(true);
            }

        }

        const handleComponentDeselected = (data : any) => {
            if(data.id === componentID) {
                setShowGUI(false);
            }

        }

        assetManager.addEventListener("componentSelected", handleComponentSelected);
        assetManager.addEventListener("componentDeselected", handleComponentDeselected);

        return () => {
            assetManager._assetGroup.remove(sprite);
            onUnmount(componentID);
        }
    }, []);

    //update teh sprite when any attributes change
    useEffect(() => {
        if(textSprite) {
            assetManager.updateTextSprite(textSprite,text,fontSize,fontColor,backgroundColor,width,height);
        }
    }, [text, fontSize, fontColor, backgroundColor, width, height])



    function handleDelete() : void {
        onUnmount?.(componentID);
    }




    function handleClick() {
        console.log("displaying the gui here?");
        setShowGUI(true);
    }


    return (
        <>


        {showGUI && (
            <TextComponentGUI 
                componentID={componentID} 
                text={text} 
                fontSize={fontSize} 
                backgroundColor={backgroundColor}
                fontColor={fontColor} 
                componentOpacity={componentOpacity}
                borderColor={borderColor}  // Add
                borderWidth={borderWidth}  // Add
                borderStyle={borderStyle}  // Add
                borderRadius={borderRadius}  // Add
                posX={posX}  // Add
                posY={posY}  // Add
                width={width}  // Add
                height={height} 
                onTextChange={setText} 
                onFontSizeChange={setFontSize} 
                onBackgroundColorChange={setBackgroundColor} 
                onOpacityChange={setComponentOpacity}
                onFontColorChange={setFontColor} 
                onBorderColorChange={setBorderColor}  // Add
                onBorderWidthChange={setBorderWidth}  // Add
                onBorderStyleChange={setBorderStyle}  // Add
                onBorderRadiusChange={setBorderRadius}  // Add
                onPosXChange={setPosX}  // Add
                onPosYChange={setPosY}  // Add
                onWidthChange={setWidth}  // Add
                onHeightChange={setHeight}  // Add
                onDelete={handleDelete} 
                onClose={() => setShowGUI(false)} 
                //isBackgroundVisible={isBackgroundVisible}
                //setIsBackgroundVisible = {setIsBackgroundVisible}
  
            />
        )}
        </>

    );
}