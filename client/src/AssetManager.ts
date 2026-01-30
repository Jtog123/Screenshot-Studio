//Allow users to add their apps logo to the scene THREE.Sprite() - QUEUED
import * as THREE from 'three'

class AssetManager {

    public _image : THREE.Sprite | null = null;
    public _ImageComponentGroup: THREE.Group = new THREE.Group();
    public _scene : THREE.Scene;

    public createImageComponentAbovePhone(file : File, onSuccess: () => void, onError: () => void) : void{

        //like create light in lightmanager

        const url = URL.createObjectURL(file);
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            (texture) => {
                const material = new THREE.SpriteMaterial({map:texture});
                const sprite = new THREE.Sprite(material);
                sprite.scale.set(2, 2, 1);
                sprite.position.set(0, 2.5, 0);

                //add it to active liste elements
                    
                //add to the scene
                this._scene.add(sprite);
                URL.revokeObjectURL(url);
                onSuccess();
            },
            undefined,
            (error) => {
                console.error("Failed to load texture", error);
                onError();

                
                //setIsImageUploaded(false);
            }
        );

    }



    constructor(scene: THREE.Scene) {
        this._scene = scene;

    }
}

export {AssetManager}