import SceneManager from "./SceneManager.js"
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Toolbar from "./Toolbar.js"
import { LightManager } from "./LightManager.js";
import { CameraManager } from "./CameraManager.js";
import PhoneGUI from "./PhoneGUI.js";
import Overlay from "./Overlay.js";
import CameraButton from "./CameraButton.js";
import ImageComponent from "./ImageComponent.js";
import { AssetManager } from "./AssetManager.js";


interface ImageComponent{
    id: number,
    position: string,
    type: string
}

export default function App() {

  //CAMERA ARGS
  const _fov : number = 60; //75
  const _aspect : number = window.innerWidth / window.innerHeight;
  const _near : number = 0.1;
  const _far : number = 10000;

  //const mountRef = useRef<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [camera, setCamera] = useState<THREE.PerspectiveCamera | null>(null);
  const [raycaster, setRayCaster] = useState<THREE.Raycaster | null>(null);
  const [renderer, setRenderer] = useState<THREE.WebGLRenderer | null>(null);
  const [phone, setPhoneModel] = useState<THREE.Group | null>(null);

  const [lightManager, setLightManager] = useState<LightManager | null>(null);
  const [assetManager, setAssetManager] = useState<AssetManager | null>(null);
  const [cameraManager, setCameraManager] = useState<CameraManager | null>(null);
  const [isPhoneLoading, setIsPhoneLoading] = useState(true);
  const [imageComponents, setImageComponents] = useState<ImageComponent[]>([]);
  
  
  


  //const sceneRef = useRef<THREE.Scene | null>(null);


  //Click the directional Light Button create a directional light with helper
  //init the raycaster!!!!!!!!!!!!!!!!!!

  useEffect(() => {

    //SET THE SCENE, CAMERA, RENDER, RAYCASTER, LIGHTMANAGER HERE
    // PROP DRILL THEM AS NEEDED

    const _scene = new THREE.Scene();
    setScene(_scene);

    const _renderer = new THREE.WebGLRenderer({preserveDrawingBuffer:true});
    setRenderer(_renderer);

    const _camera = new THREE.PerspectiveCamera(
      _fov,_aspect,_near,_far
    );
    setCamera(_camera);

    const _raycaster = new THREE.Raycaster();
    setRayCaster(_raycaster);

    //State variables arent set till after useEffect completes so use locals
    const _lightManager = new LightManager(_raycaster, _renderer, _camera, _scene);
    setLightManager(_lightManager);

    const _cameraManager = new CameraManager(_scene, _camera ,_renderer);
    setCameraManager(_cameraManager);

    const _assetManager = new AssetManager(_scene);
    setAssetManager(_assetManager);


    const loader = new GLTFLoader();

    //Add the light group
    _scene.add(_lightManager._lightGroup);

    //raycaster
    _renderer.domElement.addEventListener("mousedown", (evt: MouseEvent) => {
      _lightManager.selectLight(evt);
    //manager.selectLight(evt);
    });

    //Load the Model
    loader.loadAsync("/models/phone/iphone17CleanSceneTest.gltf").then(gltf => {
        setPhoneModel(gltf.scene);
        //no longer loading
        setIsPhoneLoading(false);
        _scene.add(gltf.scene);
    }).catch(err => console.error('Failed to load phone model:', err))

    //remove on unmount
    return() => {
          if(phone) {
              _scene.remove(phone);
          }
    }


  },[]);

  //Automatically resize the window
  useEffect(() => {
    window.addEventListener("resize", () => {
      console.log("resizing");
      //(renderer as THREE.WebGLRenderer).setSize(window.innerWidth, window.innerHeight);
    })
  },[])

  //{scene && <Toolbar scene={scene}/>} Making sure scene is not null
  return (
    <>
      {phone && cameraManager &&<PhoneGUI phoneModel={phone} _cameraManager={cameraManager}/>}


      {scene && lightManager && cameraManager && phone && <Toolbar _scene={scene} _lightManager={lightManager} _phoneModel={phone} _cameraManager={cameraManager} _imageComponents={imageComponents} _setImageComponents={setImageComponents} />} 

      {scene && assetManager && imageComponents.map((item) => {
        return <ImageComponent key={item.id} _scene={scene} _assetManager={assetManager}/>
      })}



      {isPhoneLoading ? (<h1>Loading</h1>) : (scene && camera && renderer && <SceneManager _scene={scene} _camera={camera} _renderer={renderer}/>)}
  
      <Overlay/>

      
      
    </>
  )
}