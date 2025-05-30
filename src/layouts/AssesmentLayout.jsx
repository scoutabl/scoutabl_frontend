import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AssessmentNavbar from '@/components/shared/AssesmentNavbar';
import Footer from '@/components/shared/Footer';
import { useTheme } from '@/context/ThemeContext';

const AssesmentLayout = ({ children }) => {
    const { isDarkMode } = useTheme();
    const location = useLocation();

    // Adjust this check based on your actual route structure
    const showDarkModeToggle = location.pathname.includes('coding-assesment');

    return (
        <div className={showDarkModeToggle && isDarkMode ? 'dark' : ''}>
            <div className='min-h-screen py-6 px-12 bg-blueSecondary dark:bg-black'>
                <AssessmentNavbar showDarkModeToggle={showDarkModeToggle} />
                {children}
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default AssesmentLayout;
