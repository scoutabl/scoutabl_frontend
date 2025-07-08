import { Input } from '@/components/ui/input';

import SearchIcon from '@/assets/searchIcon.svg?react'
const SearchInput = ({ searchValue, setSearchValue, placeholder }) => {
    return (
        <div className="h-[37px] w-[300px] flex items-center rounded-full border border-seperatorPrimary focus-within:ring-2 focus-within:ring-purplePrimary transition group">
            <SearchIcon className="ml-3 text-gray-400 group-hover:scale-[1.1] group-hover:text-purplePrimary transition-all duration-300 ease-in" />
            <input
                type="text"
                className="h-full w-full border-0 bg-transparent outline-none px-3 text-gray-700"
                placeholder={placeholder}
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
            />
        </div>
    )
}

export default SearchInput