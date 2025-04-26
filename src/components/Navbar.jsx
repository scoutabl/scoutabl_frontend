import React from 'react'
import logo from '/logo.svg'
function Navbar() {
    return (
        <nav className="fixed w-full z-20 top-0 start-0 h-20 flex items-center justify-end px-10">
            <img src={logo} alt="scoutabl logo" className='h-9 w-9' />
        </nav>

    )
}

export default Navbar