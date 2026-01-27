import * as THREE from 'three'
import {GLTF, GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {useRef, useEffect, useState} from 'react'

import App from './App'
//import PhoneModel from './PhoneModel';


interface SceneManagerProps {
    _scene : THREE.Scene;
    _camera : THREE.PerspectiveCamera;
    _renderer : THREE.WebGLRenderer;

}

export default function SceneManager({_scene, _camera, _renderer}: SceneManagerProps) {

    // kind of like member vairables in a class
    const mountRef = useRef<HTMLDivElement | null>(null);
    //const sceneRef = useRef<THREE.Scene | null>(null);
    //const loaderRef = useRef<GLTFLoader | null>(null);
    //const [loader, setLoader] = useState<GLTFLoader | null>(null);
    //const _scene = scene;

    //kind of like constructor
    useEffect(() => {
        if(!mountRef.current) return;

        //set renderer size
        _renderer.setSize(window.innerWidth, window.innerHeight);

        //Append renderers DOM elelemnt to ref's current element
        mountRef.current.appendChild(_renderer.domElement);

        //set initial camera pos
        //_camera.position.z = 4.5;
        _camera.position.z = 5;
        //_camera.position.y=0.5;

        //Grid
        const size = 20;
        const divisions = 20;
        const _grid = new THREE.GridHelper(size, divisions);
        _grid.position.y = -2;
        _scene.add(_grid);

        //run function
        const run = () => {
            requestAnimationFrame(() => run());
            _renderer.render(_scene, _camera);
        }

        //run the animation loop
        run();


        //clean up the ref
        return () => {
            mountRef.current?.removeChild(_renderer.domElement);
        };

    }, []);
    
    
    return (
        //Mount the app on this div
        <>
            <div ref={mountRef} className="fixed top-0 left-0 z-0">
                

            </div>
        </>
    )
}