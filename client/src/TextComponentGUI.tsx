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

export default function TextComponentGUI({componentID, assetManager,  textSprite,onDelete, onClose}:        TextComponentGUIProps) {

    const [isDragging, setIsDragging] = useState(false);
    const offset = useRef({x:0, y:0});
    const [guiPosition, setGuiPosition] = useState({x: 100, y: 100});

    const [text, setText] = useState("Type Here");
    const [fontSize, setFontSize] = useState(16);
    const [fontColor, setFontColor] = useState("#FFFFFF");
    const [backgroundColor, setBackgroundColor] = useState("#000000");
    const [componentOpacity, setComponentOpacity] = useState("1");
    const [borderColor, setBorderColor] = useState("#FFFFFF");
    const [borderWidth, setBorderWidth] = useState(2);
    const [borderStyle, setBorderStyle] = useState<"solid" | "dashed" | "dotted" | "none">("none");
    const [borderRadius, setBorderRadius] = useState(0);
    const [posX, setPosX] = useState(0);
    const [posY, setPosY] = useState(2.2);
    const [posZ, setPosZ] = useState(0);
    const [width, setWidth] = useState(150);
    const [height, setHeight] = useState(50);

    useEffect(() => {
        if(textSprite) {
            setPosX(textSprite.position.x);
            //textSprite.position.x = posX;
            textSprite.position.y = posY;
            textSprite.position.z = posZ;
            setComponentOpacity(String(textSprite.material.opacity));
        }
    },[]);

    //update when these values change
    useEffect(() => {
        if (textSprite) {
            assetManager.updateTextSprite(textSprite, text, fontSize, fontColor, backgroundColor, width, height);
            //textSprite.position.set(posX, posY, posZ);
            textSprite.material.opacity = Number(componentOpacity);
        }
    }, [text, fontSize, fontColor, backgroundColor, width, height, componentOpacity]);

    
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

    function handlePosXChange(e: React.ChangeEvent<HTMLInputElement>) : void {
        console.log("moving pos x",e.target.value);
        //set in threejs
        textSprite.position.x = Number(e.target.value);

        //update the state
        setPosX(Number(e.target.value));
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
                                        <label className="text-xs text-stone-300">X: {posX}px</label>
                                        <input type="range" min="-5" max="5" value={posX} step={"0.1"}
                                            onChange={handlePosXChange}
                                            className="w-full h-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300">Y: {posY}px</label>
                                        <input type="range" min="0" max="600" value={posY}
                                            onChange={() => console.log("hehe")}
                                            className="w-full h-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300">W: {width}px</label>
                                        <input type="range" min="50" max="500" value={width}
                                            onChange={() => console.log("hehe")}
                                            className="w-full h-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300">H: {height}px</label>
                                        <input type="range" min="30" max="300" value={height}
                                            onChange={() => console.log("hehe")}
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
                                {/* Font Size */}
                                <div>
                                    <label className="text-xs text-stone-300 block mb-1">Font Size: {fontSize}px</label>
                                    <input type="range" min="6" max="72" value={fontSize}
                                        onChange={() => console.log("hehe")}
                                        className="w-full" />
                                </div>

                                {/* Colors in a row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-stone-300">Font</label>
                                        <input type="color" value={fontColor} 
                                            onChange={() => console.log("hehe")}
                                            className="w-10 h-10 cursor-pointer" />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-xs text-stone-300">Background</label>
                                        <input type="color" value={backgroundColor} 
                                            onChange={() => console.log("hehe")}
                                            className="w-10 h-10 cursor-pointer" />

                                        <div className="flex">
                                            <label className="text-xs text-stone-300 mr-2" htmlFor="">Transparent</label>
                                            {/* toggling works but also need to toggle checkbox */}
                                            <input type="checkbox" name="" id=""   />
                                        </div>
 
                                    </div>
                                </div>

                                {/* Opacity */}
                                <div>
                                    <label className="text-xs text-stone-300 block mb-1">Opacity: {componentOpacity}</label>
                                    <input type="range" min="0" max="1" step="0.01" value={componentOpacity}
                                        onChange={() => console.log("hehe")}
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
                                        <select value={borderStyle}
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
                                            <input type="color" value={borderColor} 
                                                onChange={() => console.log("hehe")}
                                                className="w-full h-7 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                {/* Width and radius */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-stone-300 block mb-1">Width: {borderWidth}px</label>
                                        <input type="range" min="0" max="10" value={borderWidth}
                                            onChange={() => console.log("hehe")}
                                            className="w-full" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300 block mb-1">Radius: {borderRadius}px</label>
                                        <input type="range" min="0" max="50" value={borderRadius}
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