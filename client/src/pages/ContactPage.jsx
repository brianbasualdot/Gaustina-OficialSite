import React from 'react';

const ContactPage = () => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        message: ''
    });
    const [status, setStatus] = React.useState({ loading: false, error: null, success: false });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, error: null, success: false });

        try {
            // Usa la URL base de la API si está definida en variables de entorno, o asume relativa /api
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

            const response = await fetch(`${API_URL}/api/contact`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Error al enviar el mensaje');
            }

            setStatus({ loading: false, error: null, success: true });
            setFormData({ name: '', email: '', message: '' });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setStatus(prev => ({ ...prev, success: false }));
            }, 5000);

        } catch (error) {
            console.error("Error submitting contact form:", error);
            setStatus({ loading: false, error: error.message, success: false });
        }
    };

    return (
        <div className="bg-white min-h-screen py-16 md:py-24">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h1 className="text-5xl md:text-6xl font-script text-brand-primary mb-4 transform -rotate-2">
                            Hablemos
                        </h1>
                        <p className="text-lg text-gray-600 font-heading max-w-2xl mx-auto uppercase tracking-wide">
                            ¿Tienes una idea especial? Realizamos encargos personalizados.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Contact Form */}
                        <div className="md:col-span-2 bg-white p-8 border border-gray-100">
                            <form className="space-y-6" onSubmit={handleSubmit}>
                                <div>
                                    <label htmlFor="name" className="block text-sm font-heading text-gray-900 mb-1 uppercase tracking-wider">Nombre</label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-400 font-body"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-heading text-gray-900 mb-1 uppercase tracking-wider">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-400 font-body"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-heading text-gray-900 mb-1 uppercase tracking-wider">Mensaje</label>
                                    <textarea
                                        id="message"
                                        rows="4"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border-b border-gray-300 focus:border-black outline-none transition-colors bg-transparent placeholder-gray-400 font-body resize-none"
                                        placeholder="Cuéntanos qué estás buscando..."
                                    ></textarea>
                                </div>

                                {status.error && (
                                    <div className="p-4 bg-red-50 text-red-700 text-sm font-body">
                                        {status.error}
                                    </div>
                                )}

                                {status.success && (
                                    <div className="p-4 bg-green-50 text-green-700 text-sm font-body">
                                        ¡Mensaje enviado con éxito! Te contactaremos pronto.
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status.loading}
                                    className={`w-full bg-black text-white font-heading uppercase tracking-widest text-sm py-4 hover:bg-gray-800 transition-all ${status.loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {status.loading ? 'Enviando...' : 'Enviar Mensaje'}
                                </button>
                            </form>
                        </div>

                        {/* Sidebar Info */}
                        <div className="space-y-8">
                            <div className="bg-gray-50 p-6 border border-gray-100">
                                <h3 className="text-xl font-heading text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Taller
                                </h3>
                                <p className="text-gray-600 font-body mb-4">
                                    Calle 4<br />
                                    Casco Urbano<br />
                                    La Plata, Bs. As.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 border border-gray-100">
                                <h3 className="text-xl font-heading text-gray-900 mb-4 pb-2 border-b border-gray-200">
                                    Horario
                                </h3>
                                <ul className="space-y-2 text-gray-600 font-body">
                                    <li className="flex justify-between">
                                        <span>Lunes - Viernes</span>
                                        <span className="font-medium">9am - 5pm</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Sábados</span>
                                        <span className="font-medium">10am - 1pm</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
