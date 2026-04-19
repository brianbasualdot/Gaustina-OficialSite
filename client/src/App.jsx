import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CategoryProductsPage from './pages/CategoryProductsPage';
import BestSellersPage from './pages/BestSellersPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
import { ModalProvider } from './context/ModalContext';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import ReturnsPolicy from './pages/ReturnsPolicy';
import ShippingInfo from './pages/ShippingInfo';
import TransferenciaPage from './pages/TransferenciaPage';
import SuccessPage from './pages/SuccessPage';
import FailurePage from './pages/FailurePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import CategoryManager from './pages/admin/CategoryManager';
import AdminMessages from './pages/admin/AdminMessages';
import CouponManager from './pages/admin/CouponManager';
import NotFoundPage from './pages/NotFoundPage';

import MaintenancePage from './pages/MaintenancePage';
import { API_URL } from './config/api';

function App() {
    const [maintenanceMode, setMaintenanceMode] = useState(null);
    const [isLoadingMaintenance, setIsLoadingMaintenance] = useState(true);

    useEffect(() => {
        const fetchMaintenanceMode = async () => {
            try {
                const res = await fetch(`${API_URL}/api/settings/maintenance_mode`);
                if (res.ok) {
                    const data = await res.json();
                    setMaintenanceMode(data.value === 'true');
                } else {
                    setMaintenanceMode(false);
                }
            } catch (error) {
                console.error("Error fetching maintenance mode:", error);
                setMaintenanceMode(false);
            } finally {
                setIsLoadingMaintenance(false);
            }
        };

        fetchMaintenanceMode();
    }, []);

    useEffect(() => {
        const handleContextMenu = (e) => {
            if (e.target.tagName === 'IMG') {
                e.preventDefault();
            }
        };

        const handleKeyDown = (e) => {
            // Prevent Ctrl+S, Ctrl+U, etc. on images if focused
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'u')) {
                if (document.activeElement.tagName === 'IMG') {
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    if (isLoadingMaintenance) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-white">
                <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <ToastProvider>
            <ModalProvider>
                <CartProvider>
                    <BrowserRouter>
                        {maintenanceMode && !window.location.pathname.startsWith('/admin') ? (
                            <MaintenancePage />
                        ) : (
                            <Layout>
                                <Routes>
                                    <Route path="/" element={<HomePage />} />
                                    <Route path="/productos" element={<ProductsPage />} />
                                    <Route path="/categoria/:categoryName" element={<CategoryProductsPage />} />
                                    <Route path="/producto/:id" element={<ProductDetailPage />} />
                                    <Route path="/contacto" element={<ContactPage />} />
                                    <Route path="/preguntas-frecuentes" element={<FAQPage />} />
                                    <Route path="/mas-vendidos" element={<BestSellersPage />} />
                                    <Route path="/politica-devoluciones" element={<ReturnsPolicy />} />
                                    <Route path="/informacion-envios" element={<ShippingInfo />} />
                                    <Route path="/carrito" element={<CartPage />} />
                                    <Route path="/checkout/transferencia" element={<TransferenciaPage />} />
                                    <Route path="/checkout/success" element={<SuccessPage />} />
                                    <Route path="/checkout/failure" element={<FailurePage />} />
                                    <Route path="/checkout/pending" element={<SuccessPage />} />

                                    {/* Admin Routes */}
                                    <Route path="/admin/login" element={<AdminLogin />} />

                                    <Route element={<ProtectedRoute />}>
                                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                                        <Route path="/admin/crear-producto" element={<CreateProduct />} />
                                        <Route path="/admin/editar-producto/:id" element={<EditProduct />} />
                                        <Route path="/admin/categorias" element={<CategoryManager />} />
                                        <Route path="/admin/mensajes" element={<AdminMessages />} />
                                        <Route path="/admin/cupones" element={<CouponManager />} />
                                    </Route>

                                    <Route
                                        path="*"
                                        element={<NotFoundPage />}
                                    />
                                </Routes>
                            </Layout>
                        )}
                    </BrowserRouter>
                </CartProvider>
            </ModalProvider>
        </ToastProvider>
    );
}

export default App;
