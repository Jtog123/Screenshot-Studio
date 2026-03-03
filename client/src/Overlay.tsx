export default function Overlay(){
    // Aspect ratio: 1242 / 2688 = 0.462
    return(
        <div className="fixed inset-0 z-19 pointer-events-none flex items-center justify-center">
            {/* Center frame */}
            <div className="border-2 border-dashed divide-dashed border-stone-300" 
                 style={{
                     width: 'calc(100vh * 0.462)', // Height-based width
                     height: '100vh',
                     maxWidth: '100vw'
                 }}>
            </div>
        </div>
    )
}