import { useEffect } from 'react';
import * as THREE from 'three'


//when toggling between lr and ud gradients reemberbmer the colors that were in the inputs

class GradientBackground {

    private _gradientPlaneMesh : THREE.Mesh | null = null;
    private _gradientMaterial : THREE.ShaderMaterial | null = null;
    private _scene : THREE.Scene;


    public prevColor1 : string  | null = null;
    public prevColor2 : string  | null = null;

    

    private leftToRightFragmentShader = `
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform float uGradientScale;
            varying vec2 vUv;

            void main() {
                float t = (vUv.x - 0.5) * uGradientScale + 0.5;
                t = clamp(t, 0.0, 1.0);

                vec3 color = mix(uColor1, uColor2, t);
                gl_FragColor = vec4(color, 1.0);
            }
        `;

    //invert the colors position here here    
    private UpDownFragmentShader = `
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            uniform float uGradientScale;
            varying vec2 vUv;

            void main() {
                float t = (vUv.y - 0.5) * uGradientScale + 0.5;
                t = clamp(t, 0.0, 1.0);

                vec3 color = mix(uColor2, uColor1, t);
                gl_FragColor = vec4(color, 1.0);
            }
        `;

    constructor(scene : THREE.Scene) {
        this._scene = scene;
    }


    public turnLeftRightGradientOn(color1 : string = "#FF0000", color2 : string = "#0000FF") : void {
        
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = this.leftToRightFragmentShader;

        //convert colors
        const threeColor1 = new THREE.Color(color1).convertSRGBToLinear();
        const threeColor2 = new THREE.Color(color2).convertSRGBToLinear();

        this._gradientMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor1 : {value : new THREE.Vector3(threeColor1.r, threeColor1.g , threeColor1.b)},
                uColor2 : {value : new THREE.Vector3(threeColor2.r, threeColor2.g , threeColor2.b)},
                uGradientScale : {value : 2.5}
            },
            depthWrite : false
        });

        const geometry = new THREE.PlaneGeometry(20, 20);
        this._gradientPlaneMesh = new THREE.Mesh(geometry, this._gradientMaterial);
        this._gradientPlaneMesh.position.set(0, 0, -2);
        this._scene.add(this._gradientPlaneMesh);
    }

    public turnUpDownGradientOn(color1 : string = "#FF0000", color2 : string = "#0000FF") : void {
        
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = this.UpDownFragmentShader;

        //convert colors
        const threeColor1 = new THREE.Color(color1).convertSRGBToLinear();
        const threeColor2 = new THREE.Color(color2).convertSRGBToLinear();

        this._gradientMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor1 : {value : new THREE.Vector3(threeColor1.r, threeColor1.g , threeColor1.b)},
                uColor2 : {value : new THREE.Vector3(threeColor2.r, threeColor2.g , threeColor2.b)},
                uGradientScale : {value : 2.5}
            },
            depthWrite : false
        });

        const geometry = new THREE.PlaneGeometry(20, 20);
        this._gradientPlaneMesh = new THREE.Mesh(geometry, this._gradientMaterial);
        this._gradientPlaneMesh.position.set(0, 0, -2);
        this._scene.add(this._gradientPlaneMesh);
    }

    //pass the colors here?
    public switchGradientDirection(isLeftToRightGradient : boolean) : void {
        if(this._gradientMaterial) {
            this._gradientMaterial.fragmentShader = isLeftToRightGradient ? this.leftToRightFragmentShader : this.UpDownFragmentShader;

            this._gradientMaterial.needsUpdate = true;
        }
        
        
    }

    public updateGradientColors(color1: string, color2: string) : void {
        if(this._gradientMaterial) {
            const threeColor1 = new THREE.Color(color1).convertSRGBToLinear();
            const threeColor2 = new THREE.Color(color2).convertSRGBToLinear();
            console.log(threeColor1," " ,threeColor2)

            this._gradientMaterial.uniforms.uColor1.value.set(threeColor1.r, threeColor1.g, threeColor1.b);
            this._gradientMaterial.uniforms.uColor2.value.set(threeColor2.r, threeColor2.g, threeColor2.b);

        }

    }

    public turnGradientBackgroundOff() : void {
        if(this._gradientPlaneMesh) {
            this._scene.remove(this._gradientPlaneMesh);

            if(this._gradientPlaneMesh.geometry) {
                this._gradientPlaneMesh.geometry.dispose();
            }

            if(this._gradientPlaneMesh.material) {
                (this._gradientPlaneMesh.material as THREE.ShaderMaterial).dispose();
            }

            this._gradientPlaneMesh = null;
            this._gradientMaterial = null;
        }

    }


}

export {GradientBackground}




     
    //Fragment shader = colors/appearance, 
    //Vertex shader = shape/position

      /*shader code testing*/




