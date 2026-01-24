interface ActiveListItemProps {
    itemName : string
}

export default function ActiveListItem({itemName}:ActiveListItemProps) {
    return (
        <>
            <li className="flex flex-row w-[100%] h-[15%] bg-stone-600 items-center justify-between">
                <button className="bg-blue-200 ml-3 px-3 rounded-l">visible</button>
                <label htmlFor="">{itemName}</label>
                <button className="bg-red-500 mr-3 px-3 rounded-l">trash</button>
                
            </li>
        </>
    )

}