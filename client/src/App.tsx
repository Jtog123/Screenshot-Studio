import SceneManager from "./SceneManager.js"
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export default function App() {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const frameIdRef = useRef<number | null>(null)

  
  return (
    <>
      <SceneManager/>


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