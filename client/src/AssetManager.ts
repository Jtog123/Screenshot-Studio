//Allow users to add their apps logo to the scene THREE.Sprite() - QUEUED
import * as THREE from 'three'

class AssetManager {

    public _image : THREE.Sprite | null = null;
    public _ImageComponentGroup: THREE.Group = new THREE.Group();
    public _scene : THREE.Scene;

    public createImageComponentAbovePhone() : void {
        //like create light in lightmanager
        

    }



    constructor(scene: THREE.Scene) {
        this._scene = scene;

    }
}

export {AssetManager}