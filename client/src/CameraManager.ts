import * as THREE from 'three'

class CameraManager {
    public screenshotWidth : number = 1242;
    public screenshotHeight : number = 2688;
    private _scene : THREE.Scene
    private _camera : THREE.PerspectiveCamera
    //private _renderer : THREE.WebGLRenderer

    constructor(scene: THREE.Scene ,camera :THREE.PerspectiveCamera , renderer: THREE.WebGLRenderer ) {
        this._scene = scene;
        this._camera = camera;
        //this._renderer = renderer;
    }


    //We are going to create a temp canvas render it onto that then discard it after we have the screenshot
    /*
When to create it:
Inside captureImage() when you need it
How it works:

Create a new WebGLRenderer (this automatically creates a canvas internally)
Set its size to screenshot dimensions (1242x2688)
Copy all the settings from your main renderer (antialias, etc.)
Render your scene to this new renderer (uses the off-screen canvas)
Capture the image from this new renderer's canvas
Dispose/destroy the temporary renderer and canvas
Your main renderer/canvas never changes - user sees nothing
    */
    public captureImage() {

        //create Temp redner/canvas, and temp camera
        const tempRenderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});

        //can add different FOV's
        const originalFOV = this._camera.fov;
        const originalNear = this._camera.near;
        const originFar = this._camera.far;

        //temporarily update aspect , create function?
        const tempAspectRatio = this.screenshotWidth / this.screenshotHeight;

        const tempCamera = new THREE.PerspectiveCamera(
            originalFOV, tempAspectRatio, originalNear, originFar
        );

        //copy the pos of the original camera
        tempCamera.position.copy(this._camera.position)

        tempRenderer.setSize(this.screenshotWidth, this.screenshotHeight);

        //tempCamera.updateProjectionMatrix();
        tempRenderer.render(this._scene, tempCamera);

 
        setTimeout(() => {
            tempRenderer.domElement.toBlob((blob) => {
                const url = URL.createObjectURL(blob as Blob);
                const link = document.createElement("a");
                //create a hyperlink ref
                link.href = url;
                link.download = "ScreenshotStudioTestShot.png";
                link.click();
                URL.revokeObjectURL(url);
            }, "image/png", 1.0);

            //this._camera.updateProjectionMatrix();
        }, 50);


    }
  
}

export{CameraManager}