import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SeoHead from '../components/common/SeoHead';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const BestSellersPage = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const allProducts = await res.json();

                    // Lógica "Más Vendidos" (Menos Stock)
                    // 1. Ordenar por stock ascendente
                    const sortedByStock = [...allProducts].sort((a, b) => a.stock - b.stock);

                    // 2. Tomar candidatos (ej: top 10 con menos stock) para dar variedad
                    const candidates = sortedByStock.slice(0, 10);

                    // 3. Mezclar aleatoriamente y tomar 6
                    const shuffledCandidates = candidates.sort(() => 0.5 - Math.random());
                    const selectedBestSellers = shuffledCandidates.slice(0, 6);

                    setBestSellers(selectedBestSellers);

                    // Lógica "También te podría gustar"
                    // Filtrar los que ya están en best sellers
                    const remaining = allProducts.filter(p => !selectedBestSellers.find(bs => bs.id === p.id));

                    // Mezclar y tomar 3
                    const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());
                    setRecommendations(shuffledRemaining.slice(0, 3));
                }
            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const ProductCard = ({ product }) => (
        <Link to={`/producto/${product.id}`} className="group">
            <div className="aspect-square overflow-hidden rounded-xl bg-gray-100 relative mb-4">
                <img
                    src={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/400?text=Sin+Foto"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                {product.stock <= 3 && (
                    <span className="absolute top-3 left-3 bg-brand-accent text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        ¡Últimas Unidades!
                    </span>
                )}
            </div>
            <h3 className="font-heading text-lg text-brand-dark group-hover:text-brand-primary transition-colors">
                {product.name}
            </h3>
            <p className="text-gray-500 font-bold mt-1">
                ${product.price.toLocaleString('es-AR')}
            </p>
        </Link>
    );

    return (
        <div className="pt-20">
            <SeoHead
                title="Más Vendidos | Gaustina"
                description="Descubre nuestros productos más populares y exclusivos a punto de agotarse."
            />
            <div className="bg-[#fefefc] py-12 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="font-heading text-4xl md:text-5xl text-brand-dark mb-4">
                            Más Vendidos
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Nuestras piezas favoritas que están volando. ¡No te quedes sin la tuya!
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">Cargando favoritos...</div>
                    ) : (
                        <>
                            {/* Grid Más Vendidos */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                                {bestSellers.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Sección Recomendados */}
                            {recommendations.length > 0 && (
                                <div className="border-t border-brand-dark/10 pt-16">
                                    <h2 className="font-heading text-3xl text-brand-dark text-center mb-10">
                                        A los usuarios también les gustaron estos...
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-90 hover:opacity-100 transition-opacity">
                                        {recommendations.map(product => (
                                            <ProductCard key={product.id} product={product} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BestSellersPage;
