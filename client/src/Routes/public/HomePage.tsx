import NavigationBar from "../../NavigationBar"
import { useState, useRef, useEffect, use } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import * as THREE from 'three';
import ScrollFadeIn from "../../ScrollFadeIn";
import { ScreenTextureInterface } from "../../ComponentInterfaces";
import IndexChart from "../../IconAssets/IndexChart";
import YourAppHere from "../../IconAssets/YourAppHere";
import ArrowPoint from "../../IconAssets/ArrowPoint";
import AppAndArrow from "../../IconAssets/AppAndArrow";
import OfficialLogo from "../../IconAssets/OfficialLogo";
import SuccessPage from "../protected/PurchaseSuccessPage";
import LoadingPage from "../../LoadingPage";
import { API_URL, FRONTEND_URL } from "../../config";
import TermsOfService from "../../TermsOfService";
import PrivacyPolicy from "../../PrivacyPolicy";
import {Link, useLocation} from "react-router"
import UserSettings from "../protected/UserSettings";


export default function HomePage() {

    

    const fov : number = 60; //75
    //const aspect : number = (window.innerWidth /2) / window.innerHeight;

    const getAspect = () => {
    const width = window.innerWidth;
    if (width < 1024) { // lg breakpoint
        return width / window.innerHeight;
    }
        return (width / 2) / window.innerHeight;
    };
    const aspect : number = getAspect();

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

    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

    //const loader = new THREE.TextureLoader();

    console.log(API_URL);

    //grabs location from the url # hash
    const {hash} = useLocation();

    useEffect(() => {
        if(hash === "#pricing") {
            const timer = setTimeout(() => {
                const element = document.getElementById("pricing");

                if(element) {
                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    })
                }

            }, 100);

            return () => clearTimeout(timer);
        }

    }, [hash]);



    



    function handleTextureSelect(textureID : string) : void {
        //setActiveTextureID(textureID);

        setActiveTextureID(textureID);

        /*
        const selectedTexture = homeScreenTextures.find(texture => texture.id === textureID);

        if(homePhoneScreen && selectedTexture) {
            homePhoneScreen.material = new THREE.MeshBasicMaterial({
                map: selectedTexture.texture,
                toneMapped: false
            });
            homePhoneScreen.material.needsUpdate = true;
        }
            */

    }

    function handleFreeTesting() : void {
        //window.location.href = "http://localhost:5050/auth/google";
        window.location.href = `${API_URL}/auth/google`;
    }



    async function handleWeekendWarriorStripeRedirect() : Promise<void> {

        

        try {
            setIsCheckoutLoading(true);

            // Make sure users logged into google
            const authCheck = await fetch(`${API_URL}/auth/google/me`, {
                credentials: "include"
            });

            if(!authCheck.ok) {
                //user not signed in, sign them in
                localStorage.setItem("return_to", "checkout_weekend");
                //window.location.href = "http://localhost:5050/auth/google/";
                window.location.href = `${API_URL}/auth/google`
                return;
            }


            //user is signed in send them to stripe
            const response = await fetch(`${API_URL}/api/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({plan: "weekend"}),
                credentials: "include"
            });

            const {url} = await response.json();
            console.log("url is: ", url);

            //redirect user to stripe backends for payment
            window.location.href = url;

        } catch(err) {
            setIsCheckoutLoading(false);
            console.error(err);
        }



    }

    async function handleMonthlyStripeRedirect() : Promise<void> {
        try {

            setIsCheckoutLoading(true);

            // Make sure users logged into google
            const authCheck = await fetch(`${API_URL}/auth/google/me`, {
                credentials: "include"
            });

            if(!authCheck.ok) {
                //user not signed in, sign them in
                localStorage.setItem("return_to", "checkout_monthly");
                window.location.href = `${API_URL}/auth/google`;
                return;
            }


            //user is signed in send them to stripe
            const response = await fetch(`${API_URL}/api/create-checkout-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({plan: "monthly"}),
                credentials: "include"
            });

            const {url} = await response.json();
            console.log("url is: ", url);

            //redirect user to stripe backends for payment
            window.location.href = url;

        } catch(err) {
            setIsCheckoutLoading(false);
            console.error(err);
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

        //renderer.setSize( window.innerWidth / 2, window.innerHeight);
        /*
        const getRendererWidth = () => {
            const width = window.innerWidth;
            return width < 1024 ? width : width / 2;
        };
        */

        /*
        const getRendererWidth = () => {
            const width = window.innerWidth;
            if (width < 1024) {
                // Use a max width to maintain aspect ratio
                return Math.min(width, 448); // 448px = max-w-md (28rem)
            }
            return width / 2;
        };
        */
       const getRendererWidth = () => {
            const width = window.innerWidth;
            if (width < 1024) {
                return 400; // FIXED 400px on mobile
            }

            return width / 2;
        };

        const getRendererHeight = () => {
        const height = window.innerWidth < 1024 ? 600 : window.innerHeight;
        console.log('📏 Renderer height:', height); // 🔍 LOG
        return window.innerWidth < 1024 ? 600 : window.innerHeight; // Fixed 500px on mobile
    };



        //renderer.setSize(getRendererWidth(), window.innerHeight);
        renderer.setSize(getRendererWidth(), getRendererHeight());

        

        renderer.domElement.style.position = "relative";
        renderer.domElement.style.display = "block";


        mountRef.current.appendChild(renderer.domElement);


        camera.position.z = 5;
        camera.position.y = 0.25;

        const spotLight = new THREE.SpotLight(0xFFFFFF);
        spotLight.position.set(-1, 2.5, 1);

        scene.add(spotLight);
        const lightHelper = new THREE.SpotLightHelper(spotLight,0xFFFFFF);
        //scene.add(lightHelper);
        
        spotLight.angle = Math.PI / 4;

        //const target = new THREE.Object3D();
        //spotLight.target = target;
        //scene.add(spotLight.target);
        lightHelper.update()

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
            imgPath: "/GreenAppleTile.png", 
            texture: loadTexture("/GreenAppleTile.png")

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

        //adding this

        

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
                        //child.castShadow = true;
                        //child.receiveShadow = true;
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
            if(homePhoneModel ) {
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
        let lastWidth = window.innerWidth;

        const handleResize = () => {
            const camera = cameraRef.current;
            const renderer = rendererRef.current;

            if (camera && renderer) {
                const width = window.innerWidth;
                //const rendererWidth = width < 1024 ? width : width / 2;
                //const rendererHeight = width < 1024 ? 500 : window.innerHeight;
                if(width < 1024 && width === lastWidth) {
                    return;
                }

                let rendererWidth, rendererHeight;
            
                if (width < 1024) {
                    // Mobile: constrained width, fixed height
                    //rendererWidth = Math.min(width, 448);
                    //rendererHeight = 600;
                    rendererWidth = 400;
                    rendererHeight = 600;
                } else {
                    // Desktop: half width, full height
                    rendererWidth = width / 2;
                    rendererHeight = window.innerHeight;
                }

 

                
                //camera.aspect = rendererWidth / window.innerHeight;
                camera.aspect = rendererWidth / rendererHeight;
                camera.updateProjectionMatrix();
                //renderer.setSize(rendererWidth, window.innerHeight);
                renderer.setSize(rendererWidth, rendererHeight);
                /*
                camera.aspect = (window.innerWidth / 2) / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth / 2, window.innerHeight);
                */
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []); 

    useEffect(() => {
        if(homePhoneScreen && homeScreenTextures.length > 0) {
            const texture = homeScreenTextures.find(t => t.id === activeTextureID);

            if(texture) {
                homePhoneScreen.material = new THREE.MeshBasicMaterial({
                    map: texture.texture,
                    toneMapped: false
                });
                homePhoneScreen.material.needsUpdate = true;
            }
        }
    }, [homePhoneScreen, activeTextureID, homeScreenTextures]);





return (
    <>
        
        {/* Hide NavigationBar on mobile only */}
        <div className="lg:block">
            <NavigationBar />
        </div>

        
        

        {isCheckoutLoading && <LoadingPage/>}

        
        
        {/* Hero Section - Split Left/Right */}
        <ScrollFadeIn >
        <section id="hero" className="flex flex-col lg:flex-row w-full min-h-screen bg-chocolate">
            
            {/* Left Side - Content */}
            <div className="flex leftSide justify-center items-center bg-chocolate w-full lg:w-1/2 ">
                <div className="flex flex-col w-4/5 max-w-2xl relative justify-center text-center lg:text-left">
                    <h1 className="text-cream-vanilla text-6xl mb-6 font-semibold mt-20 lg:mt-0 " style={{fontFamily: "Inter, sans-serif"}}>Stop Being Ignored</h1>
                    
                    <h2 className="text-cream-vanilla/70 text-2xl mb-10 " style={{fontFamily: "Inter, sans-serif"}}>
                        First impressions are important. Stand out.
                    </h2>


                    <button onClick={handleFreeTesting} className="bg-pink-cherry hover:bg-pink-velvet text-white font-semibold text-xl px-12 py-6 rounded-2xl shadow-[0_0_30px_rgba(232,70,149,0.4)] hover:shadow-[0_0_20px_rgba(232,70,149,0.6)] transform hover:scale-101 transition-all ease-in mx-6 duration-100 cursor-pointer  lg:mx-0 animate-glow-pulse">
                        Get Started Free
                    </button>
                    

                     <div className="hidden lg:block absolute -right-58 -bottom-52 w-[650px] pointer-events-none">
                            <AppAndArrow className="w-full h-auto text-cream-vanilla" />
                    </div>
                </div>
            </div>

            {/* Right Side - Phone Demo */}
            <div className="rightSide bg-chocolate w-full lg:w-1/2 flex flex-col lg:flex-row items-center justify-center ">
   
                {/* Phone div - Full width on mobile - phoneDiv flex justify-center w-full h-full */}
                <div ref={mountRef} className="phoneDiv flex justify-center w-[400px] lg:w-full h-[600px] lg:h-full mx-auto" ></div>
                
                {/* Texture selector - Below phone on mobile, fixed on desktop */}
                <div className="imageContainer relative lg:fixed z-50 bg-gradient-to-br from-pink-cherry to-pink-cherry/65 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-white/10 w-auto lg:w-[170px] mt-6 lg:mt-0 lg:right-6">
                    
                    {/* Header */}
                    <div className="flex flex-col justify-center mb-5">
                        <h3 className="text-white text-lg tracking-tight" style={{fontFamily: "Inter, sans-serif"}}>
                            Try it out
                        </h3>
                        <p className="text-white/70 text-xs mt-1" style={{fontFamily: "Inter, sans-serif"}}>
                            Apply a sample
                        </p>
                    </div>
                    
                    {/* Texture Grid */}
                    <div className="flex gap-3 justify-center lg:justify-between">
                        {homeScreenTextures.map((img) => (
                            <label
                                key={img.id}
                                className={`group cursor-pointer flex flex-col items-center transition-all duration-200 ${
                                    activeTextureID === img.id 
                                        ? 'scale-105' 
                                        : 'opacity-60 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                {/* Image Container */}
                                <div className={`relative rounded-lg overflow-hidden mb-2 transition-all duration-200 ${
                                    activeTextureID === img.id 
                                        ? 'ring-2 ring-blue-500 shadow-lg shadow-blue-500/50' 
                                        : 'ring-1 ring-white/20 hover:ring-white/40'
                                }`}>
                                    <img 
                                        src={img.imgPath} 
                                        className="w-16 h-20 object-cover" 
                                        alt=""
                                    />
                                    
                                    {/* Active Indicator Overlay */}
                                    {activeTextureID === img.id && (
                                        <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center pointer-events-none">
                                            <div className="w-5 h-5 rounded-full bg-mocha flex items-center justify-center">
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Radio Input (hidden but functional) */}
                                <input 
                                    type="radio" 
                                    checked={activeTextureID === img.id} 
                                    onChange={() => handleTextureSelect(img.id)}
                                    className="w-4 h-4 accent-[#52301C] cursor-pointer"
                                />
                            </label>
                        ))}
                    </div>
                </div>
            </div>
            
        </section>
        </ScrollFadeIn>

        
        <section className="w-full bg-chocolate pt-14  lg:pt-20 lg:pb-14">
            <ScrollFadeIn>
            <div className="flex flex-col items-center">
                <h2 className="text-center text-cream-vanilla text-4xl mb-4 font-semibold" style={{fontFamily: "Inter, sans-serif"}}>
                    The Mockup Frustration Index
                </h2>

                <p className=" text-cream-vanilla/70 text-center" style={{fontFamily: "Inter, sans-serif"}}>
                    Notice how as time increases you grow more insane.
                </p>
                <div className="chart container flex w-full  items-center justify-center max-h-[350px] lg:max-h-none overflow-hidden ">
                    {/* Create teh chart first then figure out how to fill it with data */}
                    <IndexChart className="w-full h-[full] "/>
                </div>
            </div>


            </ScrollFadeIn>
            

        </section>

        
        <section id="about" className="w-full min-h-screen bg-chocolate p-20">
            <ScrollFadeIn>
            <h2 className="text-cream-vanilla text-5xl text-center mb-12" style={{fontFamily: "Inter, sans-serif"}}>
                {/*Beautiful Mockups Without the Learning Curve*/}
                Skip The Design Tools
            </h2>
            <p className="text-cream-vanilla text-center text-xl mb-16  " style={{fontFamily: "Inter, sans-serif"}}>
                No Figma. No Photoshop. No tutorials. <span className="text-pink-cherry text-xl" style={{fontFamily: "Inter, sans-serif"}}>Appstore ready screenshots in minutes.</span>
            </p>

            

            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
     {/* Step 1 */}
    <div className="text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-cobalt text-cream-vanilla flex items-center justify-center font-bold">
                1
            </div>
            <h3 className="text-cream-vanilla text-2xl font-semibold whitespace-nowrap" style={{fontFamily: "Inter, sans-serif"}}>
                Style Your Scene
            </h3>
        </div>
        <p className="text-cream-vanilla/60 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
            Choose backgrounds, add lighting, and upload your app screenshots to create the perfect look
        </p>
    </div>

    {/* Step 2 */}
    <div className="text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-cobalt text-cream-vanilla flex items-center justify-center font-bold">
                2
            </div>
            <h3 className="text-cream-vanilla text-2xl font-semibold whitespace-nowrap" style={{fontFamily: "Inter, sans-serif"}}>
                Position Your Model
            </h3>
        </div>
        <p className="text-cream-vanilla/60 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
            Rotate, tilt, and position your device at the perfect angle using intuitive controls
        </p>
    </div>

    {/* Step 3 */}
    <div className="text-center">
        <div className="flex flex-col md:flex-row items-center justify-center gap-2 mb-3">
            <div className="w-8 h-8 flex-shrink-0 rounded-full bg-blue-cobalt text-cream-vanilla flex items-center justify-center font-bold">
                3
            </div>
            <h3 className="text-cream-vanilla text-2xl font-semibold whitespace-nowrap" style={{fontFamily: "Inter, sans-serif"}}>
                Easy Export
            </h3>
        </div>
        <p className="text-cream-vanilla/60 leading-relaxed" style={{fontFamily: "Inter, sans-serif"}}>
            Capture your images then download your professional mockup in high resolution, ready for showing off
        </p>
    </div>
</div>
            

            {/* ONE Dramatic Hero Result */}
                <ScrollFadeIn>
                <div className=" flex item-center justify-center overflow-hidden mt-4 scale-350 lg:-mt-12 lg:scale-140 ">
                    
                    <img 
                        src="/HomepageHero5.png" 
                        alt="Professional phone mockup with gradient background"
                        className="w-full f-full object-contain mt-8 lg:mt-0 "
                    />
                </div>
                </ScrollFadeIn>
             </ScrollFadeIn>

        </section>

        <section>
            
        </section>
       



        {/*Pricing */}
        
 <section id="pricing" className="w-full min-h-screen bg-chocolate p-6 lg:p-20">
    <ScrollFadeIn>
    <h2 className="text-cream-vanilla text-3xl lg:text-5xl text-center mb-8 lg:mb-12 px-4" style={{fontFamily: "Inter, sans-serif"}}>
        Pricing
    </h2>

    <div className="cardContainer grid place-items-center grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto px-4">

        <div className="card1 flex justify-center w-full max-w-sm">
            <div className="flex flex-col bg-pink-bubblegum rounded-2xl p-6 lg:p-8 shadow-lg w-full">
                {/* Header */}
                <h2 className="text-espresso text-xl lg:text-2xl font-semibold mb-2" style={{fontFamily: "Inter, sans-serif"}}>
                    Weekend Warrior
                </h2>
                
                {/* Price */}
                <div className="mb-6 lg:mb-8">
                    <span className="text-text-espresso text-3xl lg:text-4xl font-bold" style={{fontFamily: "Inter, sans-serif"}}>$5.99</span>
                    <span className="text-text-coffee text-base lg:text-lg" style={{fontFamily: "Inter, sans-serif"}}> / 2 day pass</span>
                </div>
                
                {/* CTA Button */}
                <button 
                    disabled={isCheckoutLoading} 
                    onClick={handleWeekendWarriorStripeRedirect} 
                    className="w-full py-3 bg-pink-cherry transition-all ease-in duration-100 hover:bg-pink-frosting hover:text-espresso text-white font-semibold rounded-xl transition-colors mb-6 lg:mb-10 cursor-pointer text-sm lg:text-base" 
                    style={{fontFamily: "Inter, sans-serif"}}
                >
                    Become the Warrior
                </button>
                
                {/* Features */}
                <div className="space-y-2 lg:space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base">One Time Payment. No recurring costs.</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base">48 Hour Unrestricted Platform Access</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base">High Quality 4k Exports</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base">Transparent Backgrounds</p>
                    </div>
                </div>
            </div>
        </div>

        <div className="card1 flex justify-center w-full max-w-sm">
            <div className="flex flex-col bg-pink-bubblegum rounded-2xl p-6 lg:p-8 shadow-lg w-full ring-4 ring-pink-cherry ring-offset-2 lg:ring-offset-3 ring-offset-blue-cobalt animate-glow-pulse">
                {/* Same structure as Weekend Warrior card with responsive text sizes */}
                <h2 className="text-espresso text-xl lg:text-2xl font-semibold mb-2" style={{fontFamily: "Inter, sans-serif"}}>
                    Monthly
                </h2>
                
                <div className="mb-6 lg:mb-8">
                    <span className="text-black text-3xl lg:text-4xl font-bold" style={{fontFamily: "Inter, sans-serif"}}>$13.99</span>
                    <span className="text-text-coffee text-base lg:text-lg" style={{fontFamily: "Inter, sans-serif"}}> / month</span>
                </div>
                
                <button 
                    onClick={handleMonthlyStripeRedirect} 
                    disabled={isCheckoutLoading} 
                    className="w-full py-3 bg-pink-cherry transition-all ease-in duration-100 hover:bg-pink-frosting hover:text-espresso text-white font-semibold rounded-xl transition-colors mb-6 lg:mb-10 cursor-pointer text-sm lg:text-base" 
                    style={{fontFamily: "Inter, sans-serif"}}
                >
                    Be Sweet
                </button>
                
                {/* Same features structure with responsive text */}
                <div className="space-y-2 lg:space-y-3">
                    {/* Copy all features with text-sm lg:text-base and items-start */}
                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base">Better Value Over Time.</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base"> Unlimited Platform Access</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base">High Quality 4k Exports</p>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-blue-cobalt flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <p className="text-coffee text-sm lg:text-base">Transparent Backgrounds</p>
                    </div>
                    
                </div>
            </div>
        </div>

    </div>
    </ScrollFadeIn>
</section>
        


        {/* CTA Section */}
        <section className="w-full h-screen bg-chocolate">
            <ScrollFadeIn >
                <div className="w-full h-full flex flex-col">

                    {/* CTA - Top Half */}
                    <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
                        <h2 className="text-pink-cherry text-6xl mb-8 font-semibold">
                            Ready To Finish Your App?
                        </h2>
                        <button onClick={handleFreeTesting} className="bg-cream-vanilla text-pink-cherry px-8 py-3 rounded-xl text-2xl font-semibold hover:bg-pink-cherry hover:text-cream-vanilla transition-colors cursor-pointer ">
                            Let's Go
                        </button>
                    </div>

                    {/* Footer - Bottom Half */}
                    <div className="flex-1 bg-chocolate flex flex-col md:flex-row items-center justify-between px-16 border-black-1">
                        
                        {/* Logo - Left Side */}
                        <div className="flex-shrink-0">
                            {/* Your logo component here */}
                            <div className="flex flex-col  justify-center items-center md:items-start font-bold ml-0 md:ml-20">
                                <div className="flex w-[100%] justify-center lg:justify-start ">
                                    <OfficialLogo className="h-18 w-18 opacity-70" />
                                </div>
                                
                                <h1 className="text-cream-vanilla  text-xl">
                                ScreenshotSweet
                                </h1>
                                <h1 className="text-cream-vanilla/70 text-xs">
                                &#169; 2026 ScreenshotSweet.
                                </h1>
                            </div>

                        </div>

                        {/* Connect & Contact Columns - Right Side */}
                        <div className="flex gap-8 justify-center lg:justify-end lg:gap-24 lg:mr-20  w-full">
                            
                            {/* Connect Column */}
                            <div className="flex flex-col w-32 ">
                                <h3 className="text-cream-vanilla text-2xl font-semibold mb-6">
                                    Connect
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="#" className="text-cream-vanilla/70 hover:text-pink-cherry transition-colors">
                                            Youtube
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#" className="text-cream-vanilla/70 hover:text-pink-cherry transition-colors">
                                            Instagram
                                        </a>
                                    </li>

                                </ul>
                            </div>

                            {/* Contact Column */}
                            <div className="flex flex-col w-32">
                                <h3 className="text-cream-vanilla text-2xl font-semibold mb-6">
                                    Contact
                                </h3>
                                <ul className="space-y-3">
                                    <li>
                                        <a href="mailto:hello@screenshotsweet.com" className="text-cream-vanilla/70 hover:text-pink-cherry transition-colors  text-wrap  ">
                                            support@screenshotsweet.com
                                        </a>
                                    </li>

                                    <li>
                                        {/*
                                        <a href="#" className="text-cream-vanilla/70 hover:text-pink-cherry transition-colors">
                                            Privacy Policy
                                        </a>
                                        */}
                                        <Link to="/privacy" className="text-cream-vanilla/70 hover:text-pink-cherry transition-colors"> Privacy Policy
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/terms" className="text-cream-vanilla/70 hover:text-pink-cherry transition-colors">
                                        Terms of Service
                                        </Link>

                                    </li>
                                </ul>
                            </div>

                        </div>
                    </div>

                </div>
            </ScrollFadeIn>
        </section>
    </>
);
}

