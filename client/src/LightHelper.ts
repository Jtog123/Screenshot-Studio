
//All helpers will inherit from this class
// what is the base behaviour?
// coupled to a light when its created?
// Need a way tp graphically show it
// will show different helpers from different kinds of lights

//The light to be visualizeed, size dimension of plane, color if not set takes on the color of the light



//import { LightType } from "./Light.js";
import * as THREE from 'three';
//import {LightGUI} from "./LightGui.js";
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
//import { RectAreaLightHelper } from "./three/examples/jsm/Addons.js";

function* generateDirectionalID() : Generator<number> {
        let id = 0;
        while(true) {
            yield id++;
        }
}
const directionalIDGenerator = generateDirectionalID();

class _DirectionalLightHelper extends THREE.DirectionalLightHelper {

    update() : void {
        super.update();

        if(this.light && this._arrowHelper) {
            const newDir = new THREE.Vector3();
            newDir.subVectors(this.light.target.position, this.light.position);
            newDir.normalize();

            this._arrowHelper.setDirection(newDir);

        }
    }

    private _direction : THREE.Vector3;
    private _origin : THREE.Vector3;
    private _length : number;
    private _hex : number;
    public _arrowHelper : THREE.ArrowHelper;
    public _generatedID : number;
    public _title : string;


    constructor(light : THREE.DirectionalLight, size : number, color : THREE.ColorRepresentation) {
        super(light, size, color);

        //this._direction = new THREE.Vector3(light.position.x, -light.position.y, light.position.z);
        this._direction = new THREE.Vector3().subVectors(light.target.position, light.position);
        this._direction.normalize();
        this._origin = new THREE.Vector3(0, 0, 0);
        this._length = 1;
        this._hex = 0x00FF00;
        this._generatedID = directionalIDGenerator.next().value;
        this.name = `_DirectionalLightHelper${this._generatedID}`;
        //this._title = `Directional Light ${this._generatedID + 1}`;
        this._title = `Directional Light`;

        this._arrowHelper = new THREE.ArrowHelper(this._direction, this._origin, this._length, this._hex, 0.1, 0.1);

        console.log("This helpers id is", this._generatedID);

        //Remove the perpendicular green line
        if(this.children.length > 0) {
            this.remove(this.children[1]);
        }
        //add it to the scene
        this.add(this._arrowHelper);
    }
}

//////////////////////////////////////////////////


function* generateSpotID() : Generator<number> {
        let id = 0;
        while(true) {
            yield id++;
        }
}
const spotIDGenerator = generateSpotID();


class _SpotLightHelper extends THREE.SpotLightHelper {
    private _direction : THREE.Vector3;
    private _origin : THREE.Vector3;
    private _length : number;
    private _hex : number;
    //public _arrowHelper : THREE.ArrowHelper;
    public _generatedID : number;
    public _title : string;


    constructor(light : THREE.SpotLight, color : THREE.ColorRepresentation) {
        super(light, color);

        //this._direction = new THREE.Vector3(light.position.x, -light.position.y, light.position.z);
        this._direction = new THREE.Vector3().subVectors(light.target.position, light.position);
        this._direction.normalize();
        this._origin = new THREE.Vector3(0, 0, 0);
        this._length = 1;
        this._hex = 0x00FF00;
        this._generatedID = spotIDGenerator.next().value;
        this.name = `_SpotLightHelper${this._generatedID}`;
        //this._title = `Directional Light ${this._generatedID + 1}`;
        this._title = `Spot Light`;


        //this._arrowHelper = new THREE.ArrowHelper(this._direction, this._origin, this._length, this._hex, 0.1, 0.1);

        console.log("This helpers id is", this._generatedID);

        //Remove the perpendicular green line
        /*
        if(this.children.length > 0) {
            this.remove(this.children[1]);
        }
            */
        //add it to the scene
        //this.add(this._arrowHelper);
    }
}



//////////////////////////////////////////////////

function* generatePointLightID() : Generator<number> {
        let id = 0;
        while(true) {
            yield id++;
        }
}
const pointIDGenerator = generatePointLightID();

class _PointLightHelper extends THREE.PointLightHelper{

    public _title : string;
    public _hex : number;
    public _generatedID : string

    constructor(light : THREE.PointLight, sphereSize: number, color: THREE.ColorRepresentation) {
        super(light, sphereSize, color);

        this._title = "Point Light ";
        this._hex = 0x00FF00;
        this._generatedID = pointIDGenerator.next().value;
        this.name = `_PointLightHelper${this._generatedID}`;
    }
}

///////////

function* generateRectLightID() : Generator<number> {
        let id = 0;
        while(true) {
            yield id++;
        }
}
const rectIDGenerator = generateRectLightID();

class _RectAreaLightHelper extends RectAreaLightHelper {
    public _title : string;
    public _hex : number;
    public _generatedID : string

    constructor(light : THREE.RectAreaLight, color: THREE.ColorRepresentation) {
        super(light, color);

        this._title = "Rect Area Light ";
        this._hex = 0x00FF00;
        this._generatedID = rectIDGenerator.next().value;
        this.name = `_RectAreaLightHelper${this._generatedID}`;
    }

}



export { _DirectionalLightHelper, _SpotLightHelper, _PointLightHelper, _RectAreaLightHelper}