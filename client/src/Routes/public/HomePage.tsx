import NavigationBar from "../../NavigationBar"
import { useState, useRef, useEffect } from "react";
import * as THREE from 'three';


export default function HomePage() {

    const fov : number = 60; //75
    const aspect : number = (window.innerWidth /2) / window.innerHeight;
    const near : number = 0.1;
    const far : number = 10000;

    const mountRef = useRef<HTMLDivElement | null>(null);


    useEffect(() => {
        if(!mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

        const renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth / 2, window.innerHeight);
        

        renderer.domElement.style.position = "relative";
        renderer.domElement.style.display = "block";


        mountRef.current.appendChild(renderer.domElement);

        const geometry = new THREE.BoxGeometry( 1, 1, 1 );
        const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new THREE.Mesh( geometry, material );
        scene.add( cube );
        camera.position.z = 5;

        //run function
        const run = () => {
            requestAnimationFrame(() => run());
            cube.rotation.x += 0.01;  // Add rotation to see it's working
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        }

        //run the animation loop
        run();

        //clean up the ref
        return () => {
            if(mountRef.current) {
                mountRef.current?.removeChild(renderer.domElement);
            }

            renderer.dispose();
            geometry.dispose();
            material.dispose();
        };


    },[])


    return(
        <>
        <div>
            <NavigationBar/>
            <div className="fixed flex w-[100%] h-[100%] z-20 bg-stone-700">
                
                <div className="leftSide bg-red-500 h-[100%] w-[50%]">
                </div>

                <div ref={mountRef} className="rightSide bg-yellow-600 h-[100%] w-[50%]">
                    {/*Phone Demo here */}
               
                </div>

            </div>
        </div>

        </>
    )
}