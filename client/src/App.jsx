import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import { ToastProvider } from './context/ToastContext';
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
import NotFoundPage from './pages/NotFoundPage';

function App() {
    return (
        <ToastProvider>
            <CartProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<HomePage />} />
                            <Route path="/productos" element={<ProductsPage />} />
                            <Route path="/producto/:id" element={<ProductDetailPage />} />
                            <Route path="/contacto" element={<ContactPage />} />
                            <Route path="/preguntas-frecuentes" element={<FAQPage />} />
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
                            </Route>

                            <Route
                                path="*"
                                element={<NotFoundPage />}
                            />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </CartProvider>
        </ToastProvider>
    );
}

export default App;
