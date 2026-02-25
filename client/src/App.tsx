import '@fontsource/roboto/400.css';
import '@fontsource/roboto/700.css';
import '@fontsource/open-sans/400.css';
import '@fontsource/open-sans/700.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/700.css';
import '@fontsource/lato/400.css';
import '@fontsource/lato/700.css';



import SceneManager from "./SceneManager.js"
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Toolbar from "./Toolbar.js"
import { LightManager } from "./LightManager.js";
import { CameraManager } from "./CameraManager.js";
import { GradientBackground } from "./GradientBackground.js";
import PhoneGUI from "./PhoneGUI.js";
import Overlay from "./Overlay.js";
import { ImageComponentInterface, ScreenTextureInterface, TextComponentInterface, CapturedImage } from "./ComponentInterfaces.js";
import ImageComponent from "./ImageComponent.js";
import TextComponent from "./TextComponent.js";
import { AssetManager } from "./AssetManager.js";
import { JSX } from "react";
import TextComponentGUI from "./TextComponentGUI.js";
import TestFonts from './TestFonts.js';




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
  const [isSceneReady, setIsSceneReady] = useState(false);

  //const phoneRef = useRef<THREE.Group | null>(null);
  const [gradientBackground , setGradientBackground] = useState<GradientBackground | null>(null);

  const [lightManager, setLightManager] = useState<LightManager | null>(null);
  const [assetManager, setAssetManager] = useState<AssetManager | null>(null);
  const [cameraManager, setCameraManager] = useState<CameraManager | null>(null);
  const [isPhoneLoading, setIsPhoneLoading] = useState(true);
  const [imageComponents, setImageComponents] = useState<ImageComponentInterface[]>([]);
  //const [screenTextures, setScreenTextures] = useState<ScreenTextureInterface[]>([]);
  const [textComponents, setTextComponents] = useState<JSX.Element[]>([]);

  //phone screen to pass
  const [_phoneScreen, setPhoneScreen] = useState<THREE.Mesh | null>(null);
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);

  const [activeListItems, setActiveListItems] = useState<{id:string, name:string}[]>([]);

  const[isImageCaptured, setImageCaptured] = useState(false);

  const[fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setTimeout(() => {
        setFontsLoaded(true);
      },100)
    })
  })


  
  
  // 
  function addTextComponent() : void {
    if(!fontsLoaded) {
      return;
    }

    const newText = (
        <TextComponent 
          key={`text_${Date.now()}`} 
          position="above"
          assetManager={assetManager!}


            onMount={(id, name) => {
              setActiveListItems(prev => [...prev, { id, name }]);
          }}
            onUnmount={(id) => {
              setActiveListItems(prev => prev.filter(item => item.id !== id));
          }}
        />
    );
    setTextComponents([...textComponents, newText]);
  }


  //everytime a user adds a new screenshot we create a new mesh, 7 possible in total,
  // we then can toggle the meshes on and off
  

  //const sceneRef = useRef<THREE.Scene | null>(null);


  //Click the directional Light Button create a directional light with helper
  //init the raycaster!!!!!!!!!!!!!!!!!!

  useEffect(() => {

    //SET THE SCENE, CAMERA, RENDER, RAYCASTER, LIGHTMANAGER HERE
    // PROP DRILL THEM AS NEEDED

    const _scene = new THREE.Scene();
    setScene(_scene);

    const _renderer = new THREE.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
    _renderer.outputColorSpace = THREE.SRGBColorSpace;
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

    const _cameraManager = new CameraManager(_scene, _camera ,_renderer, setCapturedImages, setImageCaptured);
    setCameraManager(_cameraManager);

    const _assetManager = new AssetManager(_scene, _raycaster, _renderer, _camera);
    setAssetManager(_assetManager);

    const _gradientBackground = new GradientBackground(_scene);
    setGradientBackground(_gradientBackground);


    const loader = new GLTFLoader();

    //Add the light group
    _scene.add(_lightManager._lightGroup);

    //add the imagecomponentgroup
    _scene.add(_assetManager._assetGroup);



    //raycaster
    _renderer.domElement.addEventListener("mousedown", (evt: MouseEvent) => {
      _lightManager.selectLight(evt);
      _assetManager.selectComponent(evt);

    });

    //Load the Model
    /*
    loader.loadAsync("/models/phone/iphone17CleanSceneTest.gltf").then(gltf => {
        setPhoneModel(gltf.scene);
        //no longer loading
        setIsPhoneLoading(false);
        _scene.add(gltf.scene);
    }).catch(err => console.error('Failed to load phone model:', err))
    */

    
    loader.loadAsync("/models/phone2/iphoneMyModel13.glb").then(gltf => {
        let phoneBody : THREE.Mesh | null = null;
        let phoneScreen : THREE.Mesh | null = null;

        gltf.scene.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            if (child.name === 'phone_screen') {
                phoneScreen = child;
                setPhoneScreen(child);
            } else if (child.name === 'phone_body') {
                phoneBody = child;
            }
          }
        });



        gltf.scene.scale.set(0.25, 0.25, 0.25);
        _scene.add(gltf.scene);

        // allow users to add multiple photos, add to an array of some kind
        // pass it down through the toolbar to toolbarImgandText


        //pass phoneScreen down to ToolBarImg, move this logic into there
        if (phoneScreen) {
          const textureLoader = new THREE.TextureLoader();
          textureLoader.load('/baseAsset.png', (texture) => {
            texture.flipY = false;
            texture.colorSpace = THREE.SRGBColorSpace; // Corrects the "washed out" red
            texture.minFilter = THREE.LinearFilter;
            texture.magFilter = THREE.NearestFilter; // Sharpest
            texture.anisotropy = _renderer.capabilities.getMaxAnisotropy();
            //texture.anisotropy = 16; // Sharper edges at angles

            phoneScreen!.material = new THREE.MeshBasicMaterial({ 
              map: texture,
              toneMapped: false // Prevents scene lights from changing screenshot colors
            });

            setPhoneModel(gltf.scene);
            //no longer loading
            setIsPhoneLoading(false);
            setIsSceneReady(true);
          });
        } else {
            setPhoneModel(gltf.scene);
            //no longer loading
            setIsPhoneLoading(false);
            setIsSceneReady(true);

        }
          


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




  ////// END TEST CODE



  //{scene && <Toolbar scene={scene}/>} Making sure scene is not null
  return (
    <>
      {isSceneReady && phone && cameraManager &&<PhoneGUI phoneModel={phone} _cameraManager={cameraManager}/>}


      {scene && lightManager && cameraManager && phone && assetManager && camera && gradientBackground && _phoneScreen &&<Toolbar _scene={scene} _lightManager={lightManager} _phoneModel={phone} _cameraManager={cameraManager} _imageComponents={imageComponents} _setImageComponents={setImageComponents}  _assetManager={assetManager} activeListItems={activeListItems} setActiveListItems={setActiveListItems} addTextComponent={addTextComponent} camera={camera} _gradientBackground={gradientBackground} _phoneScreen={_phoneScreen} capturedImages={capturedImages} setCapturedImages={setCapturedImages} />} 

      {scene && assetManager && camera && imageComponents.map((item) => {
        return <ImageComponent key={item.id} position={item.position} _scene={scene} _camera={camera} _assetManager={assetManager} activeListItems={activeListItems} setActiveListItems={setActiveListItems}/>
      })}

      {textComponents}

      {isPhoneLoading ? (<h1>Loading</h1>) : (scene && camera && renderer && <SceneManager _scene={scene} _camera={camera} _renderer={renderer}/>)}
  
      <Overlay/>

      
      
      
    </>
  )
}