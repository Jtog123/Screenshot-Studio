import NavigationBar from "../../NavigationBar"
import { useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import ScrollFadeIn from "../../ScrollFadeIn";


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
            <ScrollFadeIn >
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
            </ScrollFadeIn>

            
            <section className="w-full bg-stone-900 py-20">
                <ScrollFadeIn>
                <h2 className="text-center text-white text-4xl mb-4">
                    The Mockup Frustration Index
                </h2>
                <p className="text-center text-white/70 text-xl mb-12">
                    Time spent vs Sanity lost
                </p>
                <p className="text-center text-white/70">
                    Note how as time increases you grow more insane
                </p>
                <div className="chart container">
                    {/* Create teh chart first then figure out how to fill it with data */}

                </div>

                </ScrollFadeIn>
                
 
            </section>
 
            
            <section className="w-full min-h-screen bg-stone-700 p-20">
                <ScrollFadeIn>
                <h2 className="text-text-espresso text-5xl text-center mb-12">
                    {/*Beautiful Mockups Without the Learning Curve*/}
                    Skip The Design Tools
                </h2>
                <p className="text-coffee text-center text-xl mb-16">
                    No Figma. No Photoshop. No tutorials. <span className="text-orange-zest text-xl">Appstore ready screenshots in minutes.</span>
                </p>

                
                <div className="grid grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* Step 1 */}
                    <div className="text-center">

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-orange-vibrant text-white flex items-center justify-center font-bold">
                                1
                            </div>
                            <h3 className="text-text-espresso text-2xl font-semibold">
                                Position Your Model
                                {/*embed the phone controls without functionality? show the controls? */}
                            </h3>
                            
                        </div>
                        <p className="text-text-coffee leading-relaxed">
                            Rotate, tilt, and position your device at the perfect angle using intuitive controls
                        </p>
                        {/* Graphics Here Phone being angled */}
                    </div>
                    
                    {/* Step 2 */}
                    <div className="text-center">

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-orange-vibrant text-white flex items-center justify-center font-bold">
                                2
                            </div>
                            <h3 className="text-text-espresso text-2xl font-semibold">
                                Style Your Scene
                                {/*picture of a nice background with asset added? */}
                            </h3>
                        </div>
                        <p className="text-text-coffee leading-relaxed">
                            Choose backgrounds, add lighting, and upload your app screenshots to create the perfect look
                        </p>
                        {/* Graphics Here Phone with Light an logo */}
                    </div>
                    
                    {/* Step 3 */}
                    <div className="text-center">

                        <div className="flex items-center justify-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-full bg-orange-vibrant text-white flex items-center justify-center font-bold">
                                3
                            </div>
                            <h3 className="text-text-espresso text-2xl font-semibold">
                                Easy Export
                                {/*finished screenshot? */}
                            </h3>
                        </div>
                        <p className="text-text-coffee leading-relaxed">
                            Download your professional mockup in high resolution, ready for the appstore
                        </p>

                        {/* Graphics Here camera button? */}
                    </div>
                </div>
                

                {/* ONE Dramatic Hero Result */}
                    <ScrollFadeIn>
                    <div className=" overflow-hidden -mt-16 scale-120">
                        
                        <img 
                            src="/TransparentHero2.png" 
                            alt="Professional phone mockup with gradient background"
                            className="w-full"
                        />
                    </div>
                    </ScrollFadeIn>
                 </ScrollFadeIn>

            </section>

            <section>
                
            </section>
           



            {/*Pricing */}
            
            <section className="w-full min-h-screen bg-stone-500 p-20">
                <ScrollFadeIn>
                <h2 className="text-text-espresso text-5xl text-center mb-12">
                    Pricing
                </h2>

                <div className="cardContainer grid place-items-center grid-cols-2 gap-8 max-w-6xl mx-auto">

                    <div className="card1 flex  justify-center gap-2  w-[90%] h-[500px]  rounded-xl">
                        <div className="flex flex-col bg-stone-300 rounded-2xl p-8 shadow-lg w-full max-w-sm">
                            {/* Header */}
                            <h2 className="text-espresso text-2xl font-semibold mb-2">
                                Weekend Warrior
                            </h2>
                            
                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-text-espresso text-4xl font-bold">$4.99</span>
                                <span className="text-text-coffee text-lg"> / 2 day pass</span>
                            </div>
                            
                            {/* CTA Button */}
                            <button className="w-full py-3 bg-orange-vibrant hover:bg-orange-deep text-white font-semibold rounded-xl transition-colors mb-10">
                                Become the Warrior
                            </button>
                            
                            {/* Features */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">One Time Payment, Mockups without the recurring costs.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">48 Hour Unlimited Platform Access.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">High Quality 4k exports</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">30 Mockup Exports</p>
                                </div>




                            </div>
                        </div>
                    </div>

                    <div className="card1 flex  justify-center gap-2  w-[90%] h-[500px]  rounded-xl">
                        <div className="flex flex-col bg-stone-300 rounded-2xl p-8 shadow-lg w-full max-w-sm">
                            {/* Header */}
                            <h2 className="text-espresso text-2xl font-semibold mb-2">
                                Monthly
                            </h2>
                            
                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-text-espresso text-4xl font-bold">$13.99</span>
                                <span className="text-text-coffee text-lg"> / month</span>
                            </div>
                            
                            {/* CTA Button */}
                            <button className="w-full py-3 bg-orange-vibrant hover:bg-orange-deep text-white font-semibold rounded-xl transition-colors mb-10">
                                Become the Warrior
                            </button>
                            
                            {/* Features */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">One Time Payment, Mockups without the recurring costs.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">48 Hour Unlimited Platform Access.</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">High Quality 4k exports</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 rounded-full bg-orange-vibrant flex items-center justify-center flex-shrink-0">
                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <p className="text-coffee">Unlimited Mockup Exports</p>
                                </div>




                            </div>
                        </div>

                    </div>




                </div>
                </ScrollFadeIn>
            </section>
            


            {/* CTA Section */}
            <section className="w-full min-h-screen bg-orange-vibrant flex items-center justify-center">
                <ScrollFadeIn>
                <div className="text-center">
                    <h2 className="text-white text-6xl mb-8">Ready to get started?</h2>
                    <button className="bg-white text-orange-vibrant px-12 py-6 rounded-xl text-2xl hover:bg-cream-vanilla transition-colors">
                        Start Creating
                    </button>
                </div>
                </ScrollFadeIn>
            </section>
        </>
    );
}

