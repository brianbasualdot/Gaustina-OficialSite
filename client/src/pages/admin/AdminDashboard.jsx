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
        }
    };

    const fetchOrders = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/orders`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (res.ok) setOrders(await res.json());
        } catch (error) {
            console.error("Error fetching orders:", error);
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
                showToast("Error al eliminar el producto", "error");
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
            await Promise.all([fetchProducts(), fetchOrders()]);
            setLoading(false);
        };
        loadData();
    }, []);

    if (loading) return <div className="p-8 text-center">Cargando panel...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heading text-brand-dark mb-2">Panel de Control</h1>
                    <div className="flex space-x-2 bg-gray-100 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setActiveTab('products')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-white shadow text-black' : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Productos
                        </button>
                        <button
                            onClick={() => setActiveTab('orders')}
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
                        className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-all shadow-md"
                    >
                        <Plus size={20} /> Nuevo Producto
                    </Link>
                    <Link
                        to="/admin/categorias"
                        className="bg-white text-black border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm font-medium"
                    >
                        Categorías
                    </Link>
                    <Link
                        to="/admin/mensajes"
                        className="bg-white text-black border border-gray-200 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm font-medium"
                    >
                        <Mail size={20} /> Mensajes
                    </Link>
                </div>
            </div>

            {activeTab === 'products' ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-medium">
                            <tr>
                                <th className="p-4">Imagen</th>
                                <th className="p-4">Nombre</th>
                                <th className="p-4">Precio</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {products.map((product) => (
                                <tr key={product.id} className={`transition-all duration-300 border-b border-gray-100 ${product.paused ? 'opacity-50 grayscale hover:opacity-100 hover:grayscale-0 bg-gray-50' : 'hover:bg-gray-50'}`}>
                                    <td className="p-4 relative group">
                                        {product.paused && (
                                            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                                                <span className="bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                    Pausado
                                                </span>
                                            </div>
                                        )}
                                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden border border-gray-200">
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
                                    <td className="p-4 font-medium text-gray-800">{product.name}</td>
                                    <td className="p-4 text-gray-900 font-bold">${product.price.toLocaleString('es-AR')}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.stock} un.
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() => handleTogglePause(product)}
                                            className={`transition-colors p-2 mr-2 ${product.paused ? 'text-green-500 hover:text-green-600' : 'text-orange-400 hover:text-orange-500'}`}
                                            title={product.paused ? "Reanudar publicación" : "Pausar publicación"}
                                        >
                                            {product.paused ? <PlayCircle size={18} /> : <PauseCircle size={18} />}
                                        </button>
                                        <button
                                            onClick={() => handleEditClick(product)}
                                            className="text-gray-400 hover:text-blue-500 transition-colors p-2 mr-2"
                                            title="Editar producto"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(product)}
                                            className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                            title="Eliminar producto"
                                        >
                                            <Trash2 size={18} />
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
                        <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-medium">
                            <tr>
                                <th className="p-4">ID</th>
                                <th className="p-4">Cliente</th>
                                <th className="p-4">Items</th>
                                <th className="p-4">Total</th>
                                <th className="p-4">Pago</th>
                                <th className="p-4">Estado</th>
                                <th className="p-4 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {orders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 text-xs font-mono text-gray-500">
                                        {String(order.id).slice(0, 8)}
                                    </td>
                                    <td className="p-4">
                                        <div className="font-medium text-gray-800">
                                            {order.user?.name || order.customerName || 'Invitado'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {order.user?.email || order.customerEmail}
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="text-sm font-medium text-gray-800">
                                            {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                        </div>
                                        <div className="mt-1 space-y-2">
                                            {order.items.map((item, idx) => (
                                                <div key={idx} className="text-[10px] leading-tight border-l-2 border-gray-100 pl-2 py-0.5">
                                                    <div className="font-bold text-gray-700">{item.product.name}</div>
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
                                    <td className="p-4 font-bold text-gray-900">
                                        ${Number(order.total).toLocaleString('es-AR')}
                                    </td>
                                    <td className="p-4 text-xs">
                                        {order.paymentMethod}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold 
                                            ${order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                order.status === 'PAID' ? 'bg-green-100 text-green-800' :
                                                    order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex justify-center gap-1">
                                            <button
                                                onClick={() => handleDownloadInvoice(order.id)}
                                                className="p-1 text-gray-600 hover:bg-gray-100 rounded"
                                                title="Descargar Factura"
                                            >
                                                <FileText size={18} />
                                            </button>

                                            {order.status !== 'CANCELLED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'CANCELLED')}
                                                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                                                    title="Cancelar Orden"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            )}

                                            {order.status === 'PENDING' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'PAID')}
                                                    className="p-1 text-green-600 hover:bg-green-50 rounded"
                                                    title="Marcar como PAGADO"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                            )}
                                            {order.status === 'PAID' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'SHIPPED')}
                                                    className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                                                    title="Marcar como ENVIADO"
                                                >
                                                    <Truck size={18} />
                                                </button>
                                            )}
                                            {order.status === 'SHIPPED' && (
                                                <button
                                                    onClick={() => handleStatusUpdate(order.id, 'DELIVERED')}
                                                    className="p-1 text-purple-600 hover:bg-purple-50 rounded"
                                                    title="Marcar como ENTREGADO"
                                                >
                                                    <Package size={18} />
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