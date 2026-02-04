//Allow users to add their apps logo to the scene THREE.Sprite() - QUEUED
import * as THREE from 'three'
import { ComponentType, SceneComponent } from './SceneComponent';
import { SceneNode } from 'three/webgpu';



class AssetManager {

    public _assetsMap: Map<string, SceneComponent> = new Map();
    //private _assetsMap: Map<string, THREE.Sprite | THREE.Mesh> = new Map();
    public _assetGroup: THREE.Group = new THREE.Group();

    public _image : THREE.Sprite | null = null;
    
    public _scene : THREE.Scene;
    public _raycaster : THREE.Raycaster;
    public _renderer : THREE.WebGLRenderer
    public _camera : THREE.PerspectiveCamera
    public _selectedComponentID : string | null = null;
    private _eventListeners : Map<string, Function[]> = new Map();


    constructor(scene: THREE.Scene, raycaster: THREE.Raycaster, renderer : THREE.WebGLRenderer, camera: THREE.PerspectiveCamera) {
        this._scene = scene;
        this._raycaster = raycaster;
        this._renderer = renderer;
        this._camera = camera;
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

    public createImageComponent(file : File, onSuccess: (sprite:THREE.Sprite) => void, onError: () => void) : void{

        //like create light in lightmanager

        const url = URL.createObjectURL(file);
        const loader = new THREE.TextureLoader();

        loader.load(
            url,
            (texture) => {
                const imageComponent = new SceneComponent(ComponentType.Image);
                imageComponent._material = new THREE.SpriteMaterial({map:texture});
                imageComponent._underlyingComponent = new THREE.Sprite(imageComponent._material);
                imageComponent._underlyingComponent.name = `sprite_image_${Date.now()}`;
                

                imageComponent._underlyingComponent.scale.set(1,1,1);
                //set a default
                imageComponent._underlyingComponent.position.set(0, 2.25,1);


                const componentID = imageComponent._underlyingComponent.name;

                console.log("setting with", componentID);

                //set the map for later retrieval
                this._assetsMap.set(componentID, imageComponent);

                this._assetGroup.add(imageComponent._underlyingComponent);
                URL.revokeObjectURL(url);
                onSuccess(imageComponent._underlyingComponent);
            },
            undefined,
            (error) => {
                console.error("Failed to load texture", error);
                onError();

                
                //setIsImageUploaded(false);
            }
        );

    }

    public createTextSprite(componentID:string, text: string, fontSize: number, fontColor : string,  width : number, height : number
    ) : THREE.Sprite {

        const canvas = document.createElement("canvas");

        //creates a CanvasRenderingContext2d object
        const context = canvas.getContext("2d");

        const scale = 4;
        canvas.width = width * scale;
        canvas.height = height * scale;

        context?.scale(scale,scale);

        

        /*
        if(backgroundColor !== "transparent" && context) {
            context.fillStyle = backgroundColor;
            context.fillRect(0,0, width, height);
        }
            */

        if(context) {
            context.font = `${fontSize }px Arial`;
            context.fillStyle = fontColor;
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText(text, width / 2, height / 2);
        }

        const textComponent = new SceneComponent(ComponentType.Text);
        textComponent._texture = new THREE.CanvasTexture(canvas);
        textComponent._material = new THREE.SpriteMaterial({ map: textComponent._texture, transparent: true });
        textComponent._underlyingComponent = new THREE.Sprite(textComponent._material);
        textComponent._underlyingComponent.name = componentID;
        textComponent._underlyingComponent.scale.set(width/80, height/80, 1);
        //textComponent._underlyingComponent.scale.set(width/100, height/100, 1); can create interesting effects drawing to a canvas

        //review code made sure it makes sense
        //also can i move that testcomponent code into toolbar or where imagecomponentcode is?
        //we now need to figure out how to tie the gui to this component now
       
        this._assetsMap.set(componentID, textComponent);
    
        return textComponent._underlyingComponent as THREE.Sprite;


    }

    public updateTextSprite(sprite: THREE.Sprite, text:string, fontSize: number, fontColor: string,  width : number, height: number) : void {
        const canvas = (sprite.material.map as THREE.CanvasTexture).image as HTMLCanvasElement;
        const context = canvas.getContext("2d")!;

        const scale = 4;


        context.setTransform(1, 0, 0, 1, 0, 0);
        context.scale(scale, scale);

        context.clearRect(0,0, width, height);

        /*
        if(backgroundColor !== "transparent") {
            context.fillStyle = backgroundColor;
            context.fillRect(0,0,width, height);
        }
            */

        context.font = `${fontSize}px Arial`;
        context.fillStyle = fontColor;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(text, width / 2, height / 2);

        (sprite.material.map as THREE.CanvasTexture).needsUpdate = true;


    }



    public selectComponent(evt: MouseEvent): void {
        const coords = new THREE.Vector2(
            (evt.clientX / this._renderer.domElement.clientWidth) * 2 - 1,
            -((evt.clientY / this._renderer.domElement.clientHeight) * 2 - 1),
        ); 

        this._raycaster.setFromCamera(coords, this._camera);
        const intersections = this._raycaster.intersectObjects(this._assetGroup.children, true);

        if(intersections.length > 0) {
            const selectedObject = intersections[0].object;
            const allAncestors: THREE.Object3D[] = [];

            allAncestors.push(selectedObject);

            //Push ancestors
            selectedObject.traverseAncestors((parent) => {
                allAncestors.push(parent);
            });

            const currentComponent = allAncestors.find(ancestor =>
                ancestor.name.startsWith("sprite_image_") ||
                ancestor.name.startsWith("text_")
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


    public selectComponentByID(componentID : string) : void {
        
        const selectedComponentID = this._assetsMap.get(componentID);

        this._selectedComponentID = componentID;

        console.log("gite em", selectedComponentID);

        const component = this.getComponent(componentID); //gets a sprite

        if(!component) return;

        //may have to adjust selection logv=ic for text
        //scale slightly and show opactiy to show selection
        (component?._underlyingComponent as THREE.Sprite || THREE.Mesh || THREE.CanvasTexture).scale.multiplyScalar(1.2);
        //(component?._underlyingComponent as THREE.Sprite || THREE.Mesh).material.opacity = 0.7;

        

        this.emit("componentSelected", {
            id: componentID,
            name: component._underlyingComponent?.name,
            type: component._componentType
        })

    }


    public deselectComponent(componentID : string) : void {
        const component = this._assetsMap.get(componentID);

        if(!component) return;

        //makr some visual point, write a select function in sceneComponent class??
        (component._underlyingComponent as THREE.Sprite || THREE.Mesh).scale.multiplyScalar(1/1.2);
        //(component._underlyingComponent as THREE.Sprite || THREE.Mesh).material.opacity = 1.0;

        this._selectedComponentID = null;

        this.emit("componentDeselected", {id:componentID})

    }

    /*
    public getComponent(componentID : string) : THREE.Sprite | THREE.Mesh | undefined {
        return this._assetsMap.get(componentID);
    }
        */

     public getComponent(componentID : string) : SceneComponent | undefined {
        return this._assetsMap.get(componentID);
    }

    public toggleVisibility(componentID : string) : void {
        const component = this._assetsMap.get(componentID) as SceneComponent;

        if(component) {
            component._isVisible = !component?._isVisible;
        }

        if(component?._isVisible) {
            (component._underlyingComponent as THREE.Sprite || THREE.Mesh).visible = true;
        } else {
            (component._underlyingComponent as THREE.Sprite || THREE.Mesh).visible = false;
            this.deselectComponent(componentID);
        }
    }

    public clearComponentSelection(componentID : string) : void {
        if(this._selectedComponentID === componentID) {
            this._selectedComponentID = null;
        }
    }

    public removeComponent(componentID : string) : void {
        const component = this._assetsMap.get(componentID);

        if(!component) return;

        //remove it from the group
        this._assetGroup.remove(component._underlyingComponent as THREE.Sprite || THREE.Mesh);

        //rempve from scene
        let deleteComponent = this.getComponent(componentID);
        if(!deleteComponent) return;
        
        this._scene.remove(deleteComponent._underlyingComponent as THREE.Sprite || THREE.Mesh);

        this.clearComponentSelection(componentID);

        this.emit("componentDeleted", {id: componentID});


    }



}

export {AssetManager}