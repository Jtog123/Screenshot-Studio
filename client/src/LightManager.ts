import * as THREE from 'three';
import { Light, LightType } from './Light.js';
//import {LightGUI} from "./LightGui.js";
import { _DirectionalLightHelper, _SpotLightHelper, _PointLightHelper, _RectAreaLightHelper} from './LightHelper.js';
//import { DirectionalLightGUI } from './DirectionalLightGui.js';
//import { SpotLightGUI } from './SpotLightGui.js';
//import { PointLightGUI } from './PointLightGui.js';
//import { RectAreaLightGUI } from './RectAreaLightGui.js';

//We have to add. an event listener on the dialog windwo close button
// When that close button is pressed we have to: close the gui, get the current active helper and color it green


class LightManager {

    private _scene : THREE.Scene;

    private _lights: Map<string, Light> = new Map();
    private _lightHelpers: Map<string, _DirectionalLightHelper | _SpotLightHelper | _PointLightHelper | _RectAreaLightHelper> = new Map();

    //private _lightGuis: Map<string, LightGUI> = new Map();

    //light counts
    private _directionalLightCounter : number = 0;
    private _spotLightCounter : number = 0;
    private _pointLightCounter : number = 0;
    private _rectAreaCounter : number = 0;

    //event System for light Creation
    private _eventListeners : Map<string, Function[]> = new Map();

    public _lightGroup: THREE.Group = new THREE.Group();

    //RAYCASTER refernces
    public _raycaster : THREE.Raycaster;
    public _renderer : THREE.WebGLRenderer;
    public _camera! : THREE.PerspectiveCamera;

    //keep track of which light is selected
    public _selectedLightID: string | null = null;
    public _previousLightSelection : THREE.Object3D[] = []

    //may have to pass a scene object to delete the light

    // Assuming 'scene' is your THREE.Scene and 'myLight' is your THREE.Light
    /*
        if (myLight.parent) {
            myLight.parent.remove(myLight);
        }
        // Alternatively, if you know it's a direct child of the scene:
        scene.remove(myLight);
        */

  

    constructor(raycaster: THREE.Raycaster, renderer:THREE.WebGLRenderer, camera:THREE.PerspectiveCamera, scene:THREE.Scene) {
        //assign the references
        this._raycaster = raycaster;
        this._renderer = renderer;
        this._camera = camera;

        //referecn to the scene
        this._scene = scene;

        //create two lights
        //this.createLight(LightType.DirectionalLight, new THREE.Vector3(-2,2,0));
        //this.createLight(LightType.DirectionalLight, new THREE.Vector3(2,2,0));

    }

    public addEventListener(event: string, callback:Function) : void {
        //if we dont hve this event add it at the event key
        if(!this._eventListeners.has(event)) {
            this._eventListeners.set(event, [])
        }
        //else we already have the event push the function to execute
        this._eventListeners.get(event)!.push(callback)
    }

    private emit(event: string, data: any) : void {
        const listeners = this._eventListeners.get(event);
        if(listeners) {
            listeners.forEach((callback) => callback(data));
        }

    }

