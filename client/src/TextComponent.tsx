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
    const [textSprite, setTextSprite] = useState<THREE.Sprite | null>(null);
    const [localFont, setLocalFont] = useState("Roboto");

    //create temps or use literals to pass here
    useEffect(() => {
        const initTextSprite = async() => {
            const sprite = await assetManager.createTextSprite(
            componentID, "Type Here", 16, "#FFFFFF", "1", localFont);

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
                    const component = assetManager.getComponent(componentID);
                    if(component?._textConfig?.fontFamily) {
                        setLocalFont(component._textConfig.fontFamily);
                    };
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
        } ;

        initTextSprite()



        return () => {
            if(textSprite) {
                assetManager._assetGroup.remove(textSprite);
            }
        
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



    return (
        <>


        {showGUI && (
            <TextComponentGUI 
                componentID={componentID} 
                assetManager={assetManager}
                textSprite = {textSprite as THREE.Sprite}
                selectedTextGUIFont={localFont} // ✅ Pass local font
                setSelectedTextGUIFont={setLocalFont} // ✅ Set local font
                fonts={['Roboto', 'Open Sans', 'Playfair Display', 'Inter', 'Lato']}
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