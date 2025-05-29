import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AssessmentNavbar from '@/components/shared/AssesmentNavbar';
import Footer from '@/components/shared/Footer';
import { useTheme } from '@/context/ThemeContext';
const AssesmentLayout = ({ children }) => {
    const { isDarkMode } = useTheme()
    useEffect(() => {
        console.log(isDarkMode)
    }, [isDarkMode])
    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className='min-h-screen py-6 px-12 bg-blueSecondary dark:bg-black'>
                <AssessmentNavbar />
                {children}
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default AssesmentLayout;