    public createLight(lightType : LightType, lightPosition : THREE.Vector3) : Light {

        let newLight = new Light(lightType);

        if(lightType === LightType.DirectionalLight) {

            //Create the light, newLight is of type Light from which DirectionalLight inherits from
            newLight._light = new THREE.DirectionalLight(newLight._lightColor, newLight._lightIntensity);

            ///set a default position, posiiton will be changed on a user event of grabbing and moving the light
            newLight._light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);  //(0, 1, 5)  

            //init the helper with the type, and the position of the light
            // use type assertion in first argument 
            const helper = new _DirectionalLightHelper(newLight._light as THREE.DirectionalLight, 0.5, new THREE.Color(0x00FF00)); 
            newLight._lightHelper = helper;

            //set the title
            this._directionalLightCounter++;
            helper._title = `${helper._title} ${this._directionalLightCounter}`;

            //const gui = new LightGUI(newLight);
            //const gui = new DirectionalLightGUI(newLight);

            //use its name as the ID
            const lightID = helper.name;

            //use the maps
            this._lights.set(lightID, newLight);
            this._lightHelpers.set(lightID, helper);
            //this._lightGuis.set(lightID, gui);

            //wire it up
            //this.wireGUIToLight(lightID, gui, newLight);

            //poll for potneital closing
            //this.listenForGUIClose(lightID);

            //add the light
            this._scene.add(newLight._light);

            //for the raycaster
            this._lightGroup.add(helper);


            this.emit("lightCreated", {
                id: lightID,
                name: helper._title || lightID,
                type: lightType
            });

        } else if(lightType === LightType.SpotLight) {
            console.log("creating the spotlight");
            
            const angle = Math.PI / 12;      // Wider cone so it's more visible
            const distance = 3;             // Longer distance

            // Create spotlight with higher intensity to make it visible
            newLight._light = new THREE.SpotLight(newLight._lightColor, newLight._lightIntensity, distance, angle, 0.5, 0);

            // Position it to the side and above, pointing at origin
            //newLight._light.position.set(3, 3, 0);  // To the side and above;
            newLight._light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
            
            // Point the spotlight at the phone (at origin)
            const spotlight = newLight._light as THREE.SpotLight;
            spotlight.target.position.set(0, 0, 0);

            this._scene.add(spotlight.target);
            this._scene.add(spotlight);

            //spotlight.updateMatrixWorld(true);
            //spotlight.target.updateMatrixWorld(true);

            // Create helper
            const helper = new _SpotLightHelper(spotlight, new THREE.Color(0x00FF00)); 
            newLight._lightHelper = helper;
            //helper.update();

            // Set the title
            this._spotLightCounter++;
            helper._title = `${helper._title} ${this._spotLightCounter}`; 

            //const gui = new LightGUI(newLight);
            //const gui = new SpotLightGUI(newLight, this.setLightHelperColor.bind(this));

            // Use its name as the ID
            const lightID = helper.name;

            // Use the maps
            this._lights.set(lightID, newLight);
            this._lightHelpers.set(lightID, helper);
            //this._lightGuis.set(lightID, gui);

            // Wire it up
            //this.wireGUIToLight(lightID, gui, newLight);

            // Poll for potential closing
            //this.listenForGUIClose(lightID);

            //add the light
            this._scene.add(newLight._light);

            // For the raycaster
            this._lightGroup.add(helper);

            this.emit("lightCreated", {
                id: lightID,
                name: helper._title || lightID,
                type: lightType
            });
        } else if(lightType == LightType.PointLight) {

            const distance = 3;
            const decay = 2;
            const lightIntensity = 10;
            //create the light nd stuff
            newLight._light = new THREE.PointLight(0xFFFFFF, lightIntensity, distance, decay);

            newLight._light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);


            const sphereHelperSize = 0.7;
            // Create helper
            const helper = new _PointLightHelper(newLight._light as THREE.PointLight, sphereHelperSize, new THREE.Color(0x00FF00)); 
            newLight._lightHelper = helper;

            this._pointLightCounter++;

            helper._title = `${helper._title} ${this._pointLightCounter}`; 

            //add the gui
            //make pointlightgui
            //const gui = new PointLightGUI(newLight);


            // Use its name as the ID
            const lightID = helper.name;

            // Use the maps
            this._lights.set(lightID, newLight);
            this._lightHelpers.set(lightID, helper);
            //this._lightGuis.set(lightID, gui);


            // Wire it up
            //this.wireGUIToLight(lightID, gui, newLight);

            // Poll for potential closing
            //this.listenForGUIClose(lightID);

            //add the light
            this._scene.add(newLight._light);

            // For the raycaster
            this._lightGroup.add(helper);

