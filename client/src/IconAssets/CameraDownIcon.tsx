export default function CameraDownIcon({className} : {className:string}) {
    return(
        <svg  viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3.25" y="10.3438" width="17.5" height="9.5" rx="0.75" stroke="currentColor" stroke-width="0.5"/>
        <rect x="5" y="9.09375" width="2" height="1" fill="currentColor"/>
        <circle cx="12" cy="15.0938" r="2.75" stroke="currentColor" stroke-width="0.5"/>
        <rect x="11.5" y="7.3125" width="5" height="1" transform="rotate(-90 11.5 7.3125)" fill="currentColor"/>
        <path d="M12 9.09375L10.701 6.84375H13.299L12 9.09375Z" fill="currentColor"/>
        </svg>
    )
}