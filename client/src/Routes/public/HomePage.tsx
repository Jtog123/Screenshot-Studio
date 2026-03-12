import NavigationBar from "../../NavigationBar"
import { useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';


export default function HomePage() {

    const fov : number = 60; //75
    const aspect : number = (window.innerWidth /2) / window.innerHeight;
    const near : number = 0.1;
    const far : number = 10000;

    const mountRef = useRef<HTMLDivElement | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

    const [homePhone, setHomePhoneModel] = useState<THREE.Group | null>(null);
    const [homePhoneScreen, setHomePhoneScreen] = useState<THREE.Mesh | null>(null);
    const [isPhoneLoading, setIsPhoneLoading] = useState(true);
    //const [phone, setPhoneModel] = useState<THREE.Group | null>(null);
    const [isSceneReady, setIsSceneReady] = useState(false);




    useEffect(() => {
        if(!mountRef.current) return;

        const loader = new GLTFLoader();

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true});

        // Store in refs
        sceneRef.current = scene;
        cameraRef.current = camera;
        rendererRef.current = renderer;

        renderer.setSize( window.innerWidth / 2, window.innerHeight);
        

        renderer.domElement.style.position = "relative";
        renderer.domElement.style.display = "block";


        mountRef.current.appendChild(renderer.domElement);


        camera.position.z = 5;
        camera.position.y = 0.25;

        let homePhoneModel: THREE.Group | null = null;

        loader.loadAsync("/models/phone2/iphoneMyModel13.glb").then(gltf => {
            let phoneBody : THREE.Mesh | null = null;
            let phoneScreen : THREE.Mesh | null = null;
        
            gltf.scene.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    if (child.name === 'phone_screen') {
                        phoneScreen = child;
                        setHomePhoneScreen(child);
                    } else if (child.name === 'phone_body') {
                        phoneBody = child;
                    }
                }
        });

        gltf.scene.scale.set(0.25, 0.25, 0.25);
        scene.add(gltf.scene);
        homePhoneModel = gltf.scene;
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
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                //texture.anisotropy = 16; // Sharper edges at angles
    
                phoneScreen!.material = new THREE.MeshBasicMaterial({ 
                map: texture,
                toneMapped: false // Prevents scene lights from changing screenshot colors
                });
    
                setHomePhoneModel(gltf.scene);
                //no longer loading
                setIsPhoneLoading(false);
                setIsSceneReady(true);
            });
            } else {
                setHomePhoneModel(gltf.scene);
                //no longer loading
                setIsPhoneLoading(false);
                setIsSceneReady(true);
    
            }
            
        }).catch(err => console.error('Failed to load phone model:', err));

        let rotatationDirection = 0.005;

        //run function
        const run = () => {
            requestAnimationFrame(() => run());
            if(homePhoneModel) {
                homePhoneModel.rotation.y += rotatationDirection;
                
                if(homePhoneModel.rotation.y >= 1) {
                    homePhoneModel.rotation.y = 1;
                    rotatationDirection = -0.01;
                } else if(homePhoneModel.rotation.y <= -1){ 
                    homePhoneModel.rotation.y = -1;
                    rotatationDirection = 0.01;
                }
                

            }

            renderer.render(scene, camera);
        }

        //run the animation loop
        run();

            
        


        //clean up the ref
        return () => {
            if(mountRef.current) {
                mountRef.current?.removeChild(renderer.domElement);
            }
            if(homePhone) {
                scene.remove(homePhone);
            }

            renderer.dispose();
            //geometry.dispose();
            //material.dispose();
        };





    },[]);

        //Automatically resize the window
    useEffect(() => {
        const handleResize = () => {
            const camera = cameraRef.current;
            const renderer = rendererRef.current;

            if (camera && renderer) {
                camera.aspect = (window.innerWidth / 2) / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth / 2, window.innerHeight);
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []); 





    return(
        <>
        <div>
            <NavigationBar/>
            <div className="fixed flex w-[100%] h-[100%] z-20 bg-stone-700">
                
                <div className="leftSide bg-red-500 h-[100%] w-[50%]">
                </div>

                <div  className="rightSide bg-cream-golden h-[100%] w-[50%]  ">
                     {/*Phone Demo here */}
                    <div ref={mountRef} className="phoneDiv">

                    </div>
                   
                </div>

            </div>
        </div>

        </>
    )
}