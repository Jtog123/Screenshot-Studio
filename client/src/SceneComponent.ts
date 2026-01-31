import * as THREE from 'three'

const enum ComponentType {
    Image,
    Text,
    ImageAndText
}

class SceneComponent {
    public _componentType : ComponentType;
    public _underlyingComponent : THREE.Sprite | THREE.Mesh | null = null;
    public _material : THREE.SpriteMaterial | null = null;
    public _guiX : number = 0;
    public _guiY : number = 0;
    public _title : string = "";

    constructor(componentType: ComponentType) {
        this._componentType = componentType

        this.assignTitle();
    }

    public assignTitle() : void {
        if(this._componentType === ComponentType.Image) {
            this._title = "Image Component";
        } else if(this._componentType === ComponentType.Text) {
            this._title = "Text Component";
        } else {
            this._title = "Text and Image Component";
        }
    }
}

export {SceneComponent, ComponentType}