
import * as THREE from 'three';
import { _DirectionalLightHelper} from './LightHelper.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';



const enum LightType {
    AmbientLight,
    DirectionalLight,
    SpotLight,
    PointLight,
    RectAreaLight,
}



/*
TODO
What can i guarantee at runtime? look over ! on member vars
implement some graphical component so we can see the direction of the light, Three.js has a light helper

*/

class Light {

    //Create custom LightHelper class

    public _lightColor : THREE.ColorRepresentation;
    public _lightIntensity : number;
    public _lightType : LightType; // can i guarantee there will be a light type at runtime? maybe add one default light
    public _light! : THREE.Light;

    //Alll ights have helpers
    public _lightHelper! : THREE.DirectionalLightHelper 
                            | THREE.PointLightHelper
                            | THREE.SpotLightHelper
                            | RectAreaLightHelper


    public _isVisible : boolean;

    public _guiX : number = 0;
    public _guiY : number = 0;

    public _lightAngle = 0;


    //public _GUI : LightGUI;

    //Do i need an array of light Guis's everytime a new light is created push one back?
    //public _lightGuis : LightGUI[] = [];

    constructor(lightType : LightType){

        //Set Default color of all lights to white
        this._lightColor = 0xFFFFFF;

        //Set default light intensity to 5;
        this._lightIntensity = 5;

        //For now, set default light to Directional light, only want to create light on the event the user creates one
        //this._lightType = LightType.DirectionalLight;
        this._lightType = lightType;

        this._isVisible = true;


        //Create a Light based on the type we pass it
        //this.createLight(this._lightType);

        //crate the GUI
        //this._GUI = new LightGUI();
        
        //create an initial light Gui
        //const initialLightGui = new LightGUI();
        //this._lightGuis.push(initialLightGui);

        //this.showLightGui();


        //this.lightPositionXChange();

        //Listen for position change
        //this.closeLightGui();

    }













}

export {Light, LightType};