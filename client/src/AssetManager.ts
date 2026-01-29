//Allow users to add their apps logo to the scene THREE.Sprite() - QUEUED
import * as THREE from 'three'

class AssetManager {

    public _image : THREE.Sprite | null = null;
    public _scene : THREE.Scene;

    /* REQUIREMENTS */
    //load png image files
    //position the images/text in the scene
    // allow them to move thet text and images around somewhat
    //handle transperency of the images
    //remove/delete images
    //toggle visibility
    // store references to all added images

    public addImageBoxAbovePhone() : void {
        
        /*
            const component = ({ImageComponent}) => {
                return <ImageComponent />
            }
        */

        //in assetManager will need to pass cameraManager
        //image added to the scene
        //move camera down?
        //display a dotted box on the canvas prompting users to upload a picture

    }

    constructor(scene: THREE.Scene) {
        this._scene = scene;

    }
}

export {AssetManager}