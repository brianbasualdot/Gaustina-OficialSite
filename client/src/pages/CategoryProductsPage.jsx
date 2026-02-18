import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CategoryProductsPage = () => {
    const { categoryName } = useParams(); // Obtiene "servilletas", "caminos", etc.
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Idealmente la API soportaría filtros, pero por ahora filtramos acá
                const res = await fetch(`${API_URL}/api/products`);
                if (res.ok) {
                    const allProducts = await res.json();

                    // Filtrar por el nombre de categoría (insensible a mayúsculas)
                    const filtered = allProducts.filter(p =>
                        p.category?.name?.toLowerCase() === categoryName.toLowerCase()
                    );
                    setProducts(filtered);
                }
            } catch (error) {
                console.error("Error cargando productos:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categoryName]);

    // Capitalizar para mostrar en título
    const displayTitle = categoryName.charAt(0).toUpperCase() + categoryName.slice(1);

    return (
        <div className="pt-20">
            <div className="bg-[#fefefc] py-12 px-6 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <h1 className="font-heading text-4xl md:text-5xl text-brand-dark text-center mb-4">
                        {displayTitle}
                    </h1>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                        Explora nuestra colección exclusiva de {categoryName}.
                    </p>

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
                                        <img
                                            src={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/400?text=Sin+Foto"}
                                            alt={product.name}
                                            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${product.paused ? 'grayscale opacity-75' : ''}`}
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
                                    <p className="text-gray-500 font-bold mt-1">
                                        ${product.price.toLocaleString('es-AR')}
                                    </p>
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
