import * as THREE from 'three'

class CameraManager {
    public screenshotWidth : number = 1242;
    public screenshotHeight : number = 2688;
    private _scene : THREE.Scene
    private _camera : THREE.PerspectiveCamera
    private _renderer : THREE.WebGLRenderer

    constructor(scene: THREE.Scene ,camera :THREE.PerspectiveCamera , renderer: THREE.WebGLRenderer ) {
        this._scene = scene;
        this._camera = camera;
        this._renderer = renderer;
    }

    public captureImage() {

        const originalAspect = this._camera.aspect;

        //resize the renderer temporarily
        this._renderer.setSize(this.screenshotWidth, this.screenshotHeight);

        //temporarily update aspect , create function?
        const tempAspectRatio = this.screenshotWidth / this.screenshotHeight;
        this._camera.aspect = tempAspectRatio;
        this._camera.updateProjectionMatrix();

        //update the renderer
        this._renderer.render(this._scene,this._camera);

        setTimeout(() => {
            this._renderer.domElement.toBlob((blob) => {
                const url = URL.createObjectURL(blob as Blob);
                const link = document.createElement("a");
                //create a hyperlink ref
                link.href = url;
                link.download = "ScreenshotStudioTestShot.png";
                link.click();
                URL.revokeObjectURL(url);
            }, "image/png", 1.0);

            //set it back
            this._camera.aspect = originalAspect;
            this._camera.updateProjectionMatrix();

            //reset the window size back to the window
            this._renderer.setSize(window.innerWidth, window.innerHeight);
        },100)

        //export as a data url
         //const imgDataURL = this._renderer.domElement.toDataURL('image/png');





    }
  
}

export{CameraManager}