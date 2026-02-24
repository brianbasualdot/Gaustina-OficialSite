import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import CategoryProductsPage from './pages/CategoryProductsPage'; // Importar nueva página
import ProductDetailPage from './pages/ProductDetailPage';
import AboutPage from './pages/AboutPage';
import CartPage from './pages/CartPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { CartProvider } from './context/CartContext';
import ContactPage from './pages/ContactPage';
import FAQPage from './pages/FAQPage';
import BestSellersPage from './pages/BestSellersPage';
import OffersPage from './pages/OffersPage';
import ReturnsPolicy from './pages/ReturnsPolicy';
import ShippingInfo from './pages/ShippingInfo';
import TransferenciaPage from './pages/TransferenciaPage';
import SuccessPage from './pages/SuccessPage';
import FailurePage from './pages/FailurePage';
import AdminLogin from './pages/admin/AdminLogin';
import AdminRoute from './components/auth/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import CategoryManager from './pages/admin/CategoryManager';
import AdminMessages from './pages/admin/AdminMessages';

function App() {
    console.log('App component rendering');
    return (
        <CartProvider>
            <BrowserRouter>
                <Layout>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/productos" element={<ProductsPage />} />
                        <Route path="/categoria/:categoryName" element={<CategoryProductsPage />} /> {/* Nueva Ruta */}
                        <Route path="/producto/:id" element={<ProductDetailPage />} />
                        <Route path="/nosotros" element={<AboutPage />} />
                        <Route path="/contacto" element={<ContactPage />} />
                        <Route path="/preguntas-frecuentes" element={<FAQPage />} />
                        <Route path="/mas-vendidos" element={<BestSellersPage />} />
                        <Route path="/ofertas" element={<OffersPage />} />
                        <Route path="/politica-devoluciones" element={<ReturnsPolicy />} />
                        <Route path="/informacion-envios" element={<ShippingInfo />} />
                        <Route path="/carrito" element={<CartPage />} />
                        <Route path="/checkout/transferencia" element={<TransferenciaPage />} />
                        <Route path="/checkout/success" element={<SuccessPage />} />
                        <Route path="/checkout/failure" element={<FailurePage />} />
                        <Route path="/checkout/pending" element={<SuccessPage />} /> {/* Usamos Success para pending también */}
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
                            element={<div>Página no encontrada</div>}
                        />
                    </Routes>
                </Layout>
            </BrowserRouter>
        </CartProvider>
    );
}

export default App;
