export default function UpDownGradIcon({className} : {className:string}) {
    return (
        <svg  viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="18" height="10" fill="url(#paint0_linear_26_202)"/>
        <defs>
        <linearGradient id="paint0_linear_26_202" x1="12.5625" y1="16.4375" x2="12.625" y2="7" gradientUnits="userSpaceOnUse">
        {/*<stop stop-color="#D9D9D9" stop-opacity="0"/>*/}
        <stop stop-color="currentColor" stop-opacity="0"/>
        <stop offset="0.502675" stop-color="#313131" stop-opacity="0.773234"/>
        <stop offset="1"/>
        </linearGradient>
        </defs>
        </svg>
    )

}