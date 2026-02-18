import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Plus, Loader } from 'lucide-react';
import { supabase } from '../../utils/supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CategoryManager = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', description: '' });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch(`${API_URL}/api/categories`);
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta categoría?")) return;

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/categories/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });

            if (res.ok) {
                setCategories(categories.filter(c => c.id !== id));
            } else {
                const err = await res.json();
                alert(err.error || "Error al eliminar");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/categories`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                const newCategory = await res.json();
                setCategories([...categories, newCategory]);
                setForm({ name: '', description: '' });
                alert("Categoría creada");
            } else {
                const err = await res.json();
                alert(err.error || "Error al crear categoría");
            }
        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-gray-500 mb-6 hover:text-brand-dark">
                <ArrowLeft size={20} className="mr-2" /> Volver al Panel
            </button>

            <h1 className="text-3xl font-heading text-brand-dark mb-8">Gestión de Categorías</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* FORMULARIO */}
                <div className="md:col-span-1">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-6">
                        <h2 className="text-lg font-bold mb-4">Nueva Categoría</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black focus:outline-none"
                                    rows="3"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-black text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader size={16} className="animate-spin" /> : <Plus size={16} />} Crear
                            </button>
                        </form>
                    </div>
                </div>

                {/* LISTA */}
                <div className="md:col-span-2">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-gray-600 uppercase text-xs font-medium">
                                <tr>
                                    <th className="p-4">Nombre</th>
                                    <th className="p-4">Descripción</th>
                                    <th className="p-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr><td colSpan="3" className="p-8 text-center">Cargando...</td></tr>
                                ) : categories.length === 0 ? (
                                    <tr><td colSpan="3" className="p-8 text-center text-gray-400">No hay categorías</td></tr>
                                ) : (
                                    categories.map(cat => (
                                        <tr key={cat.id} className="hover:bg-gray-50">
                                            <td className="p-4 font-medium">{cat.name}</td>
                                            <td className="p-4 text-sm text-gray-600">{cat.description || '-'}</td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => handleDelete(cat.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CategoryManager;
