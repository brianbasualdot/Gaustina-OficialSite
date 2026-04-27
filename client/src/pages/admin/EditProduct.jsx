import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Loader, ArrowLeft, ArrowRight, X, Trash2, Star, Move, Maximize2 } from 'lucide-react';
import { motion, Reorder } from 'framer-motion';
import { supabase } from '../../utils/supabase';
import { useToast } from '../../context/ToastContext';
import { processImage } from '../../utils/imageUtils';

// URL INTELIGENTE
import { API_URL } from '../../config/api';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [session, setSession] = useState(null);
    const { showToast } = useToast();
    const containerRef = useRef(null);
    const galleryRef = useRef(null);

    // IMÁGENES REORDENABLES
    const [managedImages, setManagedImages] = useState([]); // [{id, url, file, isNew}]

    // SVGs
    const [existingSvgs, setExistingSvgs] = useState([]);     // URLs ya guardadas
    const [newSvgFiles, setNewSvgFiles] = useState([]);       // Nuevos archivos SVG
    const [newSvgPreviews, setNewSvgPreviews] = useState([]); // Previews de nuevos SVGs

    // POSICIONAMIENTO Y ESCALA (Admin)
    const [initialsConfig, setInitialsConfig] = useState({ x: 50, y: 50, scale: 1 });
    const [svgConfig, setSvgConfig] = useState({ x: 50, y: 50, scale: 1 });

    // PERSONALIZACIÓN
    const [fabricColors, setFabricColors] = useState([]);
    const [embroideryColors, setEmbroideryColors] = useState([]);
    const [initialsColors, setInitialsColors] = useState([]);

    // Inputs temporales para agregar color
    const [newFabricColorName, setNewFabricColorName] = useState('');
    const [newFabricColorHex, setNewFabricColorHex] = useState('#000000');

    const [newEmbroideryColorName, setNewEmbroideryColorName] = useState('');
    const [newEmbroideryColorHex, setNewEmbroideryColorHex] = useState('#000000');

    const [newInitialsColorName, setNewInitialsColorName] = useState('');
    const [newInitialsColorHex, setNewInitialsColorHex] = useState('#000000');

    const [form, setForm] = useState({
        name: '',
        description: '',
        price: '',
        stock: '',
        categoryId: '',
        materials: '',
        measurements: '',
        allowInitials: false,
        allowSvg: false
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
                    allowInitials: product.customizationOptions?.allowInitials || false,
                    allowSvg: product.customizationOptions?.allowSvg || false
                });

                setManagedImages((product.images || []).map((url, i) => ({
                    id: `existing-${i}`,
                    url,
                    file: null,
                    isNew: false
                })));
                setExistingSvgs(product.customizationOptions?.svgLibrary || []);

                if (product.customizationOptions?.initialsConfig) {
                    const config = product.customizationOptions.initialsConfig;
                    setInitialsConfig({
                        x: parseFloat(config.x) || 50,
                        y: parseFloat(config.y) || 50,
                        scale: parseFloat(config.scale) || 1
                    });
                }
                if (product.customizationOptions?.svgConfig) {
                    const config = product.customizationOptions.svgConfig;
                    setSvgConfig({
                        x: parseFloat(config.x) || 50,
                        y: parseFloat(config.y) || 50,
                        scale: parseFloat(config.scale) || 1
                    });
                }

                if (product.customizationOptions) {
                    // Normalizamos a objetos {name, hex} si vienen como strings antiguos
                    const normalizeColors = (colors) => {
                        if (!colors) return [];
                        return colors.map(c => typeof c === 'string' ? { name: c, hex: null } : c);
                    };

                    setFabricColors(normalizeColors(product.customizationOptions.fabricColors));
                    setEmbroideryColors(normalizeColors(product.customizationOptions.embroideryColors));
                    setInitialsColors(normalizeColors(product.customizationOptions.initialsColors));
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

    // 1. Nuevas
    const handleImageChange = async (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            
            // Procesar cada imagen para convertirla a WebP y optimizarla
            const processedItems = await Promise.all(
                filesArray.map(async (file) => {
                    const optimizedFile = await processImage(file);
                    return {
                        id: `new-${Date.now()}-${Math.random().toString(36).substring(2)}`,
                        file: optimizedFile,
                        url: URL.createObjectURL(optimizedFile),
                        isNew: true
                    };
                })
            );
            
            setManagedImages(prev => [...prev, ...processedItems]);
        }
    };

    // 2. Borrar Imagen
    const removeImage = (id, isNew) => {
        if (!isNew && !window.confirm("¿Eliminar esta imagen del producto?")) return;
        setManagedImages(prev => prev.filter(img => img.id !== id));
    };

    // MOVER IMAGEN (REORDENAR)
    const moveImage = (fromIndex, toIndex) => {
        if (fromIndex === toIndex || toIndex < 0 || toIndex >= managedImages.length) return;
        setManagedImages(prev => {
            const result = [...prev];
            const [removed] = result.splice(fromIndex, 1);
            result.splice(toIndex, 0, removed);
            return result;
        });
    };

    const promoteToCover = (index) => {
        if (index === 0) return;
        moveImage(index, 0);
    };

    // --- SVGs ---

    const handleSvgChange = (e) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setNewSvgFiles(prev => [...prev, ...filesArray]);
            const previewsArray = filesArray.map(file => URL.createObjectURL(file));
            setNewSvgPreviews(prev => [...prev, ...previewsArray]);
        }
    };

    const removeNewSvg = (index) => {
        setNewSvgFiles(prev => prev.filter((_, i) => i !== index));
        setNewSvgPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const removeExistingSvg = (index) => {
        if (window.confirm("¿Eliminar este diseño de la biblioteca?")) {
            setExistingSvgs(prev => prev.filter((_, i) => i !== index));
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

    const addInitialsColor = (e) => {
        e.preventDefault();
        const name = newInitialsColorName.trim();
        if (name && !initialsColors.some(c => c.name === name)) {
            setInitialsColors([...initialsColors, { name, hex: newInitialsColorHex }]);
            setNewInitialsColorName('');
            setNewInitialsColorHex('#000000');
        }
    };

    const removeInitialsColor = (index) => {
        setInitialsColors(initialsColors.filter((_, i) => i !== index));
    };

    // --- SUBMIT ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (managedImages.length === 0) {
                throw new Error("El producto debe tener al menos una imagen");
            }

            // A. Procesar imágenes (Respetar el orden de managedImages)
            const finalImages = [];
            for (const item of managedImages) {
                if (!item.isNew) {
                    finalImages.push(item.url);
                } else {
                    const file = item.file;
                    const fileExt = file.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage
                        .from('products')
                        .upload(fileName, file);

                    if (uploadError) throw uploadError;

                    const { data: urlData } = supabase.storage
                        .from('products')
                        .getPublicUrl(fileName);

                    finalImages.push(urlData.publicUrl);
                }
            }

            // B. Múltiples SVGs
            const uploadedSvgUrls = [];
            for (const file of newSvgFiles) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-svg-${Math.random().toString(36).substring(2)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('products')
                    .upload(fileName, file);

                if (uploadError) throw uploadError;

                const { data: urlData } = supabase.storage
                    .from('products')
                    .getPublicUrl(fileName);

                uploadedSvgUrls.push(urlData.publicUrl);
            }

            const finalSvgs = [...existingSvgs, ...uploadedSvgUrls];

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
                        initialsColors,
                        allowInitials: form.allowInitials,
                        allowSvg: form.allowSvg,
                        svgLibrary: finalSvgs,
                        initialsConfig,
                        svgConfig
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
                    <div className="flex justify-between items-center">
                        <label className="block text-sm font-medium text-gray-700">Galería de Imágenes</label>
                        {managedImages.length > 0 && (
                            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Arrastrá para reordenar</span>
                        )}
                    </div>
                    
                    {/* Grilla Reordenable con Controles de Botón */}
                    <div className="mt-4 bg-gray-50/50 p-4 rounded-2xl border border-gray-100 relative shadow-inner">
                        <motion.div 
                            layout
                            className="grid grid-cols-3 sm:grid-cols-4 gap-4"
                        >
                            {managedImages.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                    className={`relative aspect-square rounded-xl overflow-hidden border shadow-sm group ${item.isNew ? 'border-blue-200 bg-blue-50/10' : 'border-gray-200 bg-white'}`}
                                >
                                    <img src={item.url} alt="Producto" className="w-full h-full object-cover" />
                                    
                                    {/* Overlay de Control */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2">
                                        <div className="flex justify-between items-start">
                                            <div className="bg-white/90 px-1.5 py-0.5 rounded text-[9px] font-bold text-black uppercase">
                                                {index === 0 ? 'Portada' : `#${index + 1}`}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(item.id, item.isNew)}
                                                className="bg-white/90 p-1 rounded-full text-red-500 hover:bg-red-500 hover:text-white transition-colors"
                                            >
                                                {item.isNew ? <X size={14} /> : <Trash2 size={14} />}
                                            </button>
                                        </div>

                                        <div className="flex justify-center gap-1.5">
                                            {index > 0 && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => moveImage(index, index - 1)}
                                                        className="bg-white/90 p-1.5 rounded-full text-brand-dark hover:bg-brand-primary hover:text-white transition-colors"
                                                        title="Mover Atrás"
                                                    >
                                                        <ArrowLeft size={16} />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => promoteToCover(index)}
                                                        className="bg-white/90 p-1.5 rounded-full text-yellow-600 hover:bg-yellow-500 hover:text-white transition-colors"
                                                        title="Hacer Portada"
                                                    >
                                                        <Star size={16} fill="currentColor" />
                                                    </button>
                                                </>
                                            )}
                                            {index < managedImages.length - 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => moveImage(index, index + 1)}
                                                    className="bg-white/90 p-1.5 rounded-full text-brand-dark hover:bg-brand-primary hover:text-white transition-colors"
                                                    title="Mover Adelante"
                                                >
                                                    <ArrowRight size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    {/* Badge siempre visible si es Portada */}
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 bg-black text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full border border-white/20 uppercase tracking-tighter group-hover:opacity-0 transition-opacity">
                                            Portada
                                        </div>
                                    )}
                                    {item.isNew && (
                                        <div className="absolute bottom-2 right-2 bg-blue-500 text-white text-[7px] px-1 py-0.5 rounded uppercase tracking-tighter group-hover:opacity-0 transition-opacity">
                                            Nuevo
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
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

                    {/* Colores de Hilos para Iniciales (Solo si allowInitials es true) */}
                    {form.allowInitials && (
                        <div className="mt-4 bg-brand-secondary/5 p-4 rounded-lg border border-brand-secondary/20 animate-fade-in">
                            <label className="block text-sm font-bold text-brand-dark mb-2">Colores de Hilos para Iniciales</label>
                            <p className="text-xs text-gray-500 mb-4 font-light">Define qué colores de hilo estarán disponibles específicamente para el bordado de personalización.</p>

                            <div className="flex gap-2 mb-3 items-center">
                                <input
                                    type="color"
                                    value={newInitialsColorHex}
                                    onChange={(e) => setNewInitialsColorHex(e.target.value)}
                                    className="h-10 w-10 p-1 rounded border border-gray-300 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={newInitialsColorName}
                                    onChange={(e) => setNewInitialsColorName(e.target.value)}
                                    placeholder="Ej: Dorado, Blanco..."
                                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
                                />
                                <button onClick={addInitialsColor} type="button" className="bg-black text-white hover:bg-gray-800 px-3 py-2 rounded text-sm font-medium">+</button>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {initialsColors.map((color, idx) => (
                                    <span key={idx} className="inline-flex items-center px-2 py-1 rounded bg-white border border-gray-200 text-sm gap-2">
                                        <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm" style={{ backgroundColor: color.hex || '#ccc' }}></div>
                                        {color.name}
                                        <button type="button" onClick={() => removeInitialsColor(idx)} className="ml-1 text-red-500 hover:text-red-700">×</button>
                                    </span>
                                ))}
                            </div>
                            {initialsColors.length === 0 && (
                                <p className="text-[10px] text-orange-600 mt-2">No has agregado colores específicos. Se usarán los predeterminados.</p>
                            )}
                        </div>
                    )}

                    {/* PERSONALIZACIÓN CON SVG */}
                    <div className="mt-8 p-4 bg-gray-50 border border-gray-100 rounded-xl">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                name="allowSvg"
                                checked={form.allowSvg}
                                onChange={handleChange}
                                className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black transition-all"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-900">Permitir Personalización con Dibujos (SVG)</span>
                                <span className="text-xs text-gray-500">Permite al cliente elegir un diseño de tu biblioteca.</span>
                            </div>
                        </label>
                    </div>

                    {form.allowSvg && (
                        <div className="mt-4 bg-brand-secondary/5 p-4 rounded-lg border border-brand-secondary/20 animate-fade-in">
                            <label className="block text-sm font-bold text-brand-dark mb-4">Biblioteca de Diseños (SVG)</label>

                            {/* Lista de SVGs Existentes + Nuevos */}
                            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-4">
                                {existingSvgs.map((url, idx) => (
                                    <div key={`svg-exist-${idx}`} className="relative aspect-square rounded-lg border border-green-200 bg-white p-2 group">
                                        <img src={url} alt="SVG" className="w-full h-full object-contain" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingSvg(idx)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                                {newSvgPreviews.map((url, idx) => (
                                    <div key={`svg-new-${idx}`} className="relative aspect-square rounded-lg border border-blue-200 bg-white p-2 group">
                                        <img src={url} alt="New SVG" className="w-full h-full object-contain opacity-70" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewSvg(idx)}
                                            className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-6 hover:bg-gray-50 transition-colors cursor-pointer text-center mb-4">
                                <input
                                    type="file"
                                    accept=".svg"
                                    multiple
                                    onChange={handleSvgChange}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                />
                                <Upload size={24} className="mx-auto mb-2 text-gray-400" />
                                <p className="text-xs text-gray-500">Agregar archivos .svg a la biblioteca</p>
                            </div>
                        </div>
                    )}

                    {/* CONFIGURADOR VISUAL (Solo si hay al menos 2 imágenes y alguna personalización activa) */}
                    {(form.allowInitials || form.allowSvg) && managedImages.length >= 2 && (
                        <div className="mt-12 border-t pt-8">
                            <h3 className="text-xl font-heading text-brand-dark mb-2">Posicionamiento Maestro</h3>
                            <p className="text-sm text-gray-500 mb-6">Arrastrá los elementos sobre la <b>segunda imagen</b> para definir dónde aparecerán por defecto.</p>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                                {/* Canvas de Posicionamiento */}
                                <div ref={containerRef} className="relative aspect-square rounded-2xl overflow-hidden border shadow-inner bg-gray-100" style={{ containerType: 'inline-size' }}>
                                    <img
                                        src={managedImages.length >= 2 ? managedImages[1].url : managedImages[0]?.url}
                                        alt="Canvas"
                                        className="w-full h-full object-cover opacity-60 pointer-events-none"
                                    />

                                    {/* Marcador de Iniciales */}
                                    {form.allowInitials && (
                                        <motion.div
                                            drag
                                            dragMomentum={false}
                                            dragConstraints={containerRef}
                                            onDragEnd={(e, info) => {
                                                const containerRect = containerRef.current.getBoundingClientRect();
                                                const elementRect = e.target.getBoundingClientRect();
                                                const centerX = elementRect.left + elementRect.width / 2;
                                                const centerY = elementRect.top + elementRect.height / 2;
                                                const x = ((centerX - containerRect.left) / containerRect.width) * 100;
                                                const y = ((centerY - containerRect.top) / containerRect.height) * 100;
                                                setInitialsConfig(prev => ({
                                                    ...prev,
                                                    x: Math.max(0, Math.min(100, x)),
                                                    y: Math.max(0, Math.min(100, y))
                                                }));
                                            }}
                                            animate={{
                                                left: `${initialsConfig.x}%`,
                                                top: `${initialsConfig.y}%`,
                                                x: '-50%',
                                                y: '-50%'
                                            }}
                                            transition={{ type: 'just' }}
                                            style={{
                                                position: 'absolute',
                                                cursor: 'grab',
                                                fontSize: `calc(${7 * initialsConfig.scale}cqw)`,
                                                fontWeight: 'bold',
                                                color: '#000',
                                                background: 'transparent',
                                                padding: '0',
                                                border: '1px dashed rgba(0,0,0,0.3)',
                                                zIndex: 20,
                                                lineHeight: 1,
                                                whiteSpace: 'nowrap',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}
                                            whileDrag={{ cursor: 'grabbing', scale: 1.1 }}
                                        >
                                            AB
                                        </motion.div>
                                    )}

                                    {/* Marcador de SVG */}
                                    {form.allowSvg && (
                                        <motion.div
                                            drag
                                            dragMomentum={false}
                                            dragConstraints={containerRef}
                                            onDragEnd={(e, info) => {
                                                const containerRect = containerRef.current.getBoundingClientRect();
                                                const elementRect = e.target.getBoundingClientRect();
                                                const centerX = elementRect.left + elementRect.width / 2;
                                                const centerY = elementRect.top + elementRect.height / 2;
                                                const x = ((centerX - containerRect.left) / containerRect.width) * 100;
                                                const y = ((centerY - containerRect.top) / containerRect.height) * 100;
                                                setSvgConfig(prev => ({
                                                    ...prev,
                                                    x: Math.max(0, Math.min(100, x)),
                                                    y: Math.max(0, Math.min(100, y))
                                                }));
                                            }}
                                            animate={{
                                                left: `${svgConfig.x}%`,
                                                top: `${svgConfig.y}%`,
                                                x: '-50%',
                                                y: '-50%'
                                            }}
                                            transition={{ type: 'just' }}
                                            style={{
                                                position: 'absolute',
                                                cursor: 'grab',
                                                width: `calc(${15 * svgConfig.scale}cqw)`, // 15% del ancho del contenedor REAL
                                                height: `calc(${15 * svgConfig.scale}cqw)`,
                                                border: '1px dashed rgba(59, 130, 246, 0.5)',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                zIndex: 30
                                            }}
                                            whileDrag={{ cursor: 'grabbing', scale: 1.1 }}
                                        >
                                            <Maximize2 size={16} className="text-blue-600" />
                                        </motion.div>
                                    )}
                                </div>

                                {/* Controles de Escala */}
                                <div className="space-y-6">
                                    {form.allowInitials && (
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-2 mb-3 text-brand-dark font-bold">
                                                <Move size={16} />
                                                <h4>Tamaño Iniciales</h4>
                                            </div>
                                            <input
                                                type="range" min="0.5" max="3" step="0.1"
                                                value={initialsConfig.scale}
                                                onChange={(e) => setInitialsConfig(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-black"
                                            />
                                            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                                                <span>Chico</span>
                                                <span>Grande</span>
                                            </div>
                                        </div>
                                    )}

                                    {form.allowSvg && (
                                        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                                            <div className="flex items-center gap-2 mb-3 text-brand-dark font-bold">
                                                <Maximize2 size={16} />
                                                <h4>Tamaño Dibujos (SVG)</h4>
                                            </div>
                                            <input
                                                type="range" min="0.5" max="3" step="0.1"
                                                value={svgConfig.scale}
                                                onChange={(e) => setSvgConfig(prev => ({ ...prev, scale: parseFloat(e.target.value) }))}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                            />
                                            <div className="flex justify-between text-[10px] text-gray-400 mt-2">
                                                <span>Chico</span>
                                                <span>Grande</span>
                                            </div>
                                        </div>
                                    )}

                                    <div className="p-4 bg-blue-50 text-blue-700 rounded-xl text-xs flex gap-3">
                                        <div className="font-bold">TIP:</div>
                                        <p>Fijá la posición y escala que verán tus clientes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
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
