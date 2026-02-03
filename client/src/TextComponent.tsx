import { useEffect, useRef, useState } from "react"
import TextComponentGUI from "./TextComponentGUI";


interface TextComponentProps {
    position : string
    onMount : (id: string, name: string) => void
    onUnmount : (id: string) => void


}

export default function TextComponent({position, onMount, onUnmount} : TextComponentProps) { 
    const [componentID] = useState(`text_${Date.now()}`);
    const textRef = useRef<HTMLDivElement>(null);
    const [showGUI, setShowGUI] = useState(false);
    const [text, setText] = useState("Type Here");
    const [fontSize, setFontSize] = useState(16);
    const[fontColor, setFontColor] = useState("#FFFFFF");
    const[backgroundColor, setBackgroundColor] = useState("#000000");
    const[isBackgroundVisible, setIsBackgroundVisible] = useState(false);
    const[componentOpacity, setComponentOpacity ] = useState("1");
    const [borderColor, setBorderColor] = useState("#FFFFFF");
    const [borderWidth, setBorderWidth] = useState(2);
    const [borderStyle, setBorderStyle] = useState<"solid" | "dashed" | "dotted" | "none">("none");
    const [borderRadius, setBorderRadius] = useState(0);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(80);
    const [width, setWidth] = useState(150);
    const [height, setHeight] = useState(50);

    useEffect(() => {
        onMount?.(componentID, "Text Component");

        return () => {
            onUnmount?.(componentID);
        }
    }, []);


    function handleDelete() : void {
        onUnmount?.(componentID);
    }


    function handleBlur(e: React.FormEvent<HTMLDivElement>) {
        const text = textRef.current?.textContent || "";
        setText(text);

    }

    function handleClick() {
        console.log("displaying the gui here?");
        setShowGUI(true);
    }

    return (
        <>
        <div 
            ref={textRef}
            contentEditable
            onBlur={handleBlur}
            onClick= {handleClick}
            suppressContentEditableWarning
            className="fixed left-1/2 transform px-2 -translate-x-1/2 -translate-y-1/2 w-auto h-auto bg-transparent text-white z-50 cursor-text top-20"
            style={{
                fontSize:`${fontSize}px`,
                color: fontColor,
                backgroundColor : isBackgroundVisible ? backgroundColor : "transparent",
                opacity: componentOpacity,
                border: `${borderWidth}px ${borderStyle} ${borderColor}`,  
                borderRadius: `${borderRadius}px` ,
                left: `calc(50% + ${posX}px)`,  // Add
                top: `${posY}px`,  // Add
                width: `${width}px`,  // Add
                minHeight: `${height}px` 
            }}
        
        >
            {text}
        </div>

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
                isBackgroundVisible={isBackgroundVisible}
                setIsBackgroundVisible = {setIsBackgroundVisible}
  
            />
        )}
        </>

    );
}