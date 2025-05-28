import React from 'react';
import { Outlet } from 'react-router-dom';
import AssessmentNavbar from '@/components/shared/AssesmentNavbar';
import Footer from '@/components/shared/Footer';
import { useTheme } from '@/context/ThemeContext';
const AssesmentLayout = ({ children }) => {
    const { isDarkMode } = useTheme()
    return (
        <div className={isDarkMode ? 'dark' : ''}>
            <div className='min-h-screen py-6 px-12 bg-blueSecondary dark:bg-black'>
                {/* <AssessmentNavbar { currentIndex, total, initialMinutes = 90} /> */}
                <AssessmentNavbar />
                {children}
                <Outlet />
                <Footer />
            </div>
        </div>
    );
};

export default AssesmentLayout;
