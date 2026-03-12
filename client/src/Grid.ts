import * as THREE from 'three'

class Grid {
    private _size : number;
    private _divisons : number;
    private _gridHelper! : THREE.GridHelper;
    public isVisible : boolean;



    constructor(size : number, divisions : number) {

        this._size = size;
        this._divisons = divisions;
        this.isVisible = true;

        this._gridHelper = new THREE.GridHelper(size, divisions);
        this._gridHelper.position.y = -2;
        
    }

    public getGridHelper() : THREE.GridHelper | void {
        if(!this._gridHelper) return;

        return this._gridHelper;
    }

}

export {Grid}