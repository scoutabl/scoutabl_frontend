import PlusIcon from '@/assets/plusIcon.svg?react'
const AddOptionButton = ({ handleAddOption }) => {
    return (
        <button
            type="button"
            onClick={handleAddOption}
            className="py-[17.5px] flex items-center gap-3 group cursor-pointer"
        >
            <div className='size-6 grid place-content-center bg-white rounded-full border border-transparent group-hover:bg-blueBtn group-hover:border-blueBtn transition-colors duration-300 ease-in'>
                <PlusIcon className="text-blueBtn group-hover:text-white transition-colors duration-200 ease-in" />
            </div>
            <span className='text-blueBtn text-sm font-medium group-hover:underline underline-offset-4 transition-all duration-200 ease-in'>Add Options</span>
        </button>
    )
}

export default AddOptionButton
