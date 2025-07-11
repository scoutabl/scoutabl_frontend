import React from 'react'
import LogoIcon from '@/assets/logoFull.svg?react'
import { Button } from './ui/button'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from "../lib/routes";

function Navbar() {
    const { logout } = useAuth()
    const navigate = useNavigate()
    
    const handleLogout = async () => {
        try {
            await logout()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <nav className="fixed z-20 top-0 left-[110px] right-[110px] h-18 mt-4 flex items-center justify-between px-6 rounded-full bg-purplePrimary">
            <LogoIcon className="hover:cursor-pointer" onClick={() => navigate(ROUTES.ROOT)} />
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