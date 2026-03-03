export default function CameraHoverIcon({className} : {className:string}) {
    return(
        <svg width="24" height="24" viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.5" y="7.5" width="17" height="9" rx="0.5" stroke="currentColor"/>
        <rect x="5" y="6" width="2" height="1" fill="currentColor"/>
        <circle cx="12" cy="12" r="2.5" stroke="currentColor"/>
        <line x1="11.7188" y1="6" x2="11.7188" y2="3" stroke="currentColor"/>
        <line x1="14.6464" y1="5.64645" x2="16.7678" y2="3.52513" stroke="currentColor"/>
        <line x1="7.23223" y1="3.52512" x2="9.35355" y2="5.64644" stroke="currentColor"/>
        </svg>
    )

}