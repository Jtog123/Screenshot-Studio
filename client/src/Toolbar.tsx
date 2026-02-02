import {useRef, useEffect, useState} from 'react'
import { JSX } from 'react'
import * as THREE from 'three'
import ToolbarHeader from './ToolbarHeader'
import ToolbarBackgroundColor from './ToolbarBackgroundColor'
import ToolBarPanelTab from './ToolbarPanelTab'
import ToolbarLightCatalog from './ToolbarLightCatalog'
import ToolbarActiveComponents from './ToolbarActiveComponents'
import DirectionalLightGUI from './DirectionalLightGUI'
import { LightManager } from './LightManager'
import { LightType } from './Light'
import SpotLightGUI from './SpotLightGUI'
import PointLightGUI from './PointLightGUI'
import RectAreaLightGUI from './RectLightGUI'
import ToolbarCameraCatalog from './ToolbarCameraCatalog'
import ToolbarAssetEditor from './ToolbarAssetEditor'
import { CameraManager } from './CameraManager'
import { AssetManager } from './AssetManager'
import { ComponentType } from './SceneComponent'
import { ImageComponentInterface } from './ComponentInterfaces'
import ImageComponentGUI from './ImageComponentGUI'
import TextComponentGUI from './TextComponentGUI'
import TextComponent from './TextComponent'




interface ToolbarProps {
    _scene : THREE.Scene;
    _lightManager : LightManager;
    _phoneModel : THREE.Group;
    _cameraManager : CameraManager;
    _imageComponents : ImageComponentInterface[];
    _setImageComponents : React.Dispatch<React.SetStateAction<ImageComponentInterface[]>>
    _textComponents : ImageComponentInterface[];
    _setTextComponents : React.Dispatch<React.SetStateAction<ImageComponentInterface[]>>
    _assetManager : AssetManager
    activeListItems : {id:string, name:string}[]
    setActiveListItems : React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    camera : THREE.PerspectiveCamera
}


export default function Toolbar({_scene, _lightManager,_phoneModel ,_cameraManager, _imageComponents, _setImageComponents, _textComponents, _setTextComponents,  _assetManager,activeListItems, setActiveListItems, camera} : ToolbarProps) {

    
    const[selectedLight, setSelectedLight] = useState<{id: string, type: LightType} | null>(null);
    const[selectedComponent, setSelectedComponent] = useState<{id: string, type: ComponentType} | null>(null);

    //const[toolbarClasses, setToolbarClasses] = useState<string>("fixed flex flex-col h-[100%] w-[25%] bg-blue-200 z-10 right-0");
    const[isToolbarToggled, setToolbarToggled] = useState(false);
    //const[activeListItems, setActiveListItems] = useState<{id:string, name:string}[]>([]);
    const[activeTab, setActiveTab] = useState("Lights");


    function handleToggle() : void {
        setToolbarToggled(!isToolbarToggled);
    }

    function handleTabChange(buttonName : string) : void {
        setActiveTab(buttonName);
        console.log("click button" , buttonName);
    }


    useEffect(() => {
        _lightManager.addEventListener("lightSelected", (data: { id: string, type: LightType }) => {
            setSelectedLight({id: data.id, type: data.type});
            //setGUIWindow(true); 
        });

        _lightManager.addEventListener("lightDeselected", (data: {id: string}) => {
            setSelectedLight(null);
            //setGUIWindow(false);
        });

        _assetManager.addEventListener("componentSelected", (data: {id: string, type:ComponentType}) => {
            setSelectedComponent({id: data.id, type:data.type})
        });

        _assetManager.addEventListener("componentDeselected", (data: {id: string, type:ComponentType}) => {
            setSelectedComponent(null);
        });

        
    }, [_lightManager, _assetManager]);
    

    /*
    Every time we create an item in the scene we will create a list item for it
    and append it into a container that sores all our active scene items
    we will then render it out here

    the toolbar will hold a container of activesceneitems
    we will pass it to lightcatalog, to create the items
    and activecomponents to display them


    the id of the light is actually the name of the helper

    */
    return (
        <>  
            {
                (
                    isToolbarToggled ? 
                        <div className="fixed h-screen bg-stone-950 text-white z-20 right-0 w-[5%] transition-all duration-300 ease-in-out">
                            <ToolbarHeader isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>
                            <ToolbarBackgroundColor isToolbarToggled={isToolbarToggled}  scene={_scene}/> 
                            <ToolBarPanelTab isToolbarToggled={isToolbarToggled} activeTab={activeTab} handleTabChange={handleTabChange} />
                            <ToolbarLightCatalog activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled} scene={_scene} lightManager={_lightManager}/>
                            <ToolbarActiveComponents activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled} lightManager={_lightManager} assetManager={_assetManager} />

                            {/*Toolbar Panel Selector*/}
                        </div>
                        :
                        <div className="fixed flex flex-col h-[100%] w-[25%] bg-stone-950 z-20 right-0 transition-all duration-300 ease-in-out">
                            <ToolbarHeader isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>
                            <ToolbarBackgroundColor isToolbarToggled={isToolbarToggled} scene={_scene}/> 
                            <ToolBarPanelTab isToolbarToggled={isToolbarToggled} activeTab={activeTab} handleTabChange={handleTabChange} />
                            {activeTab === "Lights" && <ToolbarLightCatalog  activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled}  scene={_scene} lightManager={_lightManager}/>}
                            {activeTab === "Camera" && <ToolbarCameraCatalog isToolbarToggled={isToolbarToggled} _cameraManager={_cameraManager} _phoneModel={_phoneModel}/>}
                            {activeTab === "Text" && <ToolbarAssetEditor imageComponents={_imageComponents} setImageComponents={_setImageComponents} textComponents={_textComponents} setTextComponents={_setTextComponents} isToolbarToggled={isToolbarToggled} />}
                            <ToolbarActiveComponents activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled} lightManager={_lightManager} assetManager={_assetManager}  />

                            {/*Toolbar Panel Selector*/}
                        </div>
                )
                
            }
            
            {
                selectedLight?.type === LightType.DirectionalLight && (
                    <DirectionalLightGUI key={selectedLight.id} _lightID={selectedLight.id} _lightManager={_lightManager}/>) ||
                selectedLight?.type === LightType.SpotLight && (
                    <SpotLightGUI key={selectedLight.id} _lightID={selectedLight.id} _lightManager={_lightManager} /> ) ||
                selectedLight?.type === LightType.PointLight && (
                    <PointLightGUI key={selectedLight.id} _lightID={selectedLight.id} _lightManager={_lightManager}/>) ||
                selectedLight?.type === LightType.RectAreaLight && (
                    <RectAreaLightGUI key={selectedLight.id} _lightID={selectedLight.id} _lightManager={_lightManager}/>
                )
                  
            }

            {
                selectedComponent?.type === ComponentType.Image && (
                    <ImageComponentGUI key={selectedComponent.id} _componentID={selectedComponent.id} _assetManager={_assetManager} />) ||

                selectedComponent?.type === ComponentType.Text && (
                    <TextComponentGUI key={selectedComponent.id} _componentID={selectedComponent.id} _assetManager={_assetManager} />
                )


            }

           
        </>
    )
}