            this.emit("lightCreated", {
                id: lightID,
                name: helper._title || lightID,
                type: lightType
            });

        } else if (lightType == LightType.RectAreaLight) {
            console.log("Creating react area");
            const intensity = 5;
            const width = 2;
            const height = 1;

            //const rectAreaLight = 
            newLight._light = new THREE.RectAreaLight(0xFFFFFF, intensity, width, height);
            newLight._light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);


            const helper = new _RectAreaLightHelper(newLight._light as THREE.RectAreaLight, new THREE.Color(0x00FF00));
            newLight._lightHelper = helper;

            helper.traverse((child) => {
                console.log("rect is " + child.type); // Will show "Line" or "LineSegments"
            });

            this._rectAreaCounter++;

            helper._title = `${helper._title} ${this._rectAreaCounter}`;

            //const gui = new RectAreaLightGUI(newLight);

            const lightID = helper.name;

            // Use the maps
            this._lights.set(lightID, newLight);
            this._lightHelpers.set(lightID, helper);
            //this._lightGuis.set(lightID, gui);

            // Wire it up
            //this.wireGUIToLight(lightID, gui, newLight);

            // Poll for potential closing
            //this.listenForGUIClose(lightID);

            //add the light
            this._scene.add(newLight._light);

            // For the raycaster
            this._lightGroup.add(helper);

            this.emit("lightCreated", {
                id: lightID,
                name: helper._title || lightID,
                type: lightType
            });


        }

        return newLight;

    }

    /*
    private wireGUIToLight(lightID: string, gui: LightGUI, light:Light) : void {
        const helper = this._lightHelpers.get(lightID);
        //position
        gui._xPosSlider.addEventListener("input", (evt: Event) => {
            const value = Number(gui._xPosSlider.value);
            light._light.position.setX(value);

            if(helper instanceof _SpotLightHelper) {
                helper.update();

                if(this._selectedLightID === lightID) {
                    this.setLightHelperColor(helper, 0xFF0000);
                }
            }
        });

        gui._yPosSlider.addEventListener("input", (evt: Event) => {
            const value = Number(gui._yPosSlider.value);
            light._light.position.setY(value);

            if(helper instanceof _SpotLightHelper) {
                helper.update();

                if(this._selectedLightID === lightID) {
                    this.setLightHelperColor(helper, 0xFF0000);
                }
            }
        });

        gui._zPosSlider.addEventListener("input", (evt: Event) => {
            const value = Number(gui._zPosSlider.value);
            light._light.position.setZ(-value);

            if(helper instanceof _SpotLightHelper) {
                helper.update();

                if(this._selectedLightID === lightID) {
                    this.setLightHelperColor(helper, 0xFF0000);
                }
            }
        });

        //Rotation
        if(gui instanceof DirectionalLightGUI) {
            gui._xRotationSlider.addEventListener("input", (evt: Event) => {
                const value = Number(gui._xRotationSlider.value);
                light._light.rotation.x = value;
            });

            gui._zRotationSlider.addEventListener("input", (evt: Event) => {
            const value = Number(gui._zRotationSlider.value);
            light._light.rotation.z = value;
            });
        }





    }
        */
        

    public getLightList() : [string, Light][] {
        return [...this._lights];
    }

    
    public selectLight(evt: MouseEvent): void {
        const coords = new THREE.Vector2(
            (evt.clientX / this._renderer.domElement.clientWidth) * 2 - 1,
            -((evt.clientY / this._renderer.domElement.clientHeight) * 2 - 1),
        ); 

        this._raycaster.setFromCamera(coords, this._camera);
        const intersections = this._raycaster.intersectObjects(this._lightGroup.children, true);

        if(intersections.length > 0) {
            const selectedObject = intersections[0].object;
            const allAncestors: THREE.Object3D[] = [];

            allAncestors.push(selectedObject);

            //Push ancestors
            selectedObject.traverseAncestors((parent) => {
                allAncestors.push(parent);
            });

            console.log(allAncestors);


            //find the hlper in the list of ancestors
            const currentHelper = allAncestors.find(ancestor => 
                ancestor.name.startsWith("_DirectionalLightHelper") ||
                ancestor.name.startsWith("_SpotLightHelper") ||
                ancestor.name.startsWith("_PointLightHelper") ||
                ancestor.name.startsWith("_RectAreaLightHelper")) as _DirectionalLightHelper | _SpotLightHelper | _PointLightHelper | _RectAreaLightHelper | undefined;


            //if we dont have a selected helper
            if(!currentHelper) return;

            const currentLightID = currentHelper.name;

            if(this._selectedLightID === currentLightID) {
                console.log("Same light clicked");
                return;
            }

            //If we already have a selected light & its different, deselect it
            if(this._selectedLightID) {
                this.deselectLight(this._selectedLightID);
            }

            //select new
            this.selectLightByID(currentLightID);

            //something is selected, now listen for gui close
            //this.listenForGUIClose(currentLightID);
        }
    }
        

    
    private selectLightByID(lightID: string) {
        //grab the light helper
        const helper = this._lightHelpers.get(lightID);

        //grab its correposnding gui
        //const gui = this._lightGuis.get(lightID);

        //if either are null return
        //if(!helper || ! gui) return;
        if(!helper) return;

        //gui._dialogWindow.show();

        this.setLightHelperColor(helper, 0xFF0000);

        //set our current light
        this._selectedLightID = lightID;

        const light = this.getLight(lightID);
        if(!light) return;

        
        this.emit("lightSelected", {
            id: lightID,
            name: helper._title || lightID,
            type: light._lightType
        });

    }

    private deselectLight(lightID: string) {
        const helper = this._lightHelpers.get(lightID);
        //const gui = this._lightGuis.get(lightID);

        //if(!helper || !gui) return ;
        if(!helper) return;

        //hide the gui
        //gui._dialogWindow.close();

        this.setLightHelperColor(helper, 0x00FF00);

    }
        

    /*
    
    private listenForGUIClose(lightID : string) {
        const gui = this._lightGuis.get(lightID);
        
        if(!gui) return;

        gui?._closeButton.addEventListener("mousedown", (evt: Event) => {
            this.deselectLight(lightID);

            //clear the selection
            this.clearLightSelection(lightID);
        });


    }
        */
        
        

    private setLightHelperColor(lightHelper : _DirectionalLightHelper | _SpotLightHelper | _PointLightHelper | _RectAreaLightHelper , colorValue: number) : void {
        const color = new THREE.Color(colorValue);

        console.log("setting the color");

        lightHelper.traverse((child) => {
            if(child instanceof THREE.Line || child instanceof THREE.LineSegments) {
                (child.material as THREE.LineBasicMaterial).color.set(color); 
            } else if (child instanceof THREE.Mesh) {
                console.log("Mesh material:", child.material); // Log the material
                console.log("Material type:", child.material.type);
                (child.material as THREE.MeshBasicMaterial).color.set(color);
                lightHelper.color = colorValue;
            }
        });
        

    }

    /*
    public removeLight(lightID: string) {
        const helper = this._lightHelpers.get(lightID);
        const gui = this._lightGuis.get(lightID);

        if(!helper || !gui) return ;

        //remove light from group/scene
        this._lightGroup.remove(helper);

        gui._dialogWindow.close();
        gui._dialogWindow.remove();

        //lok over later///////////////////////////////////
        let deleteLight = this.getLight(lightID) as Light;
        this._scene.remove(deleteLight._light);

        //remove from maps
        this._lights.delete(lightID);
        this._lightHelpers.delete(lightID);
        this._lightGuis.delete(lightID);

        //clear the selection
        this.clearLightSelection(lightID);

        this.emit("lightDeleted", {id: lightID});

        //lok over later
        //let deleteLight = this.getLight(lightID) as Light;
        //this._scene.remove(deleteLight._light);
    }
        
        

    //try tomorrow
    private clearLightSelection(lightID : string) : void {
        //clear the selection
        if(this._selectedLightID == lightID) {
            this._selectedLightID = null;
        }
    }

    public toggleVisibility(lightID : string) : void {
        //_selectedLightID

        //grab the light
        const light = this._lights.get(lightID) as Light;

        //toggle 
        light._isVisible = !light._isVisible;

        //bug if you grab the gui it allows the light to be moved without it being selected
        //if its visible
        if(light._isVisible) {
            light._light.visible = true;
            light._lightHelper.visible = true;
            
            
        } else {
            //its not toggle things off
            //we need to unselect the light
            light._light.visible = false;
            light._lightHelper.visible = false;
            this.deselectLight(lightID);
        }
    }
        */

    //grab all light ids if needed - ex _DirectionalLight0
    public getLightIDs() : string[] {
        return Array.from(this._lights.keys());
    }

    public getLight(lightID: string) : Light | undefined {
        return this._lights.get(lightID);
    }



}


export {LightManager}
