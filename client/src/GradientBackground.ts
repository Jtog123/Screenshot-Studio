import { useEffect } from 'react';
import * as THREE from 'three'

class GradientBackground {

    private _gradientPlaneMesh : THREE.Mesh | null = null;
    private _gradientMaterial : THREE.ShaderMaterial | null = null;
    private _isGradientToggled : boolean = false;
    private _scene : THREE.Scene;

    constructor(scene : THREE.Scene) {
        this._scene = scene;
    }


    public turnGradientBackgroundOn(color1 : string = "#FF0000", color2 : string = "#0000FF") : void {
        
        const vertexShader = `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform vec3 uColor1;
            uniform vec3 uColor2;
            varying vec2 vUv;

            void main() {
                vec3 color = mix(uColor1, uColor2, vUv.x);
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        //convert colors
        const threeColor1 = new THREE.Color(color1);
        const threeColor2 = new THREE.Color(color2);

        this._gradientMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                uColor1 : {value : new THREE.Vector3(threeColor1.r, threeColor1.g , threeColor1.b)},
                uColor2 : {value : new THREE.Vector3(threeColor2.r, threeColor2.g , threeColor2.b)}
            },
            depthWrite : false
        })

        const geometry = new THREE.PlaneGeometry(20, 20);
        this._gradientPlaneMesh = new THREE.Mesh(geometry, this._gradientMaterial);
        this._gradientPlaneMesh.position.set(0, 0, -2);
        this._scene.add(this._gradientPlaneMesh);
    }

    public updateGradientColors(color1: string, color2: string) : void {
        if(this._gradientMaterial) {
            const threeColor1 = new THREE.Color(color1);
            const threeColor2 = new THREE.Color(color2);

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




