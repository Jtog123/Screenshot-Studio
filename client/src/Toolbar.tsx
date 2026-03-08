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
import { ImageComponentInterface, TextComponentInterface, ScreenTextureInterface, CapturedImage } from './ComponentInterfaces'
import ImageComponentGUI from './ImageComponentGUI'
import TextComponentGUI from './TextComponentGUI'
import TextComponent from './TextComponent'
import { GradientBackground } from './GradientBackground'
import ToolbarBgAndLightingCard from './ToolbarBgAndLightingCard'
import ToolbarImgAndTextCard from './ToolbarImgAndTxtCard'
import ToolbarCameraCard from './ToolbarCameraCard'
import ToolbarFooter from './ToolbarFooter'




interface ToolbarProps {
    _scene : THREE.Scene;
    _lightManager : LightManager;
    _phoneModel : THREE.Group;
    _cameraManager : CameraManager;
    _imageComponents : ImageComponentInterface[];
    _setImageComponents : React.Dispatch<React.SetStateAction<ImageComponentInterface[]>>
    _assetManager : AssetManager
    activeListItems : {id:string, name:string}[]
    setActiveListItems : React.Dispatch<React.SetStateAction<{ id: string; name: string; }[]>>
    addTextComponent : () => void
    camera : THREE.PerspectiveCamera
    _gradientBackground : GradientBackground
    _phoneScreen : THREE.Mesh
    capturedImages : CapturedImage[]
    setCapturedImages : React.Dispatch<React.SetStateAction<CapturedImage[]>>
    //screenTextures : ScreenTextureInterface[]
    //setScreenTextures : React.Dispatch<React.SetStateAction<ScreenTextureInterface[]>>
}


export default function Toolbar({_scene, _lightManager,_phoneModel ,_cameraManager, _imageComponents, _setImageComponents,  _assetManager,activeListItems, setActiveListItems, addTextComponent ,camera, _gradientBackground, _phoneScreen, capturedImages, setCapturedImages} : ToolbarProps) { //screenTextures, setScreenTextures

    
    const[selectedLight, setSelectedLight] = useState<{id: string, type: LightType} | null>(null);
    const[selectedComponent, setSelectedComponent] = useState<{id: string, type: ComponentType} | null>(null);

    const[isToolbarToggled, setToolbarToggled] = useState(false);



    function handleToggle() : void {
        setToolbarToggled(!isToolbarToggled);
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
                        <div className="fixed flex flex-col h-screen bg-cream-vanilla text-stone-300 z-19 right-0 w-[5%] transition-all duration-300 ease-in-out ">
                            <ToolbarHeader isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>
                                <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden '>

                                    <ToolbarBgAndLightingCard scene={_scene} isToolbarToggled={isToolbarToggled} gradientBackground={_gradientBackground}
                                    activeListItems={activeListItems} setActiveListItems={setActiveListItems}   lightManager={_lightManager}/>
                                    
                                
                                    <ToolbarImgAndTextCard imageComponents={_imageComponents} setImageComponents={_setImageComponents} isToolbarToggled={isToolbarToggled} addTextComponent={addTextComponent} _phoneScreen={_phoneScreen} _assetManager={_assetManager} capturedImages={capturedImages} setCapturedImages={setCapturedImages} />

                                    <ToolbarCameraCard isToolbarToggled={isToolbarToggled} _cameraManager={_cameraManager} _phoneModel={_phoneModel}/>
                                
                                </div>
                            
                            <div className='h-40px] w-[100%]'></div>
                            <ToolbarFooter isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>
                            

                            {/*Toolbar Panel Selector*/}
                        </div>
                        :
                        <div className="fixed flex flex-col flex-1 min-h-0 bg-cream-vanilla w-[20%] h-[100%] z-19 right-0 transition-all duration-300 ease-in-out z-19  ">
                            <ToolbarHeader isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>
                            <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden '>

                                <ToolbarBgAndLightingCard scene={_scene} isToolbarToggled={isToolbarToggled} gradientBackground={_gradientBackground}
                                activeListItems={activeListItems} setActiveListItems={setActiveListItems}   lightManager={_lightManager}/>
                                
                               
                                <ToolbarImgAndTextCard imageComponents={_imageComponents} setImageComponents={_setImageComponents} isToolbarToggled={isToolbarToggled} addTextComponent={addTextComponent} _phoneScreen={_phoneScreen} _assetManager={_assetManager} capturedImages={capturedImages} setCapturedImages={setCapturedImages} />

                                <ToolbarCameraCard isToolbarToggled={isToolbarToggled} _cameraManager={_cameraManager} _phoneModel={_phoneModel}/>
                                
                            </div>
                            

    
                            <ToolbarActiveComponents activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled} lightManager={_lightManager} assetManager={_assetManager}  />
                            
                            <ToolbarFooter isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>

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
                    <ImageComponentGUI key={selectedComponent.id} _componentID={selectedComponent.id} _assetManager={_assetManager} />) 
            }


           
        </>
    )
}

