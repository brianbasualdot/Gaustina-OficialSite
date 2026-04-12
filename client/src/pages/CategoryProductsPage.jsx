import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProtectedImage from '../components/common/ProtectedImage';
import { getDisplayPrice, getTransferPrice } from '../utils/productUtils';
import SeoHead from '../components/common/SeoHead';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CategoryProductsPage = () => {
    const { categoryName } = useParams(); // Obtiene "servilletas", "caminos", etc.
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch products
                const prodRes = await fetch(`${API_URL}/api/products`);
                if (prodRes.ok) {
                    const allProducts = await prodRes.json();
                    const filtered = allProducts.filter(p =>
                        p.category?.name?.toLowerCase() === categoryName.toLowerCase()
                    );
                    setProducts(filtered);
                }

                // Fetch category details (for SEO description)
                const catRes = await fetch(`${API_URL}/api/categories/${categoryName}`);
                if (catRes.ok) {
                    const catData = await catRes.json();
                    setCategory(catData);
                }
            } catch (error) {
                console.error("Error cargando categoría:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [categoryName]);

    // Capitalizar para mostrar en título
    const displayTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    return (
        <div className="pt-20">
            <SeoHead 
                title={`${displayTitle} Bordados Artesanales`}
                description={category?.description || `Descubre nuestra colección de ${categoryName} bordados a mano. Diseños exclusivos y calidad premium en Biblioteca de Bordados.`}
            />
            <div className="bg-[#fefefc] py-12 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-heading text-4xl md:text-5xl text-brand-dark text-center mb-4">
                        {displayTitle}
                    </h1>
                    {category?.description ? (
                        <div className="text-center text-gray-600 max-w-3xl mx-auto mb-12 prose prose-sm prose-p:leading-relaxed">
                            <p>{category.description}</p>
                        </div>
                    ) : (
                        <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                            Explora nuestra colección exclusiva de {categoryName} bordados artesanalmente.
                        </p>
                    )}

                    {loading ? (
                        <div className="text-center py-20">Cargando...</div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            No hay productos en esta categoría aún.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {products.map((product) => (
                                <Link to={`/producto/${product.id}`} key={product.id} className="group">
                                    <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 relative mb-4">
                                        <ProtectedImage
                                            src={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/400?text=Sin+Foto"}
                                            hoverSrc={(product.images && product.images.length > 1) ? product.images[1] : null}
                                            alt={product.name}
                                            imgClassName={`duration-700 ${product.paused ? 'grayscale opacity-75' : ''}`}
                                        />
                                        {product.paused && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                                <span className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Pausado
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="font-heading text-lg text-brand-dark group-hover:text-brand-primary transition-colors">
                                        {product.name}
                                    </h3>
                                     <div className="mt-2">
                                        {(() => {
                                            const { price, label } = getDisplayPrice(product);
                                            const transferPrice = getTransferPrice(price);
                                            return (
                                                <>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-lg font-bold text-green-700">
                                                            ${transferPrice.toLocaleString('es-AR')}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-green-700 bg-green-50 px-1.5 py-0.5 rounded">-10% Transf.</span>
                                                    </div>
                                                    <p className="text-xs text-gray-500">
                                                        ${price.toLocaleString('es-AR')} <span className="text-yellow-700/70 font-medium">{label}</span>
                                                    </p>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoryProductsPage;
