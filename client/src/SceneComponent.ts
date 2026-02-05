import * as THREE from 'three'

const enum ComponentType {
    Image,
    Text,
    ImageAndText
}

class SceneComponent {
    public _componentType : ComponentType;
    public _underlyingComponent : THREE.Sprite | THREE.Mesh | null = null;
    public _isVisible = true;
    public _material : THREE.SpriteMaterial | THREE.SpriteMaterial | null = null;
    public _texture : THREE.CanvasTexture | null = null;
    public _guiX : number = 100;
    public _guiY : number = 100;
    public _title : string = "";

    public _textConfig? : {
        text: string;
        fontSize: number;
        fontColor : string;
        opacity : number;
    };

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