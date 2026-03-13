import * as THREE from 'three'
import {CapturedImage } from './ComponentInterfaces';
import { Grid } from './Grid';

class CameraManager {
    public screenshotWidth : number = 1242;
    public screenshotHeight : number = 2688;
    private _scene : THREE.Scene
    private _camera : THREE.PerspectiveCamera
    private setCapturedImages :  React.Dispatch<React.SetStateAction<
    CapturedImage[]>>;
    private setImageCaptured : React.Dispatch<React.SetStateAction<boolean>>;
    private _grid : Grid

    //private _renderer : THREE.WebGLRenderer

    constructor(scene: THREE.Scene ,camera :THREE.PerspectiveCamera , renderer: THREE.WebGLRenderer, setCapturedImages: React.Dispatch<React.SetStateAction<
        CapturedImage[]>>, setImageCaptured : React.Dispatch<React.SetStateAction<boolean>>, _grid : Grid ) {
        this._scene = scene;
        this._camera = camera;
        this.setCapturedImages = setCapturedImages;
        this.setImageCaptured = setImageCaptured;
        this._grid = _grid;

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

    public captureImage() : void {

        // assigns false if the lhs is null or undefined
        const helperVisibility : Map<THREE.Object3D, boolean> = new Map();

        this._scene.traverse((object) => {
            if(
                object instanceof THREE.GridHelper ||
                object instanceof THREE.DirectionalLightHelper ||
                object instanceof THREE.SpotLightHelper ||
                object instanceof THREE.PointLightHelper ||
                object instanceof THREE.RectAreaLight
            ) {
                helperVisibility.set(object, object.visible);
                //hide all helpers
                object.visible = false;
            }
        })

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

        /*
        from the base app have the screentextures and activeTextureID and pass it down
        into both toolbarimgandtext and cameramaanger
        when capturing if activeTextureID === screentexturesID
        we have a captured image and and add it to the array
        */

        //this.setImageCaptured(false);

        //toggle grid

        setTimeout(() => {
            tempRenderer.domElement.toBlob((blob) => {
                const url = URL.createObjectURL(blob as Blob);
                const link = document.createElement("a");

                
                //this might not work because ids dont match?
                
                this.setCapturedImages(prev => [...prev, {
                    id : `captured_${Date.now()}`,
                    imgPath : url,
                }]);
                

                //create a hyperlink ref
                link.href = url;
                link.download = "ScreenshotStudioTestShot.png";
                link.click();
                //this.setImageCaptured(true);
                
                //URL.revokeObjectURL(url);


            }, "image/png", 1.0);

            //this._camera.updateProjectionMatrix();
        }, 50);


        //restpre helper visiblity
        helperVisibility.forEach((wasVisible, helper) => {
            helper.visible = wasVisible;
        })

        this.setImageCaptured(false);
 


    }


    public captureHomepageImage(): void {
    // Hide all helpers
    const helperVisibility: Map<THREE.Object3D, boolean> = new Map();

    this._scene.traverse((object) => {
        if (
            object instanceof THREE.GridHelper ||
            object instanceof THREE.DirectionalLightHelper ||
            object instanceof THREE.SpotLightHelper ||
            object instanceof THREE.PointLightHelper ||
            object instanceof THREE.RectAreaLight
        ) {
            helperVisibility.set(object, object.visible);
            object.visible = false;
        }
    });

    // Create temp renderer and camera
    const tempRenderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });

    const originalFOV = this._camera.fov;
    const originalNear = this._camera.near;
    const originFar = this._camera.far;

    // Landscape aspect ratio for homepage (16:9 or 2:1)
    const landscapeWidth = 2400;   // Wide landscape
    const landscapeHeight = 1200;  // 2:1 aspect ratio
    const tempAspectRatio = landscapeWidth / landscapeHeight;

    const tempCamera = new THREE.PerspectiveCamera(
        originalFOV,
        tempAspectRatio,
        originalNear,
        originFar
    );

    // Copy camera position
    tempCamera.position.copy(this._camera.position);

    tempRenderer.setSize(landscapeWidth, landscapeHeight);
    tempRenderer.render(this._scene, tempCamera);

    setTimeout(() => {
        tempRenderer.domElement.toBlob((blob) => {
            const url = URL.createObjectURL(blob as Blob);
            const link = document.createElement("a");

            // No need to add to capturedImages array for homepage image
            // Just download directly
            link.href = url;
            link.download = "ScreenshotSweet_Homepage_Hero.png";
            link.click();

            // Clean up
            tempRenderer.dispose();
        }, "image/png", 1.0);
    }, 50);

    // Restore helper visibility
    helperVisibility.forEach((wasVisible, helper) => {
        helper.visible = wasVisible;
    });

    this.setImageCaptured(false);
}

    //nneds to reset the camera position when psrites are removed might have to move this out of thid class
    /*
    public decreaseCameraHeightForAboveImage() : void {
        this._camera.position.y = this._camera.position.y + 0.5;
    }
        */

    public increaseCameraHeight() :  boolean {
        console.log(this._camera.position.y)
        if(this._camera.position.y <= 0.5) {
            this._camera.position.y = this._camera.position.y + 0.1;
            return true;
        }
        return false;
    }


    public decreaseCameraHeight() :  boolean {
        if(this._camera.position.y >= -0.5) {
            this._camera.position.y = this._camera.position.y - 0.1;
            return true;
        }
        return false;
    }


    public zoomCameraIn() : boolean {
        if(this._camera.position.z >= 4.0) {
            this._camera.position.z = this._camera.position.z - 0.1;
            return true;
        }
        return false;
    }

    public zoomCameraOut() : boolean{
        if(this._camera.position.z <= 5.1) {
            this._camera.position.z = this._camera.position.z + 0.1;
            return true;
        }
        return false;
    }

    public resetCamera() : void {
        this._camera.position.y = 0;
    }

    public resetZoom() : void {
        this._camera.position.z = 5;
    }


  
}

export{CameraManager}