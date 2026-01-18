import * as THREE from 'three'
import {GLTF, GLTFLoader} from 'three/addons/loaders/GLTFLoader.js'
import {useRef, useEffect} from 'react'
import App from './App'

//CAMERA ARGS
const _fov : number = 75;
const _aspect : number = window.innerWidth / window.innerHeight;
const _near : number = 0.1;
const _far : number = 10000;


export default function SceneManager() {

    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(!mountRef.current) return;

        //SCENE, CAMERA, RENDERER, PHONE MODEL LOADER
        const _scene = new THREE.Scene();
        const _camera = new THREE.PerspectiveCamera(
            _fov, _aspect, _near, _far
        );

        const _renderer = new THREE.WebGLRenderer();
        const _loader = new GLTFLoader();

        //set renderer size
        _renderer.setSize(window.innerWidth, window.innerHeight);

        //Append renderers DOM elelemnt to ref's current element
        mountRef.current.appendChild(_renderer.domElement);

        //set initial camera pos
        _camera.position.z = 5;


        //RAY CASTING
        const _raycaster = new THREE.Raycaster();

        //const _phoneModel : PhoneModel;

        //Grid
        const size = 20;
        const divisions = 20;
        const _grid = new THREE.GridHelper(size, divisions);
        _grid.position.y = -2;
        _scene.add(_grid);


        //clean up the ref
        return () => {
            mountRef.current?.removeChild(_renderer.domElement);
        };

    }, []);
    
    
    return (
        //Mount the app on this div
        <>
            <div ref={mountRef}> </div>
        </>
    )
}