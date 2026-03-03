import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Agrupamos useNavigate aquí
import { Trash2, Plus, Package, Pencil, ShoppingBag, CheckCircle, Truck, FileText, XCircle, Mail, PauseCircle, PlayCircle } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import { useToast } from '../../context/ToastContext';

// URL Inteligente
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [activeTab, setActiveTab] = useState('products');
    const [loading, setLoading] = useState(true);

    // UI State
    const [modalOpen, setModalOpen] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const { showToast } = useToast();

    // Estado para Edición
    // const [editingProduct, setEditingProduct] = useState(null);
    // const [editForm, setEditForm] = useState({ ... }); // Eliminamos estas referencias


    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const fetchProducts = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/products`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (res.ok) setProducts(await res.json());
        } catch (error) {
            console.error("Error fetching products:", error);
            showToast("No se pudieron cargar los productos", "error");
        }
    };

    const fetchOrders = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                const errorData = await res.json().catch(() => ({}));
                console.error("Orders fetch failed:", res.status, errorData);
                showToast(`Error ${res.status}: No se pudieron cargar las ventas`, "error");
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            showToast("Error de conexión al cargar ventas", "error");
        }
    };


    const confirmDelete = async () => {
        if (!itemToDelete) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/products/${itemToDelete.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                setProducts(products.filter(p => p.id !== itemToDelete.id));
                showToast("Producto eliminado correctamente", "success");
            } else {
                const errorData = await res.json().catch(() => ({}));
                const message = errorData.error || "Error al eliminar el producto";
                showToast(message, "error");
            }
        } catch (error) {
            console.error(error);
            showToast("Error de conexión", "error");
        } finally {
            setModalOpen(false);
            setItemToDelete(null);
        }
    };

    const handleDeleteClick = (product) => {
        setItemToDelete(product);
        setModalOpen(true);
    };

    const handleTogglePause = async (product) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/products/${product.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ paused: !product.paused })
            });

            if (res.ok) {
                const updatedProduct = await res.json();
                setProducts(products.map(p => (p.id === updatedProduct.id ? updatedProduct : p)));
                showToast(`Producto ${updatedProduct.paused ? 'pausado' : 'activado'} correctamente`);
            } else {
                showToast("Error al actualizar el estado del producto", "error");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            showToast("Error de conexión", "error");
        }
    };

    const handleDownloadInvoice = async (orderId) => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/orders/${orderId}/invoice`, {
                headers: {
                    'Authorization': `Bearer ${session?.access_token}`
                }
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `Factura-${orderId}.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                a.remove();
            } else {
                showToast("Error al descargar la factura", "error");
            }
        } catch (error) {
            console.error("Error downloading invoice:", error);
            showToast("Error al descargar la factura", "error");
        }
    };

    const handleStatusUpdate = async (orderId, newStatus) => {
        if (newStatus === 'CANCELLED' && !window.confirm("¿Estás seguro de que quieres cancelar esta orden?")) {
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (res.ok) {
                setOrders(orders.map(o => (o.id === orderId ? { ...o, status: newStatus } : o)));
                showToast(`Estado de orden actualizado a ${newStatus}`);
            } else {
                showToast("Error al actualizar el estado de la orden", "error");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            showToast("Error de conexión", "error");
        }
    };

    // --- LÓGICA DE EDICIÓN ---

    const handleEditClick = (product) => {
        navigate(`/admin/editar-producto/${product.id}`);
    };

    /* Eliminamos la lógica del modal antiguo
    const handleEditChange = (e) => { ... }
    const handleUpdate = async (e) => { ... }
    */



    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await Promise.all([fetchProducts(), fetchOrders()]);
            setLoading(false);
        };
        loadData();
    }, []);

    // Re-cargar cuando se cambia de pestaña para asegurar datos frescos
    useEffect(() => {
        if (activeTab === 'orders') fetchOrders();
        if (activeTab === 'products') fetchProducts();
    }, [activeTab]);

    if (loading) return <div className="p-8 text-center">Cargando panel...</div>;

    return (
        <div className="p-4 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-heading text-brand-dark mb-2">Panel de Control</h1>
                    <div className="flex space-x-1.5 bg-gray-100 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => {
                                setActiveTab('products');
                                fetchProducts();
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Productos
                        </button>
                        <button
                            onClick={() => {
                                setActiveTab('orders');
                                fetchOrders();
                            }}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'orders' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Ventas
                        </button>
                    </div>
                </div>

                <div className="flex gap-4 items-center">
                    <button
                        onClick={handleLogout}
                        className="text-gray-500 hover:text-red-600 font-medium px-4 py-2 transition-colors border border-transparent hover:border-red-100 rounded-lg"
                    >
                        Cerrar Sesión
                    </button>

                    <Link
                        to="/admin/crear-producto"
                        className="bg-black text-white px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all shadow-md text-sm"
                    >
                        <Plus size={18} /> Nuevo Producto
                    </Link>
                    <Link
                        to="/admin/categorias"
                        className="bg-white text-black border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm font-medium"
                    >
                        Categorías
                    </Link>
                    <Link
                        to="/admin/mensajes"
                        className="bg-white text-black border border-gray-200 px-3 py-1.5 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm font-medium text-sm"
                    >
                        <Mail size={18} /> Mensajes
                    </Link>
                </div>
            </div>

            {activeTab === 'products' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
                            <tr>
                                <th className="p-3">Imagen</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Precio</th>
                                <th className="p-3">Stock</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className={`transition-all duration-300 border-b border-gray-100 ${product.paused ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0 bg-gray-50' : 'hover:bg-gray-50'}`}>
                                    <td className="p-3 relative group">
                                        {product.paused && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                <span className="bg-black/70 text-white text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Pausado
                                                </span>
                                            </div>
                                        )}
                                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden border border-gray-200">
                                            <img
                                                src={(product.images && product.images.length > 0) ? product.images[0] : "https://via.placeholder.com/150?text=Sin+Foto"}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = "https://via.placeholder.com/150?text=Error";
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td className="p-3 font-medium text-gray-800 text-sm">{product.name}</td>
                                    <td className="p-3 text-gray-900 font-bold text-sm">${product.price.toLocaleString('es-AR')}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock} un.
                                        </span>
                                    </td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleTogglePause(product)}
                                            className={`transition-colors p-1.5 mr-1 ${product.paused ? 'text-green-500 hover:text-green-600' : 'text-orange-400 hover:text-orange-500'}`}
                                            title={product.paused ? "Reanudar publicación" : "Pausar publicación"}
                                        >
                                            {product.paused ? <PlayCircle size={16} /> : <PauseCircle size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="text-gray-400 hover:text-blue-500 transition-colors p-1.5 mr-1"
                                            title="Editar producto"
                                        >
                                            <Pencil size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-1.5"
                                            title="Eliminar producto"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {products.length === 0 && (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                            <Package size={48} className="mb-4 opacity-20" />
                            <p>No hay productos cargados todavía.</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
                            <tr>
                                <th className="p-3">ID</th>
                                <th className="p-3">Cliente</th>
                                <th className="p-3">Items</th>
                                <th className="p-3">Total</th>
                                <th className="p-3">Pago</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-3 text-[11px] font-mono text-gray-500">
                                        {String(order.id).slice(0, 8)}
                                    </td>
                                    <td className="p-3">
                                        <div className="font-medium text-gray-800 text-sm">
                                            {order.user?.name || order.customerName || 'Invitado'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {order.user?.email || order.customerEmail}
                                        </div>
                                    </td>
                                    <td className="p-3">
                                        <div className="text-sm font-medium text-gray-800">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </div>
                                        <div className="mt-1 space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="text-[9px] leading-tight border-l-2 border-gray-100 pl-2 py-0.5">
                                                    <div className="font-bold text-gray-700">{item.product?.name || "Producto desconocido"}</div>
                                                    {item.selectedCustomizations && (
                                                        <div className="text-gray-500 italic">
                                                            {item.selectedCustomizations.fabricColor && <span>Tela: {item.selectedCustomizations.fabricColor} </span>}
                                                            {item.selectedCustomizations.embroideryColor && <span>Bord: {item.selectedCustomizations.embroideryColor} </span>}
                                                            {item.selectedCustomizations.initials && <span className="text-brand-primary font-bold">Inic: {item.selectedCustomizations.initials} ({item.selectedCustomizations.initialsColor})</span>}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-3 font-bold text-gray-900 text-sm">
                                        ${Number(order.totalAmount).toLocaleString('es-AR')}
                                    </td>
                                    <td className="p-3 text-xs">
                                        {order.paymentMethod}
                                    </td>
                                    <td className="p-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold 
                                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-1">
                                            <button
                                                onClick={() => handleDownloadInvoice(order.id)}
                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                title="Descargar Factura"
                                            >
                                                <FileText size={16} />
                                            </button>
                                            {order.status !== 'CANCELLED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Cancelar Orden"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                            {order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'PAID')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Marcar como PAGADO"
                                                >
                                                    <CheckCircle size={16} />
                                                </button>
                                            )}
                                            {order.status === 'PAID' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Marcar como ENVIADO"
                                                >
                                                    <Truck size={16} />
                                                </button>
                                            )}
                                            {order.status === 'SHIPPED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                                    className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                                    title="Marcar como ENTREGADO"
                                                >
                                                    <Package size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && (
                        <div className="p-12 text-center text-gray-400 flex flex-col items-center">
                            <ShoppingBag size={48} className="mb-4 opacity-20" />
                            <p>No hay ventas registradas todavía.</p>
                        </div>
                    )}
                </div>
            )}

            {/* --- MODAL DE EDICIÓN REMOVIDO (Ahora es una página dedicada) --- */}

            <ConfirmationModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmDelete}
                title="Eliminar Producto"
                message={`¿Estás seguro que quieres eliminar "${itemToDelete?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default AdminDashboard;