export default function LeftRightGradIcon({className} : {className:string}) {
    return (
        <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="7" width="18" height="10" fill="url(#paint0_linear_26_200)"/>
        <defs>
        <linearGradient id="paint0_linear_26_200" x1="21" y1="12" x2="3" y2="12" gradientUnits="userSpaceOnUse">
        {/*<stop stop-color="#D9D9D9" stop-opacity="0"/>*/}
        <stop stop-color="currentColor" stop-opacity="0"/>
        <stop offset="0.498141" stop-color="#313131" stop-opacity="0.773234"/>
        <stop offset="1"/>
        </linearGradient>
        </defs>
        </svg>
    )

}