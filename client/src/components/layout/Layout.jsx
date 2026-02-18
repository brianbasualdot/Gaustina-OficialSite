import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from '../ui/FloatingWhatsApp';
import AnnouncementBar from './AnnouncementBar';

const Layout = ({ children }) => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-white">
            <AnnouncementBar />
            <Navbar />

            <main className="flex-grow">
                {children}
            </main>

            <FloatingWhatsApp />
            <Footer />
        </div>
    );
};

export default Layout;
