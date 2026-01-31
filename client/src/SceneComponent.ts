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
    public _guiX : number = 100;
    public _guiY : number = 100;

    constructor(componentType: ComponentType) {
        this._componentType = componentType
    }
}

export {SceneComponent, ComponentType}