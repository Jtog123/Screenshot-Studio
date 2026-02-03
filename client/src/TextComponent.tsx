import { useEffect, useRef, useState } from "react"


interface TextComponentProps {
    position : string
    onMount : (id: string, name: string) => void
    onUnmount : (id: string) => void


}

export default function TextComponent({position, onMount, onUnmount} : TextComponentProps) { 
    const [componentID] = useState(`text_${Date.now()}`);
    const textRef = useRef<HTMLDivElement>(null);
    const [showGUI, setShowGUI] = useState(false);

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

    }

    function handleClick() {
        console.log("displaying the gui here?");
        //onSelect(textID);
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