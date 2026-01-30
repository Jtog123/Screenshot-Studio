//Allow users to add their apps logo to the scene THREE.Sprite() - QUEUED
import * as THREE from 'three'

class AssetManager {

    private _imageComponentsMap: Map<string, THREE.Sprite> = new Map();

    public _image : THREE.Sprite | null = null;
    public _ImageComponentGroup: THREE.Group = new THREE.Group();
    public _scene : THREE.Scene;
    public _raycaster : THREE.Raycaster;
    public _renderer : THREE.WebGLRenderer
    public _camera : THREE.PerspectiveCamera
    public _selectedComponentID! : string


    constructor(scene: THREE.Scene, raycaster: THREE.Raycaster, renderer : THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
        this._scene = scene;
        this._raycaster = raycaster;
        this._renderer = renderer;
        this._camera = camera;
    }

    public createImageComponentAbovePhone(file : File, onSuccess: (sprite:THREE.Sprite) => void, onError: () => void) : void{

        //like create light in lightmanager

        const url = URL.createObjectURL(file);
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            (texture) => {
                const material = new THREE.SpriteMaterial({map:texture});
                const sprite = new THREE.Sprite(material);
                sprite.name = "abovePhoneSprite1";
                sprite.scale.set(1, 1, 1);
                sprite.position.set(0, 2.25, 1);

                const componentID = sprite.name;

                //set the map for later retrieval
                this._imageComponentsMap.set(componentID, sprite);

                //add it to active liste elements
                    
                //add to the scene
                this._scene.add(sprite);
                this._ImageComponentGroup.add(sprite);
                URL.revokeObjectURL(url);
                onSuccess(sprite);
            },
            undefined,
            (error) => {
                console.error("Failed to load texture", error);
                onError();

                
                //setIsImageUploaded(false);
            }
        );

    }

    public selectComponent(evt: MouseEvent): void {
        const coords = new THREE.Vector2(
            (evt.clientX / this._renderer.domElement.clientWidth) * 2 - 1,
            -((evt.clientY / this._renderer.domElement.clientHeight) * 2 - 1),
        ); 

        this._raycaster.setFromCamera(coords, this._camera);
        const intersections = this._raycaster.intersectObjects(this._ImageComponentGroup.children, true);

        if(intersections.length > 0) {
            const selectedObject = intersections[0].object;
            const allAncestors: THREE.Object3D[] = [];

            allAncestors.push(selectedObject);

            //Push ancestors
            selectedObject.traverseAncestors((parent) => {
                allAncestors.push(parent);
            });

            const currentComponent = allAncestors.find(ancestor =>
                ancestor.name.startsWith("abovePhoneSprite1")
            )

            //console.log(allAncestors);
            console.log(currentComponent);

            if(!currentComponent) return;

            const currentComponentID = currentComponent.name;

            if(this._selectedComponentID === currentComponentID) {
                console.log("Same component clicked");
                return;
            }

            if(this._selectedComponentID) {
                this.deselectComponent(this._selectedComponentID);
            }

            this.selectComponentByID(currentComponentID);

        }
    }

    public deselectComponent(componentID : string) : void {

    }

    public selectComponentByID(componentID : string) : void {
        const selectedComponentID = this._imageComponentsMap.get(componentID);

        this._selectedComponentID = componentID;

        console.log("gite em", selectedComponentID);

    }



}

export {AssetManager}