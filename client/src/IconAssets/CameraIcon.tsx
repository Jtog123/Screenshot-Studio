export default function CameraIcon({className} : {className:string}) {
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="7.5" width="17" height="9" rx="0.5" stroke="currentColor"/>
        <rect x="5" y="6" width="2" height="1" fill="currentColor"/>
        <circle cx="12" cy="12" r="2.5" stroke="currentColor"/>
        </svg>
    )

}