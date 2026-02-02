import { useRef, useState } from "react"


interface ImageComponentProps {
    position : string
    textID : string
    onSelect : (id: string) => void
    activeListItems: {id:string, name:string}[]
    setActiveListItems: React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>


}

export default function TextComponent({position, textID, onSelect, activeListItems, setActiveListItems} : ImageComponentProps) { 
    const textRef = useRef<HTMLDivElement>(null);


    function handleBlur(e: React.FormEvent<HTMLDivElement>) {
        const text = textRef.current?.textContent || ""
    }

    function handleClick() {
        console.log("displaying the gui here?");
        onSelect(textID);
    }

    return (
        <div 
            ref={textRef}
            contentEditable
            onBlur={handleBlur}
            onClick= {handleClick}
            suppressContentEditableWarning
            className="fixed left-1/2 transform px-2 -translate-x-1/2 -translate-y-1/2 w-[150px] h-auto bg-transparent border-2 border-dashed border-white text-white z-50 cursor-text top-20"
        >
            Type Here
        </div>
    );
}