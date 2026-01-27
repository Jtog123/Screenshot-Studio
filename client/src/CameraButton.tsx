import { CameraManager } from "./CameraManager"

interface CameraButtonProps {
    cameraManager : CameraManager
}

export default function CameraButton({cameraManager} : CameraButtonProps) {

    function handleImageCapture() : void {
        console.log("Capturing the image");
        cameraManager.captureImage();
    }

    return(
        <>
            <button onClick={handleImageCapture} className="rounded-4xl p-2 bg-red-200 cursor-pointer">
                Cap
            </button>

        </>
    )
}