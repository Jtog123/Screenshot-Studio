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
    //const[backgroundColor, setBackgroundColor] = useState("#00000000");
    //const[isBackgroundVisible, setIsBackgroundVisible] = useState(false);
    const [width, setWidth] = useState(150);
    const [height, setHeight] = useState(50);
    const [textSprite, setTextSprite] = useState<THREE.Sprite | null>(null);

    //create temps or use literals to pass here
    useEffect(() => {
        const sprite = assetManager.createTextSprite(
            componentID, text, fontSize, fontColor, "#000000", width, height
        );

        sprite.name = componentID;
        console.log(sprite.name);
        sprite.position.set(0,2,1);
        //assetManager._assetsMap.
        assetManager._assetGroup.add(sprite);
        setTextSprite(sprite);

        onMount(componentID, "Text Component");

        const handleComponentSelected = (data : any) => {
            if(data.id === componentID) {
                console.log("Setting showGUI to true");
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
    /*
    useEffect(() => {
        if(textSprite) {
            assetManager.updateTextSprite(textSprite,text,fontSize,fontColor,backgroundColor,width,height);
        }
    }, [text, fontSize, fontColor, backgroundColor, width, height])
    */



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
                assetManager={assetManager}
                textSprite = {textSprite as THREE.Sprite}
                onDelete={handleDelete} 
                onClose={() => {
                    setShowGUI(false);
                    assetManager.deselectComponent(componentID);
                }}


            />
        )}
        </>

    );
}

//GUI is supposed to move the sprite
//so we need to pass the sprite into the gui, that will allow us to manipulate the sprites position with Gui controls