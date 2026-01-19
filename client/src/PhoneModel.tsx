import { useEffect } from 'react';
import * as THREE from 'three';
import { GLTF, GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
//import { PhoneGUI } from './PhoneGui.js';


interface PhoneModelProps {
    scene: THREE.Scene,
    loader: GLTFLoader
}


export default function PhoneModel({scene, loader}: PhoneModelProps) {

    useEffect(() => {

        let phone : THREE.Group | null = null;

        const loadPhone = async() => {
            try {
                const gltf = await loader.loadAsync("../models/phone/iphone17CleanSceneTest.gltf"); 
                phone = gltf.scene;
                scene.add(phone);
            } catch (err : unknown) {
                throw err;
            }
        }

        // call the function
        loadPhone();

        //remove on unmount
        return() => {
            if(phone) {
                scene.remove(phone);
            }
        }



    }, [scene, loader])
    //run when the scene or loader changes

    return (<></>)
}

