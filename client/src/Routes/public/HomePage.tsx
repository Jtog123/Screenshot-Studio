import NavigationBar from "../../NavigationBar"
import { useState, useRef, useEffect } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import ScrollFadeIn from "../../ScrollFadeIn";
import { ScreenTextureInterface } from "../../ComponentInterfaces";
import IndexChart from "../../IconAssets/IndexChart";
import YourAppHere from "../../IconAssets/YourAppHere";
import ArrowPoint from "../../IconAssets/ArrowPoint";
import AppAndArrow from "../../IconAssets/AppAndArrow";


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
    const [activeTextureID, setActiveTextureID] = useState<string | null>("1");

    const [homeScreenTextures, setHomeScreenTextures] = useState<any[]>([]);

    //const loader = new THREE.TextureLoader();



    function handleTextureSelect(textureID : string) : void {
        setActiveTextureID(textureID);

        const selectedTexture = homeScreenTextures.find(texture => texture.id === textureID);

        if(homePhoneScreen && selectedTexture) {
            homePhoneScreen.material = new THREE.MeshBasicMaterial({
                map: selectedTexture.texture,
                toneMapped: false
            });
            homePhoneScreen.material.needsUpdate = true;
        }



    }




    useEffect(() => {
        if(!mountRef.current) return;

        const loader = new GLTFLoader();

        const textureLoader = new THREE.TextureLoader();

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

        //function to load the texture
        const loadTexture = (imgPath: string) : THREE.Texture => {
            const texture = textureLoader.load(imgPath);

            texture.flipY = false;
            texture.colorSpace = THREE.SRGBColorSpace; // Corrects the "washed out" red
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            texture.magFilter = THREE.LinearFilter;

            texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                //texture.anisotropy = 16; // Sharper edges at angles

            texture.generateMipmaps = true;

            return texture
            /*
                phoneScreen!.material = new THREE.MeshBasicMaterial({ 
                map: texture,
                toneMapped: false // Prevents scene lights from changing screenshot colors
                */
        }

        const textures = [
        {
            id: "1",
            type: "screenTexture",
            imgPath: "/BlueberryTile.png",
            texture: loadTexture("/BlueberryTile.png")
        },
        {
            id: "2",
            type: "screenTexture",
            imgPath: "/BananaTile.png", 
            texture: loadTexture("/BananaTile.png")

        },
        {
            id: "3",
            type: "screenTexture",
            imgPath: "/AppleTile.png", 
            texture: loadTexture("/AppleTile.png")

        },
        ];

        setHomeScreenTextures(textures)





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

        if(phoneScreen) {
            (phoneScreen as THREE.Mesh).material = new THREE.MeshBasicMaterial({
                map:textures[0].texture,
                toneMapped : false
            });
            setHomePhoneModel(gltf.scene);
            setIsPhoneLoading(false);
            setIsSceneReady(true);
        }
        /*
        if (phoneScreen) {
            
            const textureLoader = new THREE.TextureLoader();
            textureLoader.load('/BlueberryTile.png', (texture) => {
                texture.flipY = false;
                texture.colorSpace = THREE.SRGBColorSpace; // Corrects the "washed out" red
                texture.minFilter = THREE.LinearMipmapLinearFilter;
                texture.magFilter = THREE.LinearFilter;
                //texture.minFilter = THREE.LinearFilter;
                //texture.magFilter = THREE.NearestFilter; // Sharpest
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                //texture.anisotropy = 16; // Sharper edges at angles

                texture.generateMipmaps = true;
    
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
                */
            
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
            <section className="flex w-full min-h-screen ">
                
                {/* Left Side - Content */}
                <div className="flex leftSide justify-center items-center bg-cream-vanilla/50 w-1/2">
                    <div className="flex flex-col w-4/5 max-w-2xl   relative">
                        <h1 className="text-mocha text-7xl mb-6">Dynamic Mock Ups</h1>
                        
                        <h2 className="text-mocha/50 text-2xl mb-10">
                            Making your app stand out has never been easier
                        </h2>

                        <button className="bg-blue-frost hover:bg-blue-cobalt text-white rounded-xl w-[25%] h-[60px] transition-colors cursor-pointer text-xl">
                                    Join For Free
                        </button>
                        

                         <div className="absolute -right-58 -bottom-42 w-[650px] pointer-events-none">
                                <AppAndArrow className="w-full h-auto text-mocha/60" />
                        </div>
                    </div>
                </div>

                {/* Right Side - Phone Demo */}
                <div className="rightSide bg-cream-vanilla w-1/2 flex items-center ">
       
                    <div ref={mountRef} className="phoneDiv  w-full h-full"></div>

                    <div className=" imageContainer flex fixed justify-between items-center controls z-5 bg-stone-700 w-[170px] h-[170px] right-5 rounded-xl p-2">

                        {homeScreenTextures.map((img) => (
                            <div key={img.id} className=" flex flex-col  w-[30%] h-[85%] ">
                                <div className="w-full h-full   mb-2 ">
                                    <img src={img.imgPath} className="h-full" alt="" />
                                </div>
                                <input type="radio" checked={activeTextureID === img.id} 
                                onChange={() => handleTextureSelect(img.id)} className="" />
                            </div>
                        ))
                        }


     

                    </div>
                </div>
                
            </section>
            </ScrollFadeIn>

            
            <section className="w-full flex justify-center bg-cream-vanilla/50 py-20">
                <ScrollFadeIn>
                <h2 className="text-center text-mocha text-4xl mb-4">
                    The Mockup Frustration Index
                </h2>
                <p className="text-center text-mocha/70 text-xl mb-2">
                    Time spent vs Sanity lost
                </p>
                <p className="text-center text-mocha/70">
                    Note how as time increases you grow more insane
                </p>
                <div className="chart container flex w-[100%] justify-center ">
                    {/* Create teh chart first then figure out how to fill it with data */}
                    <IndexChart className=""/>

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

