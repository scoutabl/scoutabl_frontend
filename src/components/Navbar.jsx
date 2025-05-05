import React from 'react'
import logo from '/logo.svg'
import { Button } from './ui/button'
import { useAuth } from '@/context/AuthContext'

function Navbar() {
    const { logout } = useAuth()

    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <nav className="fixed w-full z-20 top-0 start-0 h-20 flex items-center justify-between px-10">
            <img src={logo} alt="scoutabl logo" className='h-9 w-9' />
            <Button
                onClick={handleLogout}
                effect="shineHover"
                className="bg-gradient-custom hover:bg-gradient-custom/90"
            >
                Logout
            </Button>
        </nav>
    )
}

export default Navbar