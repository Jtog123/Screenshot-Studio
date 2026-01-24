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

interface ToolbarProps {
    _scene : THREE.Scene;
    _lightManager : LightManager;

}



export default function Toolbar({_scene, _lightManager} : ToolbarProps) {

    
    const[selectedLight, setSelectedLight] = useState<{id: string, type: LightType} | null>(null);
    //const[toolbarClasses, setToolbarClasses] = useState<string>("fixed flex flex-col h-[100%] w-[25%] bg-blue-200 z-10 right-0");
    const[isToolbarToggled, setToolbarToggled] = useState(false);
    const[activeListItems, setActiveListItems] = useState<{id:string, name:string}[]>([]);
    //const[isGUIWindowOpen, setGUIWindow] = useState<boolean>(false);

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
        })

        
    }, [_lightManager])
    

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
                        <div className="fixed h-screen bg-stone-950 text-white z-[1000] right-0 w-[5%] transition-all duration-300 ease-in-out">
                            <ToolbarHeader isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>
                            <ToolbarBackgroundColor isToolbarToggled={isToolbarToggled}  scene={_scene}/> 
                            <ToolBarPanelTab isToolbarToggled={isToolbarToggled} />
                            <ToolbarLightCatalog activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled} scene={_scene} lightManager={_lightManager}/>
                            <ToolbarActiveComponents activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled} lightManager={_lightManager} />

                            {/*Toolbar Panel Selector*/}
                        </div>
                        :
                        <div className="fixed flex flex-col h-[100%] w-[25%] bg-stone-950 z-10 right-0 transition-all duration-300 ease-in-out">
                            <ToolbarHeader isToolbarToggled={isToolbarToggled} setToolbarToggled={handleToggle}/>
                            <ToolbarBackgroundColor isToolbarToggled={isToolbarToggled} scene={_scene}/> 
                            <ToolBarPanelTab isToolbarToggled={isToolbarToggled} />
                            <ToolbarLightCatalog  activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled}  scene={_scene} lightManager={_lightManager}/>
                            <ToolbarActiveComponents activeListItems={activeListItems} setActiveListItems={setActiveListItems} isToolbarToggled={isToolbarToggled} lightManager={_lightManager}  />

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

           
        </>
    )
}

/*
// make it a div, resizable

// make it golden ratio

import * as THREE from "three"
import { LightManager } from "./LightManager.js";
import {PanelSelectorTab} from "./PanelSelectorTab.js"
import { BackgroundComponentRect } from "./BackgroundComponentRect.js";
import { SceneComponentRect } from "./SceneComponentRect.js";
import { HeaderComponentRect } from "./HeaderComponentRect.js";
import { ActiveComponentRect } from "./ActiveComponentRect.js";

//Have the toolbar take in the light manager in the constructor

class Toolbar {

    //Take in a reference in the scene
    public _scene : THREE.Scene;

    //take in a reference
    //public _lightManager : LightManager;

    public _panelSelectorTab : PanelSelectorTab;
    public _panelNames = ["Lights","Effects", "Text"];

    public _headerComponentRect : HeaderComponentRect;
    public _backgroundComponentRect : BackgroundComponentRect;
    public _sceneComponentRect : SceneComponentRect;
    public _activeComponentRect : ActiveComponentRect;

    /*
    toolbar has some kind of active tab, when you click on panelselectortab button
    you switch the panel
    
    

    public _toolbar : HTMLElement;


    public _isCollapsed : boolean = false;

    public _offsetX : number = 0;

    private readonly baseClasses = "fixed h-screen bg-blue-600 text-white z-[1000] right-0";
    //public _backgroundColor : HTMLInputElement;

    //make it resizable

    constructor(scene : THREE.Scene, lightManager : LightManager) {

        //refernce the scene
        this._scene = scene;

        //takein reference
        //this._lightManager = lightManager;

        //Create the main div
        this._toolbar = document.createElement("div");
        this._toolbar.id = "toolbarDiv";

        this.setToolbarWidth();


        this._headerComponentRect = new HeaderComponentRect();
        this._toolbar.appendChild(this._headerComponentRect.getComponent());

        //Make next rectangle 61.8% of the toolbar
        //SceneRectangle()

        //Create backgroundColorclass, pull out that component too here to from scene compoenent rect
        this._backgroundComponentRect = new BackgroundComponentRect(this._scene);
        this._toolbar.appendChild(this._backgroundComponentRect.getComponent())


        //might need to put these in here to iterate at this level
        this._panelSelectorTab = new PanelSelectorTab(this._panelNames);
        this._toolbar.appendChild(this._panelSelectorTab.getComponent());
        //this._containerRect.appendChild(this._panelSelectorTab.getComponent());

        //Toggle between lights,effects,text here???
        this._sceneComponentRect = new SceneComponentRect(this._scene, lightManager);
        this._toolbar.appendChild(this._sceneComponentRect.getComponent());


        this._activeComponentRect = new ActiveComponentRect(lightManager);
        this._toolbar.appendChild(this._activeComponentRect.getComponent());




        this.listenForToolbarToggle();



        document.body.appendChild(this._toolbar);

        
    }


    public setToolbarWidth() : void {
        const widthClass = "w-[28.2%]";
        this._toolbar.className = `${this.baseClasses} ${widthClass}`;
    }


    //need to hide the elements when collapsing, scene component rect
    //make it tranform by sliding
    public listenForToolbarToggle() : void {
        this._headerComponentRect._toggleToolbarButton.addEventListener("mousedown", (evt: Event) => {
            console.log("hitting the toggle button", evt);

            //flip the bool
            this._isCollapsed = !this._isCollapsed;
            //this.updateToolbarClassName();
            if(this._isCollapsed) {
                this._toolbar.className = `${this.baseClasses} w-[5%] transition-all duration-500 ease-in-out`;
                this._headerComponentRect._toggleToolbarButton.textContent = "<-";
                this._panelSelectorTab.hide();
                this._sceneComponentRect.hide(); // hide color picker
                this._headerComponentRect.hide(); // hide logo
                this._activeComponentRect.hide()
            } else {
                this._toolbar.className = `${this.baseClasses} w-[28.2%] translate-x-0 transition-all duration-500 ease-in-out`;
                this._headerComponentRect._toggleToolbarButton.textContent = "->";
                this._panelSelectorTab.show();
                this._sceneComponentRect.show(); // show color picker
                this._headerComponentRect.show(); // show logo
                this._activeComponentRect.show()
            }

        });
    }




}

export {Toolbar};


*/