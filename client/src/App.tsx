import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const frameIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.z = 3

    const renderer = new THREE.WebGLRenderer({
      antialias: false, // ← Turn off antialiasing for better performance
      alpha: true,
      powerPreference: 'low-power' // ← Better for laptops/slower machines
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // ← Cap pixel ratio
    renderer.setClearColor(0x000000, 0)

    mountRef.current.appendChild(renderer.domElement)

    // Create geometry and material (reuse them)
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshNormalMaterial()
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }
    window.addEventListener('resize', handleResize)

    // Animation with frame limiting
    let lastTime = 0
    const fps = 60
    const interval = 1000 / fps

    const animate = (currentTime: number) => {
      frameIdRef.current = requestAnimationFrame(animate)

      // Limit to ~60fps
      const delta = currentTime - lastTime
      if (delta < interval) return
      lastTime = currentTime - (delta % interval)

      cube.rotation.x += 0.01
      cube.rotation.y += 0.01
      renderer.render(scene, camera)
    }
    animate(0)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }

      // Dispose of Three.js objects
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <>
      {/* Gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-600 to-blue-500 z-0" />

      {/* Three.js canvas */}
      <div
        ref={mountRef}
        className="fixed inset-0 pointer-events-none z-10"
      />

      {/* UI */}
    </>
  )
}