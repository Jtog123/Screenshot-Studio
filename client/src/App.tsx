import SceneManager from "./SceneManager.js"
import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Toolbar from "./Toolbar.js"

export default function App() {
  //const mountRef = useRef<HTMLDivElement | null>(null);
  const [scene, setScene] = useState<THREE.Scene | null>(null);
  const [phone, setPhoneModel] = useState<THREE.Group | null>(null);
  const [isPhoneLoading, setIsPhoneLoading] = useState(true);
  //const sceneRef = useRef<THREE.Scene | null>(null);

  useEffect(() => {

    //scene
    const _scene = new THREE.Scene();
    setScene(_scene);

    const loader = new GLTFLoader();

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

  //{scene && <Toolbar scene={scene}/>} Making sure scene is not null
  return (
    <>
      {scene && <Toolbar scene={scene} />} 
      {isPhoneLoading ? (<h1>Loading</h1>) : (scene && <SceneManager scene={scene}/>)}
      
      
      {/*<LightManager/>*/}


      {/* UI */}
    </>
  )
}