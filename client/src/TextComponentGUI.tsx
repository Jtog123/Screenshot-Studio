import { AssetManager } from "./AssetManager";
import { SceneComponent } from "./SceneComponent";
import {useRef, useEffect, useState, ChangeEvent} from 'react'
import { TextComponentInterface } from "./ComponentInterfaces";
import * as THREE from 'three'

interface TextComponentGUIProps {
    componentID: string;
    assetManager: AssetManager;
    textSprite: THREE.Sprite;
    onDelete: () => void;
    onClose: () => void;
}



export default function TextComponentGUI({componentID, assetManager,  textSprite, onDelete, onClose}:        TextComponentGUIProps) {

    const component = assetManager.getComponent(componentID);

    const [isDragging, setIsDragging] = useState(false);
    const offset = useRef({x:0, y:0});
    const [guiPosition, setGuiPosition] = useState({x: 100, y: 100});

    const [spriteInnerText, setSpriteInnerText] = useState(
        component?._textConfig?.text ?? "Type Here"
    );

    const [spriteFontSize, setSpriteFontSize] = useState(16);
    const [spriteFontColor, setSpriteFontColor] = useState("#FFFFFF");
    //const [spriteBackgroundColor, setSpriteBackgroundColor] = useState("#000000");
    const previousColorRef = useRef("#000000")

    const [spriteOpacity, setSpriteOpacity] = useState("1");
    const [spriteBorderColor, setSpriteBorderColor] = useState("#FFFFFF");
    const [spriteBorderWidth, setSpriteBorderWidth] = useState(2);
    const [spriteBorderStyle, setSpriteBorderStyle] = useState<"solid" | "dashed" | "dotted" | "none">("none");
    const [spriteBorderRadius, setSpriteBorderRadius] = useState(0);
    const[spritePosition, setSpritePosition] = useState({
        x: 0,
        y: 2.2,
    });



    useEffect(() => {
        if(textSprite) {
            setSpritePosition({
                x: textSprite.position.x,
                y: textSprite.position.y,
            })
            //setPosX(textSprite.position.x);
            //textSprite.position.x = posX;
            //textSprite.position.y = posY;
            //textSprite.position.z = posZ;
            setSpriteOpacity(String(textSprite.material.opacity));

            const component = assetManager.getComponent(componentID);
            if(component?._textConfig) {
                setSpriteInnerText(component?._textConfig?.text);
                setSpriteFontSize(component?._textConfig?.fontSize);
                setSpriteFontColor(component?._textConfig?.fontColor);
            }

        }
    },[]);

    //update when these values change
    useEffect(() => {

        if (textSprite) {
            assetManager.updateTextSprite(textSprite, spriteInnerText, spriteFontSize, spriteFontColor, );
            //textSprite.position.set(posX, posY, posZ);
            textSprite.material.opacity = Number(spriteOpacity);


            assetManager.updateTextSprite(textSprite, spriteInnerText, spriteFontSize, spriteFontColor);
        }
    }, [spriteInnerText, spriteFontSize, spriteFontColor ,textSprite ,spriteOpacity]);

    
    // Collapsible sections state
    const [expandedSections, setExpandedSections] = useState({
        position: true,
        appearance: true,
        border: false
    });

    function toggleSection(section: keyof typeof expandedSections) {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }

    function handleMouseDown(e: React.MouseEvent): void {
        setIsDragging(true);
        offset.current = {
            x: e.clientX - guiPosition.x,
            y: e.clientY - guiPosition.y
        };
        e.preventDefault()
    }


    useEffect(() => {
        function handleMouseMove(e: MouseEvent): void {
            if(!isDragging) return;
            const newX = e.clientX - offset.current.x
            const newY = e.clientY - offset.current.y
            setGuiPosition({x: newX, y: newY});
        }

        function handleMouseUp() {
            setIsDragging(false);
        }

        if(isDragging) {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        }

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        }
    }, [isDragging]);


    function handleSpritePositionChange(e: React.ChangeEvent<HTMLInputElement>, sliderName : string) : void {
        const moveValue = Number(e.target.value);
        if(sliderName === "xPosSlider") {
            setSpritePosition({
                x: moveValue,
                y: spritePosition.y,
            });
            //set in threejs
            textSprite.position.x = moveValue;
        } else if(sliderName === "yPosSlider") {
            setSpritePosition({
                x: spritePosition.x,
                y: moveValue,
            });
            //set in threejs
            textSprite.position.y = moveValue;            
        } 

    }






    return (
        <>
            <div 
                style={{transform: `translate(${guiPosition.x}px, ${guiPosition.y}px)`}}
                className="absolute rounded-xl right-[800px] top-[200px] w-[320px] max-h-auto overflow-y-auto bg-stone-950 pb-3 z-50 backdrop-blur-md border border-stone-600 shadow-[0_0_20px_rgba(120,113,108,0.3)] ring-1 ring-stone-700/50"
            >
                {/* Header */}
                <div 
                    onMouseDown={handleMouseDown} 
                    className="sticky top-0 flex items-center justify-between cursor-move bg-stone-700/30 w-full py-2 px-4 z-10"
                >
                    <h1 className="text-stone-200 text-base font-medium">Text Component</h1>
                    <button onClick={onClose} className="rounded px-2 py-1 bg-red-500 text-white text-sm hover:bg-red-600">
                        ✕
                    </button>
                </div>

                <div className="px-4 py-2 space-y-2">

                    {/* TEXT INPUT */}
                    <div>
                        <label className="text-xs text-stone-300 block mb-1">Text Content</label>
                        <textarea 
                            value={spriteInnerText}
                            onChange={(e) => setSpriteInnerText(e.target.value)}
                            className="w-full px-2 py-1 bg-stone-800 text-stone-200 rounded text-sm border border-stone-600 focus:border-stone-400 focus:outline-none resize-none"
                            placeholder="Enter text... (Press Enter for new line)"
                            rows={3}
                        />
                    </div>
                    
                    {/* POSITION & SIZE SECTION */}
                    <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleSection('position')}
                            className="w-full flex justify-between items-center px-3 py-2 bg-stone-800/50 hover:bg-stone-800 text-stone-200 text-sm"
                        >
                            <span>Position & Size</span>
                            <span>{expandedSections.position ? '▼' : '▶'}</span>
                        </button>
                        
                        {expandedSections.position && (
                            <div className="p-3 space-y-2 bg-stone-900/30">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-stone-300">X: {spritePosition.x}</label>
                                        <input type="range" min="-5" max="5" value={spritePosition.x} step={"0.1"}
                                            onChange={(e) => handleSpritePositionChange(e, "xPosSlider")}
                                            className="w-full h-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300">Y: {spritePosition.y}</label>
                                        <input type="range" min="-5" max="5" value={spritePosition.y} step={"0.1"}
                                            onChange={(e) => handleSpritePositionChange(e, "yPosSlider")}
                                            className="w-full h-1" />
                                    </div>

                                </div>
                            </div>
                        )}
                    </div>

                    {/* APPEARANCE SECTION */}
                    <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleSection('appearance')}
                            className="w-full flex justify-between items-center px-3 py-2 bg-stone-800/50 hover:bg-stone-800 text-stone-200 text-sm"
                        >
                            <span>Appearance</span>
                            <span>{expandedSections.appearance ? '▼' : '▶'}</span>
                        </button>
                        
                        {expandedSections.appearance && (
                            <div className="p-3 space-y-3 bg-stone-900/30">

                                {/* Colors in a row */}
                                <div className="grid grid-cols-1 gap-3 ">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-stone-300">Font</label>
                                        <input type="color" value={spriteFontColor} 
                                            onChange={(e) => setSpriteFontColor(e.target.value)}
                                            className="w-10 h-10 cursor-pointer" />
                                    </div>
   
                                </div>
                                {/* Font Size */}
                                <div>
                                    <label className="text-xs text-stone-300 block mb-1">Font Size: {spriteFontSize}</label>
                                    <input type="range" min="6" max="72" value={spriteFontSize}
                                        onChange={(e) => setSpriteFontSize(Number(e.target.value))}
                                        className="w-full" />
                                </div>



                                {/* Opacity */}
                                <div>
                                    <label className="text-xs text-stone-300 block mb-1">Opacity: {spriteOpacity}</label>
                                    <input type="range" min="0" max="1" step="0.01" value={spriteOpacity}
                                        onChange={(e) => setSpriteOpacity(e.target.value)}
                                        className="w-full" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* BORDER SECTION */}
                    <div className="border border-stone-700 rounded-lg overflow-hidden">
                        <button 
                            onClick={() => toggleSection('border')}
                            className="w-full flex justify-between items-center px-3 py-2 bg-stone-800/50 hover:bg-stone-800 text-stone-200 text-sm"
                        >
                            <span>Border & Corners</span>
                            <span>{expandedSections.border ? '▼' : '▶'}</span>
                        </button>
                        
                        {expandedSections.border && (
                            <div className="p-3 space-y-3 bg-stone-900/30">
                                {/* Border style and color in a row */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-stone-300 block mb-1">Style</label>
                                        <select value={spriteBorderStyle}
                                            onChange={() => console.log("hehe")}
                                            className="w-full px-2 py-1 bg-stone-800 text-stone-200 rounded text-xs">
                                            <option value="none">None</option>
                                            <option value="solid">Solid</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="dotted">Dotted</option>
                                        </select>
                                    </div>
                                    <div className="flex items-end gap-2">
                                        <div className="flex-1">
                                            <label className="text-xs text-stone-300 block mb-1">Color</label>
                                            <input type="color" name="" id="" />
                                        </div>
                                    </div>
                                </div>

                                {/* Width and radius */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-stone-300 block mb-1">Width: {spriteBorderWidth}px</label>
                                        <input type="range" min="0" max="10" value={spriteBorderWidth}
                                            onChange={() => console.log("hehe")}
                                            className="w-full" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300 block mb-1">Radius: {spriteBorderRadius}px</label>
                                        <input type="range" min="0" max="50" value={spriteBorderRadius}
                                            onChange={() => console.log("hehe")}
                                            className="w-full" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </>
    )
}