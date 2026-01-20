import { LightManager } from "./LightManager";

interface DirectionalLightGUIProps {
    _lightID : string;
    _lightManager  : LightManager

}

//copy gui code
export default function DirectionalLightGUI({_lightID, _lightManager} : DirectionalLightGUIProps) {
    return (
        <>
            <div className="fixed w-[200px] h-[200px] bg-red-200 z-50">
                hello
            </div>
        </>
    )

}