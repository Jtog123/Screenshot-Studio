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
            <div className="ButtonContainer flex items-center justify-center fixed bg-yellow-200 w-[100px] h-[100px] bottom-0 left-60">
                <button onClick={handleImageCapture} className="w-[50px] h-[50px] rounded-4xl bg-red-200 cursor-pointer">
                    Cap
                </button>

            </div>
        </>
    )
}