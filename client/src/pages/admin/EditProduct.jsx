
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Loader, ArrowLeft, X, Trash2 } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useToast } from '../../context/ToastContext';

// URL INTELIGENTE
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [session, setSession] = useState(null);
    const { showToast } = useToast();

    // IMÁGENES
    const [existingImages, setExistingImages] = useState([]); // URLs ya guardadas
    const [newImageFiles, setNewImageFiles] = useState([]);   // Nuevos archivos a subir
    const [newPreviews, setNewPreviews] = useState([]);       // Previews de nuevos archivos

    // PERSONALIZACIÓN
    const [fabricColors, setFabricColors] = useState([]);
    const [embroideryColors, setEmbroideryColors] = useState([]);

    // Inputs temporales para agregar color
    const [newFabricColorName, setNewFabricColorName] = useState('');
    const [newFabricColorHex, setNewFabricColorHex] = useState('#000000');

    const [newEmbroideryColorName, setNewEmbroideryColorName] = useState('');
    const [newEmbroideryColorHex, setNewEmbroideryColorHex] = useState('#000000');

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        materials: '',
        measurements: '',
        allowInitials: false
    });

    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // 1. Auth Check
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/admin/login');
                return;
            }
            setSession(session);

            try {
                // 2. Load Categories
                const catsRes = await fetch(`${API_URL}/api/categories`);
                const catsData = await catsRes.json();
                setCategories(catsData);

                // 3. Load Product Data
                const prodRes = await fetch(`${API_URL}/api/products/${id}`);
                if (!prodRes.ok) throw new Error("Producto no encontrado");
                const product = await prodRes.json();

                // 4. Populate State
                setForm({
                    name: product.name,
                    description: product.description,
                    price: product.price,
                    stock: product.stock,
                    categoryId: product.categoryId || '',
                    materials: product.materials || '',
                    measurements: product.measurements || '',
                    allowInitials: product.customizationOptions?.allowInitials || false
                });

                setExistingImages(product.images || []);

                if (product.customizationOptions) {
                    // Normalizamos a objetos {name, hex} si vienen como strings antiguos
                    const normalizeColors = (colors) => {
                        if (!colors) return [];
                        return colors.map(c => typeof c === 'string' ? { name: c, hex: null } : c);
                    };

                    setFabricColors(normalizeColors(product.customizationOptions.fabricColors));
                    setEmbroideryColors(normalizeColors(product.customizationOptions.embroideryColors));
                }

            } catch (error) {
                console.error(error);
                showToast("Error cargando el producto", "error");
                navigate('/admin/dashboard');
            } finally {
                setFetching(false);
            }
        };

        fetchData();
    }, [id, navigate]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    // --- IMÁGENES ---

    // 1. Nuevas
    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewImageFiles(prev => [...prev, ...filesArray]);

            const previewsArray = filesArray.map(file => URL.createObjectURL(file));
            setNewPreviews(prev => [...prev, ...previewsArray]);
        }
    };

    // 2. Borrar Nueva (antes de subir)
    const removeNewImage = (index) => {
        setNewImageFiles(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // 3. Borrar Existente (se borra al guardar o visualmente ahora?)
    // Lo borramos visualmente del array que se enviará.
    const removeExistingImage = (index) => {
        if (window.confirm("¿Eliminar esta imagen del producto?")) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        }
    };


    // --- COLORES ---

    const addFabricColor = (e) => {
        e.preventDefault();
        const name = newFabricColorName.trim();
        if (name && !fabricColors.some(c => c.name === name)) {
            setFabricColors([...fabricColors, { name, hex: newFabricColorHex }]);
            setNewFabricColorName('');
            setNewFabricColorHex('#000000');
        }
    };

    const removeFabricColor = (index) => {
        setFabricColors(fabricColors.filter((_, i) => i !== index));
    };

    const addEmbroideryColor = (e) => {
        e.preventDefault();
        const name = newEmbroideryColorName.trim();
        if (name && !embroideryColors.some(c => c.name === name)) {
            setEmbroideryColors([...embroideryColors, { name, hex: newEmbroideryColorHex }]);
            setNewEmbroideryColorName('');
            setNewEmbroideryColorHex('#000000');
        }
    };

    const removeEmbroideryColor = (index) => {
        setEmbroideryColors(embroideryColors.filter((_, i) => i !== index));
    };

    // --- SUBMIT ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (existingImages.length === 0 && newImageFiles.length === 0) {
                throw new Error("El producto debe tener al menos una imagen");
            }

            // A. Subir nuevas imágenes
            const uploadedUrls = [];
            for (const file of newImageFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);

                uploadedUrls.push(urlData.publicUrl);
            }

            // B. Combinar URLs (Existentes + Nuevas)
            const finalImages = [...existingImages, ...uploadedUrls];

            // C. Actualizar Producto
            const response = await fetch(`${API_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    stock: parseInt(form.stock),
                    images: finalImages,
                    categoryId: parseInt(form.categoryId) || null,
                    materials: form.materials,
                    measurements: form.measurements,
                    customizationOptions: {
                        fabricColors,
                        embroideryColors,
                        allowInitials: form.allowInitials
                    }
                })
            });

            if (!response.ok) throw new Error("Error al actualizar el producto");

            showToast("Producto actualizado correctamente", "success");
            navigate('/admin/dashboard');

        } catch (error) {
            console.error(error);
            showToast(`Error: ${error.message}`, "error");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="p-12 text-center">Cargando datos del producto...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-gray-500 mb-6 hover:text-brand-dark">
                <ArrowLeft size={20} className="mr-2" /> Volver al Panel
            </button>

            <h1 className="text-3xl font-heading text-brand-dark mb-8">Editar Producto</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">

                {/* IMÁGENES */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Galería de Imágenes</label>

                    {/* Lista de Existentes + Previews Nuevas */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mb-4">
                        {existingImages.map((url, idx) => (
                            <div key={`exist-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-green-200 group">
                                <img src={url} alt="Producto" className="w-full h-full object-cover" />
                                <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-xs text-center py-1">Guardada</div>
                                <button
                                    type="button"
                                    onClick={() => removeExistingImage(idx)}
                                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                        {newPreviews.map((url, idx) => (
                            <div key={`new-${idx}`} className="relative aspect-square rounded-lg overflow-hidden border border-blue-200 group">
                                <img src={url} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-x-0 bottom-0 bg-blue-500/50 text-white text-xs text-center py-1">Nueva</div>
                                <button
                                    type="button"
                                    onClick={() => removeNewImage(idx)}
                                    className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Uploader */}
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer text-center group">
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Upload size={40} className="mx-auto mb-2 text-gray-400 group-hover:text-brand-primary" />
                        <p className="text-sm text-gray-500">
                            Agregar más fotos
                        </p>
                    </div>
                </div>

                {/* DATOS */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text" name="name" required
                            value={form.name}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="description" rows="3" required
                            value={form.description}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            name="categoryId"
                            value={form.categoryId}
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none bg-white"
                            onChange={handleChange}
                        >
                            <option value="">Seleccionar Categoría...</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
                            <input
                                type="number" name="price" required min="0" value={form.price}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number" name="stock" required min="0" value={form.stock}
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Materiales</label>
                            <input
                                type="text" name="materials"
                                placeholder="Ej: Tusor 100% Algodón"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                                onChange={handleChange}
                                value={form.materials}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Medidas</label>
                            <input
                                type="text" name="measurements"
                                placeholder="Ej: 40x40 cm"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                                onChange={handleChange}
                                value={form.measurements}
                            />
                        </div>
                    </div>
                </div>

                {/* PERSONALIZACIÓN */}
                <div className="border-t pt-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Opciones de Personalización</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Colores de Tela */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Colores de Tela</label>

                            <div className="flex gap-2 mb-3 items-center">
                                <input
                                    type="color"
                                    value={newFabricColorHex}
                                    onChange={(e) => setNewFabricColorHex(e.target.value)}
                                    className="h-10 w-10 p-1 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={newFabricColorName}
                                    onChange={(e) => setNewFabricColorName(e.target.value)}
                                    placeholder="Nombre"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                                <button onClick={addFabricColor} type="button" className="bg-black text-white hover:bg-gray-800 px-3 py-2 rounded text-sm font-medium">+</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {fabricColors.map((color, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-white border border-gray-200 text-sm gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.hex || '#ccc' }}></div>
                                        {color.name}
                                        <button type="button" onClick={() => removeFabricColor(idx)} className="ml-1 text-red-500 hover:text-red-700">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Colores de Bordado */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Colores de Bordado</label>

                            <div className="flex gap-2 mb-3 items-center">
                                <input
                                    type="color"
                                    value={newEmbroideryColorHex}
                                    onChange={(e) => setNewEmbroideryColorHex(e.target.value)}
                                    className="h-10 w-10 p-1 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={newEmbroideryColorName}
                                    onChange={(e) => setNewEmbroideryColorName(e.target.value)}
                                    placeholder="Nombre"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                                <button onClick={addEmbroideryColor} type="button" className="bg-black text-white hover:bg-gray-800 px-3 py-2 rounded text-sm font-medium">+</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {embroideryColors.map((color, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-white border border-gray-200 text-sm gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.hex || '#ccc' }}></div>
                                        {color.name}
                                        <button type="button" onClick={() => removeEmbroideryColor(idx)} className="ml-1 text-red-500 hover:text-red-700">×</button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="allowInitials"
                                checked={form.allowInitials}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">Permitir Personalización con Iniciales</span>
                                <span className="text-xs text-gray-500">Habilita un campo para que el cliente ingrese 1 o 2 letras.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    type="submit" disabled={loading}
                    className="w-full bg-black text-white font-medium py-4 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                    {loading ? <><Loader className="animate-spin" /> Guardando...</> : 'Guardar Cambios'}
                </button>
            </form >
        </div >
    );
};

export default EditProduct;
