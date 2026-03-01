import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import SeoHead from '../components/common/SeoHead';

// Dummy Data replacement or Fetch from API
// Since we are decoupling from specific categories, we'll fetch all or use dummy data if API fails
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products from API
        fetch(`${API_URL}/api/products`)
            .then(res => res.json())
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching products:", err);
                // Fallback dummy data if API fails to populate visually
                setProducts([
                    { id: 1, name: "Necesser Velvet Navy", price: 35000, images: ["https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=2000&auto=format&fit=crop"] },
                    { id: 2, name: "Travel Pouch Beige", price: 28000, images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=2000&auto=format&fit=crop"] },
                    { id: 3, name: "Set Organizador XL", price: 65000, images: ["https://images.unsplash.com/photo-1554342597-27e837aad337?q=80&w=2000&auto=format&fit=crop"] },
                    { id: 4, name: "Cosmetic Bag Rose", price: 22000, images: ["https://images.unsplash.com/photo-1596462502278-27bfdd403348?q=80&w=2000&auto=format&fit=crop"] },
                ]);
                setLoading(false);
            });
    }, []);

    return (
        <div className="pt-20 bg-white min-h-screen">
            <SeoHead
                title="Colección | Gaustina"
                description="Explora nuestra colección completa de necessers y accesorios personalizados."
            />

            <div className="container mx-auto px-4 py-16 max-w-6xl">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-heading text-brand-primary mb-4">
                        Nuestra Colección
                    </h1>
                    <p className="text-gray-500 font-heading uppercase tracking-widest text-sm max-w-xl mx-auto">
                        Piezas únicas diseñadas para acompañarte en cada dia
                    </p>
                </div>

                {/* Product Grid */}
                {
                    loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                            {products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={typeof product.price === 'number' ? product.price.toLocaleString('es-AR') : product.price}
                                    image={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/300"}
                                />
                            ))}
                        </div>
                    )
                }
            </div >
        </div >
    );
};

export default ProductsPage;
