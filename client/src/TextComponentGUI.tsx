import { AssetManager } from "./AssetManager";
import { SceneComponent } from "./SceneComponent";
import {useRef, useEffect, useState, ChangeEvent} from 'react'
import { TextComponentInterface } from "./ComponentInterfaces";
import * as THREE from 'three'

interface TextComponentGUIProps {
    componentID: string;
    text: string;
    backgroundColor: string;
    fontSize: number;
    fontColor: string;
    componentOpacity: string;
    borderColor: string;
    borderWidth: number;
    borderStyle: "solid" | "dashed" | "dotted" | "none";
    borderRadius: number;
    onTextChange: (text: string) => void;
    onFontSizeChange: (size: number) => void;
    onBackgroundColorChange: (color: string) => void;
    onOpacityChange: (opacity: string) => void;
    onFontColorChange: (color: string) => void;
    onBorderColorChange: (color: string) => void;
    onBorderWidthChange: (width: number) => void;
    onBorderStyleChange: (style: "solid" | "dashed" | "dotted" | "none") => void;
    onBorderRadiusChange: (radius: number) => void;
    onDelete: () => void;
    onClose: () => void;
    posX: number;
    posY: number;
    width: number;
    height: number;
    onPosXChange: (x: number) => void;
    onPosYChange: (y: number) => void;
    onWidthChange: (width: number) => void;
    onHeightChange: (height: number) => void;
    isBackgroundVisible : boolean;
    setIsBackgroundVisible: (isVisible : boolean) => void;
}

export default function TextComponentGUI({
        componentID, text, backgroundColor, fontSize, fontColor, componentOpacity,
        borderColor, borderWidth, borderStyle, borderRadius,
        onTextChange, onFontSizeChange, onBackgroundColorChange, onOpacityChange, onFontColorChange,
        onBorderColorChange, onBorderWidthChange, onBorderStyleChange, onBorderRadiusChange,
        onDelete, onClose, posX, posY, width, height, onPosXChange, onPosYChange, onWidthChange, onHeightChange, isBackgroundVisible, setIsBackgroundVisible
    }: TextComponentGUIProps) {

    const [isDragging, setIsDragging] = useState(false);
    const offset = useRef({x:0,y:0});
    const [guiPosition, setGuiPosition] = useState({x: 100, y: 100});
    
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

    function handleBackgroundToggle() : void {
        setIsBackgroundVisible(!isBackgroundVisible);
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
                                        <input type="range" min="-300" max="300" value={posX}
                                            onChange={(e) => onPosXChange(Number(e.target.value))}
                                            className="w-full h-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300">Y: {posY}px</label>
                                        <input type="range" min="0" max="600" value={posY}
                                            onChange={(e) => onPosYChange(Number(e.target.value))}
                                            className="w-full h-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300">W: {width}px</label>
                                        <input type="range" min="50" max="500" value={width}
                                            onChange={(e) => onWidthChange(Number(e.target.value))}
                                            className="w-full h-1" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300">H: {height}px</label>
                                        <input type="range" min="30" max="300" value={height}
                                            onChange={(e) => onHeightChange(Number(e.target.value))}
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
                                        onChange={(e) => onFontSizeChange(Number(e.target.value))}
                                        className="w-full" />
                                </div>

                                {/* Colors in a row */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2">
                                        <label className="text-xs text-stone-300">Font</label>
                                        <input type="color" value={fontColor} 
                                            onChange={(e) => onFontColorChange(e.target.value)}
                                            className="w-10 h-10 cursor-pointer" />
                                    </div>
                                    <div className="flex flex-col items-center gap-2">
                                        <label className="text-xs text-stone-300">Background</label>
                                        <input type="color" value={backgroundColor} 
                                            onChange={(e) => onBackgroundColorChange(e.target.value)}
                                            className="w-10 h-10 cursor-pointer" />

                                        <div className="flex">
                                            <label className="text-xs text-stone-300 mr-2" htmlFor="">Transparent</label>
                                            {/* toggling works but also need to toggle checkbox */}
                                            <input type="checkbox" name="" id="" checked={!isBackgroundVisible} onChange={handleBackgroundToggle} />
                                        </div>
 
                                    </div>
                                </div>

                                {/* Opacity */}
                                <div>
                                    <label className="text-xs text-stone-300 block mb-1">Opacity: {componentOpacity}</label>
                                    <input type="range" min="0" max="1" step="0.01" value={componentOpacity}
                                        onChange={(e) => onOpacityChange(e.target.value)}
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
                                            onChange={(e) => onBorderStyleChange(e.target.value as any)}
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
                                                onChange={(e) => onBorderColorChange(e.target.value)}
                                                className="w-full h-7 cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                {/* Width and radius */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-xs text-stone-300 block mb-1">Width: {borderWidth}px</label>
                                        <input type="range" min="0" max="10" value={borderWidth}
                                            onChange={(e) => onBorderWidthChange(Number(e.target.value))}
                                            className="w-full" />
                                    </div>
                                    <div>
                                        <label className="text-xs text-stone-300 block mb-1">Radius: {borderRadius}px</label>
                                        <input type="range" min="0" max="50" value={borderRadius}
                                            onChange={(e) => onBorderRadiusChange(Number(e.target.value))}
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