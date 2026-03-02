import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Loader, ArrowLeft, X } from 'lucide-react';
import { supabase } from '../../utils/supabase';
import { useToast } from '../../context/ToastContext';

// URL INTELIGENTE
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const CreateProduct = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [session, setSession] = useState(null);
    const { showToast } = useToast();

    // ESTADO PARA MÚLTIPLES IMÁGENES
    const [imageFiles, setImageFiles] = useState([]); // Array de archivos
    const [previews, setPreviews] = useState([]);     // Array de URLs locales para verlas

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
        // Fetch Categories
        fetch(`${API_URL}/api/categories`)
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));

        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) navigate('/admin/login');
            setSession(session);
        });
    }, [navigate]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm({ ...form, [e.target.name]: value });
    };

    // MANEJAR SELECCIÓN MÚLTIPLE
    const handleImageChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files); // Convertir a array real

            // 1. Guardar archivos para subir luego
            setImageFiles(prev => [...prev, ...filesArray]);

            // 2. Generar previsualizaciones
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    // BORRAR UNA IMAGEN DE LA LISTA
    const removeImage = (index) => {
        setImageFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    // HANDLERS PERSONALIZACIÓN
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (imageFiles.length === 0) throw new Error("Debes seleccionar al menos una imagen");
            if (!session) throw new Error("No hay sesión activa");

            // --- PROCESO DE SUBIDA MÚLTIPLE ---
            const uploadedUrls = [];

            // Recorremos cada archivo seleccionado
            for (const file of imageFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                // 1. Subir
                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                // 2. Obtener URL
                const { data: urlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);

                uploadedUrls.push(urlData.publicUrl);
            }

            console.log("URLs generadas:", uploadedUrls);

            // 3. Guardar en Backend (Enviamos el array completo de URLs)
            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    name: form.name,
                    description: form.description,
                    price: parseFloat(form.price),
                    stock: parseInt(form.stock),
                    images: uploadedUrls,
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

            if (!response.ok) throw new Error("Error al guardar en base de datos");

            showToast("¡Producto creado con éxito!", 'success');
            navigate('/admin/dashboard');

        } catch (error) {
            console.error(error);
            showToast(`Error: ${error.message}`, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center text-gray-500 mb-6 hover:text-brand-dark">
                <ArrowLeft size={20} className="mr-2" /> Volver al Panel
            </button>

            <h1 className="text-3xl font-heading text-brand-dark mb-8">Nuevo Producto</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-100">

                {/* ZONA DE CARGA DE IMÁGENES */}
                <div className="space-y-4">
                    <label className="block text-sm font-medium text-gray-700">Galería de Imágenes</label>

                    {/* Área de Drop/Click */}
                    <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:bg-gray-50 transition-colors cursor-pointer text-center group">
                        <input
                            type="file"
                            accept="image/*"
                            multiple  // <--- ¡ESTO PERMITE SELECCIONAR VARIAS!
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        />
                        <Upload size={40} className="mx-auto mb-2 text-gray-400 group-hover:text-brand-primary" />
                        <p className="text-sm text-gray-500">
                            Arrastra tus fotos aquí o haz clic para seleccionar varias.
                        </p>
                    </div>

                    {/* Grilla de Previsualización */}
                    {previews.length > 0 && (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 mt-4">
                            {previews.map((url, index) => (
                                <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute top-1 right-1 bg-white/80 p-1 rounded-full text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Campos de Texto */}
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                        <input
                            type="text" name="name" required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                        <textarea
                            name="description" rows="3" required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                        <select
                            name="categoryId"
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
                                type="number" name="price" required min="0"
                                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-black focus:outline-none"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                            <input
                                type="number" name="stock" required min="0"
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
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Opciones de Personalización (Opcional)</h3>

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
                                    placeholder="Nombre (ej: Rojo)"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                                <button onClick={addFabricColor} type="button" className="bg-black text-white hover:bg-gray-800 px-3 py-2 rounded text-sm font-medium">+</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {fabricColors.map((color, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-white border border-gray-200 text-sm gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.hex }}></div>
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
                                    placeholder="Nombre (ej: Dorado)"
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                                <button onClick={addEmbroideryColor} type="button" className="bg-black text-white hover:bg-gray-800 px-3 py-2 rounded text-sm font-medium">+</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {embroideryColors.map((color, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-white border border-gray-200 text-sm gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.hex }}></div>
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
                    {loading ? <><Loader className="animate-spin" /> Subiendo {imageFiles.length} imágenes...</> : 'Publicar Producto'}
                </button>
            </form >
        </div >
    );
};

export default CreateProduct;