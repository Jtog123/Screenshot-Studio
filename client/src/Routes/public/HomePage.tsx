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
        let isVisible = true;

        //stops lag on scroll up by pausing the animation on the phone
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                });
            },
            { threshold: 0.1 }  // Trigger when 10% visible
        );

        if(mountRef.current) {
            observer.observe(mountRef.current);
        }

        

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

        let rotatationDirection = 0.001;

        //run function
        const run = () => {
            requestAnimationFrame(() => run());
            if(homePhoneModel) {
                homePhoneModel.rotation.y += rotatationDirection;
                
                if(homePhoneModel.rotation.y >= 1) {
                    homePhoneModel.rotation.y = 1;
                    rotatationDirection = -0.001;
                } else if(homePhoneModel.rotation.y <= -1){ 
                    homePhoneModel.rotation.y = -1;
                    rotatationDirection = 0.001;
                }
                

            }

            renderer.render(scene, camera);
        }

        //run the animation loop
        run();

            
        


        //clean up the ref
        return () => {
            observer.disconnect();

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





    return (
        <>
            <NavigationBar />
            
            {/* Hero Section - Split Left/Right */}
            <section className="flex w-full min-h-screen bg-stone-700">
                
                {/* Left Side - Content */}
                <div className="flex leftSide justify-center items-center bg-stone-600 w-1/2">
                    <div className="flex flex-col w-4/5 max-w-2xl">
                        <h1 className="text-white text-7xl mb-6">Dynamic Mock Ups</h1>
                        
                        <h2 className="text-white/70 text-2xl mb-10">
                            Making your app stand out has never been easier
                        </h2>
                        
                        <button className="bg-orange-vibrant hover:bg-orange-deep text-white rounded-xl w-[140px] h-[70px] transition-colors cursor-pointer">
                            Join For Free
                        </button>
                    </div>
                </div>

                {/* Right Side - Phone Demo */}
                <div className="rightSide bg-stone-700 w-1/2 flex items-center justify-center">
                    <div ref={mountRef} className="phoneDiv w-full h-full"></div>
                </div>
                
            </section>

            {/* Features Section */}
            <section className="w-full min-h-screen bg-cream-vanilla p-20">
                <h2 className="text-text-espresso text-5xl text-center mb-12">Features</h2>
                <div className="grid grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {/* Feature cards go here */}
                    <div className="bg-cream-custard p-8 rounded-xl">
                        <h3 className="text-2xl mb-4">Phone Modeling</h3>
                        <p className="text-coffee ">
                        Rotate, tilt, and position your device 
        at the perfect angle to showcase your app in a professional, eye-catching way.</p>
                    </div>
                    <div className="bg-cream-custard p-8 rounded-xl">
                        <h3 className="text-2xl mb-4">Custom Scene</h3>
                        <p className="text-coffee ">
                            Build the perfect environment with custom backgrounds, dynamic lighting controls, and 
        editable text elements. Create anything from minimal backdrops to vibrant gradients 
        scenes that match your brand.</p>
                    </div>
                    <div className="bg-cream-custard p-8 rounded-xl">
                        <h3 className="text-2xl mb-4">Add your Assets</h3>
                        <p className="text-coffee ">
                            Upload your app screenshots, logo, and custom images directly into the scene. 
                            Position and scale elements freely to create mockups that perfectly represent your 
                            product's unique identity. </p>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="w-full min-h-screen bg-stone-600 p-20 flex items-center justify-center">
                <div className="max-w-4xl text-center">
                    <h2 className="text-white text-5xl mb-12">How It Works</h2>
                    <p className="text-white/80 text-xl">
                        Three simple steps to create stunning mockups
                    </p>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full min-h-screen bg-orange-vibrant flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-white text-6xl mb-8">Ready to get started?</h2>
                    <button className="bg-white text-orange-vibrant px-12 py-6 rounded-xl text-2xl hover:bg-cream-vanilla transition-colors">
                        Start Creating
                    </button>
                </div>
            </section>
        </>
    );
}