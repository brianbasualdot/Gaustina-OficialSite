import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import FloatingWhatsApp from '../ui/FloatingWhatsApp';
import AnnouncementBar from './AnnouncementBar';

const Layout = ({ children }) => {
    const location = useLocation();
    const pathToCheck = location.pathname || window.location.pathname || '';
    const isAdminRoute = pathToCheck.toLowerCase().includes('/admin');

    React.useEffect(() => {
        const handleContextMenu = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    const isHomePage = location.pathname === '/';

    return (
        <div className="flex flex-col min-h-screen font-sans text-gray-900 bg-white">
            {!isAdminRoute && <AnnouncementBar />}
            {!isAdminRoute && <Navbar />}

            <main className="flex-grow">
                {children}
            </main>

            {!isAdminRoute && <FloatingWhatsApp />}
            {!isAdminRoute && <Footer />}
        </div>
    );
};

export default Layout;
