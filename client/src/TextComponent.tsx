import { useRef, useState } from "react"

export default function TextComponent() { 
    const textRef = useRef<HTMLDivElement>(null);


    function handleBlur(e: React.FormEvent<HTMLDivElement>) {
        const text = textRef.current?.textContent || ""
    }

    function handleClick(e: React.MouseEvent<HTMLDivElement, MouseEvent>, textID : string) {
        console.log(e,"displaying the gui here?");
    }

    return (
        <div 
            ref={textRef}
            contentEditable
            onBlur={handleBlur}
            onClick= {(e) => handleClick(e, "hh")}
            suppressContentEditableWarning
            className="fixed left-1/2 transform px-2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-auto bg-transparent border-2 border-dashed border-white text-white z-50 cursor-text top-20"
        >
            Type Here
        </div>
    );
}