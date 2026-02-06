import { useEffect } from 'react';
import * as THREE from 'three'

class GradientBackground {

    private _gradienPlaneMesh : THREE.Mesh;
    private _gradientMaterial : THREE.ShaderMaterial

    constructor(scene : THREE.Scene) {
        const vertexShader = `
            varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `;

        const fragmentShader = `
            uniform float u_time;
            varying vec2 vUv;
            void main() {
                gl_FragColor = vec4(vUv.y, 0.9 - vUv.x, 0.0, 1.0);
                }
        `;

        this._gradientMaterial = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                u_time : {value: 0.0}
            }
        })

        const geometry = new THREE.PlaneGeometry(20, 20);

        this._gradienPlaneMesh = new THREE.Mesh(geometry, this._gradientMaterial);

        this._gradienPlaneMesh.position.set(0, 0, -2);

        scene.add(this._gradienPlaneMesh);

    }
}

export {GradientBackground}




     
    //Fragment shader = colors/appearance, 
    //Vertex shader = shape/position

      /*shader code testing*/




