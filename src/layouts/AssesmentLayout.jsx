import React from 'react';
import { Outlet } from 'react-router-dom';
import AssessmentNavbar from '@/components/shared/AssesmentNavbar';
import Footer from '@/components/shared/Footer';
const AssesmentLayout = ({ children }) => {
    return (
        <div className='min-h-screen py-6 px-12'>
            {/* <AssessmentNavbar { currentIndex, total, initialMinutes = 90} /> */}
            <AssessmentNavbar />
            {children}
            <Outlet />
            <Footer />
        </div>
    );
};

export default AssesmentLayout;
