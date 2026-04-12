import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../../context/ToastContext';
import { Tag, Plus, Trash2, Edit2, X, Check, Search, Percent, Banknote, Truck, ArrowLeft } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CouponManager = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingCoupon, setEditingCoupon] = useState(null);

    const [formData, setFormData] = useState({
        code: '',
        type: 'PERCENTAGE',
        value: '',
        minItems: '',
        usageLimit: '',
        expirationDate: '',
        isActive: true
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/api/coupons`);
            if (!res.ok) throw new Error('Error al obtener cupones');
            const data = await res.json();
            setCoupons(data);
        } catch (error) {
            console.error(error);
            showToast('No se pudieron cargar los cupones', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenForm = (coupon = null) => {
        if (coupon) {
            setEditingCoupon(coupon);
            setFormData({
                code: coupon.code,
                type: coupon.type,
                value: coupon.value,
                minItems: coupon.minItems || '',
                usageLimit: coupon.usageLimit && coupon.usageLimit !== -1 ? coupon.usageLimit : '',
                expirationDate: coupon.expirationDate ? new Date(coupon.expirationDate).toISOString().split('T')[0] : '',
                isActive: coupon.isActive
            });
        } else {
            setEditingCoupon(null);
            setFormData({
                code: '',
                type: 'PERCENTAGE',
                value: '',
                minItems: '',
                usageLimit: '',
                expirationDate: '',
                isActive: true
            });
        }
        setIsFormOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCoupon 
                ? `${API_URL}/api/coupons/${editingCoupon.id}`
                : `${API_URL}/api/coupons`;
            
            const method = editingCoupon ? 'PUT' : 'POST';

            let submitData = { ...formData };
            if (submitData.type === 'FREE_SHIPPING') {
                submitData.value = 0;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(submitData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Error al guardar el cupón');
            }

            showToast(editingCoupon ? 'Cupón actualizado' : 'Cupón creado', 'success');
            setIsFormOpen(false);
            fetchCoupons();
        } catch (error) {
            console.error(error);
            showToast(error.message, 'error');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este cupón?')) return;
        try {
            const res = await fetch(`${API_URL}/api/coupons/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Error al eliminar');
            showToast('Cupón eliminado', 'success');
            fetchCoupons();
        } catch (error) {
            console.error(error);
            showToast('No se pudo eliminar el cupón', 'error');
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'PERCENTAGE': return <Percent size={16} className="text-blue-500" />;
            case 'FIXED': return <Banknote size={16} className="text-green-500" />;
            case 'FREE_SHIPPING': return <Truck size={16} className="text-purple-500" />;
            default: return <Tag size={16} />;
        }
    };

    const filteredCoupons = coupons.filter(c => c.code.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="space-y-6 max-w-6xl mx-auto p-4 sm:p-6">
            <button 
                onClick={() => navigate('/admin/dashboard')} 
                className="flex items-center text-gray-500 hover:text-black transition-colors mb-2"
            >
                <ArrowLeft size={20} className="mr-2" /> Volver al Panel
            </button>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-900 border-b-2 border-brand-primary pb-2 inline-block">
                    Gestión de Cupones
                </h1>
                <button
                    onClick={() => handleOpenForm()}
                    className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    <span>Nuevo Cupón</span>
                </button>
            </div>

            <div className="flex items-center bg-white border border-gray-200 rounded-lg px-4 py-2 w-full md:w-96 shadow-sm">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                    type="text"
                    placeholder="Buscar código..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full focus:outline-none"
                />
            </div>

            {/* --- CUADRÍCULA DE CUPONES --- */}
            {loading ? (
                <div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto"></div></div>
            ) : filteredCoupons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Tag className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">No hay cupones</h3>
                    <p className="text-gray-500">Comienza creando un nuevo código de descuento.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCoupons.map((coupon) => (
                        <div key={coupon.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden ${!coupon.isActive ? 'opacity-70 border-red-200' : 'border-gray-200'}`}>
                            <div className="flex justify-between items-center bg-gray-50 px-4 py-3 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    {getTypeIcon(coupon.type)}
                                    <span className="font-bold text-gray-800 text-lg tracking-wider">{coupon.code}</span>
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                    {coupon.isActive ? 'Activo' : 'Inactivo'}
                                </span>
                            </div>
                            <div className="p-4 space-y-2 text-sm text-gray-600">
                                <div className="flex gap-2 font-medium text-gray-900">
                                    Beneficio: 
                                    {coupon.type === 'PERCENTAGE' && `${coupon.value}% OFF`}
                                    {coupon.type === 'FIXED' && `$${coupon.value.toLocaleString('es-AR')} OFF`}
                                    {coupon.type === 'FREE_SHIPPING' && `Envío Gratis`}
                                </div>
                                
                                <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-3 pt-3 border-t border-gray-100 text-xs">
                                    <p>Usos: <span className="font-bold">{coupon.usageCount}</span>{coupon.usageLimit ? ` / ${coupon.usageLimit}` : ' (Sin límite)'}</p>
                                    <p>Mín. ítems: <span className="font-bold">{coupon.minItems || 'Ninguno'}</span></p>
                                    <p className="col-span-2">
                                        Expira: <span className="font-bold">{coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Nunca'}</span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex border-t border-gray-200">
                                <button
                                    onClick={() => handleOpenForm(coupon)}
                                    className="flex-1 py-2 flex items-center justify-center gap-2 text-brand-primary hover:bg-brand-primary/10 transition-colors font-medium border-r border-gray-200"
                                >
                                    <Edit2 size={16} /> Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(coupon.id)}
                                    className="flex-1 py-2 flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-colors font-medium"
                                >
                                    <Trash2 size={16} /> Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODAL FORMULARIO --- */}
            {isFormOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden max-h-[90vh] flex flex-col">
                        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingCoupon ? 'Editar Cupón' : 'Nuevo Cupón'}
                            </h2>
                            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 overflow-y-auto">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Código Promocional</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border border-gray-300 p-2.5 rounded-lg uppercase font-bold tracking-wider"
                                    value={formData.code}
                                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                    placeholder="EJ: VERANO24"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Descuento</label>
                                    <select
                                        className="w-full border border-gray-300 p-2.5 rounded-lg bg-white"
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    >
                                        <option value="PERCENTAGE">Porcentaje (%)</option>
                                        <option value="FIXED">Monto Fijo ($)</option>
                                        <option value="FREE_SHIPPING">Envío Gratis</option>
                                    </select>
                                </div>
                                
                                {formData.type !== 'FREE_SHIPPING' && (
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1">
                                            Valor {formData.type === 'PERCENTAGE' ? '(%)' : '($)'}
                                        </label>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            step={formData.type === 'PERCENTAGE' ? "1" : "0.01"}
                                            className="w-full border border-gray-300 p-2.5 rounded-lg"
                                            value={formData.value}
                                            onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Mínimo de Artículos</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Opcional"
                                        className="w-full border border-gray-300 p-2.5 rounded-lg"
                                        value={formData.minItems}
                                        onChange={(e) => setFormData({ ...formData, minItems: e.target.value })}
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Unidades físicas requeridas</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Límite de Usos</label>
                                    <input
                                        type="number"
                                        min="1"
                                        placeholder="Opcional (Ej: 100)"
                                        className="w-full border border-gray-300 p-2.5 rounded-lg"
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">Total de veces canjeable</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Fecha de Expiración</label>
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 p-2.5 rounded-lg"
                                    value={formData.expirationDate}
                                    onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                                    <span className="ml-3 text-sm font-medium text-gray-900">Activo</span>
                                </label>
                            </div>
                            
                            <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsFormOpen(false)}
                                    className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 font-bold flex items-center gap-2 transition-colors shadow-sm"
                                >
                                    <Check size={18} />
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponManager;
