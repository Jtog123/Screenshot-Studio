import * as THREE from 'three'
import {GLTF, GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {useRef, useEffect, useState} from 'react'
import App from './App'
//import PhoneModel from './PhoneModel';

//CAMERA ARGS
const _fov : number = 75;
const _aspect : number = window.innerWidth / window.innerHeight;
const _near : number = 0.1;
const _far : number = 10000;

interface SceneManagerProps {
    scene : THREE.Scene;
}

export default function SceneManager({scene}: SceneManagerProps) {

    // kind of like member vairables in a class
    const mountRef = useRef<HTMLDivElement | null>(null);
    //const sceneRef = useRef<THREE.Scene | null>(null);
    //const loaderRef = useRef<GLTFLoader | null>(null);
    //const [loader, setLoader] = useState<GLTFLoader | null>(null);
    //const _scene = scene;

    //kind of like constructor
    useEffect(() => {
        if(!mountRef.current) return;

        console.log("here")

        //SCENE, CAMERA, RENDERER, PHONE MODEL LOADER
        //const _scene = new THREE.Scene();
        const _scene = scene;
        const _camera = new THREE.PerspectiveCamera(
            _fov, _aspect, _near, _far
        );

        const _renderer = new THREE.WebGLRenderer();
        //const _loader = new GLTFLoader();

        //assign the refs
        //sceneRef.current = _scene;
        //loaderRef.current = _loader;
        //setLoader(_loader);

        //set renderer size
        _renderer.setSize(window.innerWidth, window.innerHeight);

        //Append renderers DOM elelemnt to ref's current element
        mountRef.current.appendChild(_renderer.domElement);

        //set initial camera pos
        _camera.position.z = 5;

        //add test light
        const light = new THREE.DirectionalLight(0xFFFFFF, 5);
        light.position.setY(2);
        _scene.add(light);

        //RAY CASTING
        const _raycaster = new THREE.Raycaster();

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


        const updateBackgroundColor = (evt: Event) => {
            const selectedColor = evt.target as HTMLInputElement;
            let colorString = selectedColor.value.replace("#", "0x");

            const colorValue = Number(colorString);
            _scene.background = new THREE.Color().setHex(colorValue);
        }


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