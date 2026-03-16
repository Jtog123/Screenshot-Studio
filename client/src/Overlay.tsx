import React, {CSSProperties} from 'react'
import { AspectRatio } from './ComponentInterfaces'

interface OverlayProps {
    aspectRatio : AspectRatio
}

export default function Overlay({aspectRatio} : OverlayProps){
   


    function getOverlayStyle() : CSSProperties | void {
        if(aspectRatio.type === "default") {
             // Aspect ratio: 1242 / 2688 = 0.462
            return {
                width:`calc(100vh * (${aspectRatio.width / aspectRatio.height})`,
                height: '100vh',
                maxWidth: '100vw'
            }
        }  else if (aspectRatio.type === "wide") {
            return {
                width:`100vw`,
                height: `calc(100vh * (${aspectRatio.height / aspectRatio.width})`,
                maxHeight: '100vh'
            }
        }
    }


    return(
        <div className="fixed inset-0 z-10 pointer-events-none flex items-center justify-center">
            {/* Center frame */}
            <div className="border-2 border-dashed divide-dashed border-stone-300" 
                style={getOverlayStyle() as CSSProperties}>
            </div>
        </div>
    )
}