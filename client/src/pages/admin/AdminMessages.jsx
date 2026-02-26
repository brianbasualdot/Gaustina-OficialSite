import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../utils/supabase';
import { Mail, ArrowLeft, Send, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const AdminMessages = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyForm, setReplyForm] = useState({
        text: '',
        template: 'GENERAL'
    });
    const [sending, setSending] = useState(false);
    const { showToast } = useToast();

    const fetchMessages = async () => {
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/messages`, {
                headers: { 'Authorization': `Bearer ${session?.access_token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
    }, []);

    const handleReplyChange = (e) => {
        setReplyForm({ ...replyForm, [e.target.name]: e.target.value });
    };

    const handleSendReply = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const res = await fetch(`${API_URL}/api/messages/${selectedMessage.id}/reply`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({
                    replyText: replyForm.text,
                    templateType: replyForm.template
                })
            });

            if (res.ok) {
                showToast("Respuesta enviada correctamente", "success");
                // Update local state
                const updatedMsg = await res.json();
                setMessages(messages.map(m => m.id === selectedMessage.id ? updatedMsg.data : m));
                setSelectedMessage(updatedMsg.data); // Update selected view
                setReplyForm({ text: '', template: 'GENERAL' }); // Reset form
            } else {
                showToast("Error al enviar la respuesta", "error");
            }
        } catch (error) {
            console.error("Error replying:", error);
            showToast("Error de conexión", "error");
        } finally {
            setSending(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Cargando mensajes...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link to="/admin/dashboard" className="text-gray-500 hover:text-black transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-3xl font-heading text-brand-dark">Mensajes de Contacto</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* List Column */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-[calc(100vh-200px)] flex flex-col">
                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                        <h2 className="font-medium text-gray-700">Bandeja de Entrada</h2>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {messages.length === 0 ? (
                            <p className="p-6 text-center text-gray-400">No hay mensajes.</p>
                        ) : (
                            <ul className="divide-y divide-gray-100">
                                {messages.map((msg) => (
                                    <li
                                        key={msg.id}
                                        onClick={() => {
                                            setSelectedMessage(msg);
                                            setReplyForm({ text: '', template: 'GENERAL' });
                                        }}
                                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 ${selectedMessage?.id === msg.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-sm font-bold ${msg.isRead ? 'text-gray-600' : 'text-black'}`}>
                                                {msg.name}
                                            </span>
                                            {msg.isRead ? (
                                                <CheckCircle size={14} className="text-green-500" />
                                            ) : (
                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2 truncate">{msg.email}</p>
                                        <p className="text-sm text-gray-600 line-clamp-2">{msg.message}</p>
                                        <span className="text-xs text-gray-300 mt-2 block">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Detail Column */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px] flex flex-col">
                    {selectedMessage ? (
                        <>
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-xl font-bold text-gray-800">{selectedMessage.name}</h2>
                                        <a href={`mailto:${selectedMessage.email}`} className="text-blue-500 hover:underline text-sm">
                                            {selectedMessage.email}
                                        </a>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Recibido: {new Date(selectedMessage.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedMessage.isRead && (
                                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                                <CheckCircle size={12} /> Respondido
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 flex-1 overflow-y-auto bg-gray-50/50">
                                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
                                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.message}</p>
                                </div>

                                {selectedMessage.reply && (
                                    <div className="ml-8 mb-6">
                                        <p className="text-xs text-gray-400 mb-1 ml-1 flex items-center gap-1">
                                            <Clock size={12} /> Tu respuesta ({new Date(selectedMessage.repliedAt).toLocaleString()})
                                        </p>
                                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-gray-700 whitespace-pre-wrap">
                                            {selectedMessage.reply}
                                            {selectedMessage.replyTemplate && (
                                                <div className="mt-2 text-xs text-blue-400 font-medium">
                                                    Template usado: {selectedMessage.replyTemplate}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Reply Form */}
                            <div className="p-6 border-t border-gray-100 bg-white">
                                <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                                    <Mail size={16} /> Responder al cliente
                                </h3>
                                <form onSubmit={handleSendReply}>
                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Plantilla de Respuesta</label>
                                        <select
                                            name="template"
                                            value={replyForm.template}
                                            onChange={handleReplyChange}
                                            className="w-full border border-gray-300 rounded p-2 text-sm bg-gray-50 focus:ring-2 focus:ring-black focus:outline-none"
                                        >
                                            <option value="GENERAL">Consulta General (Estándar)</option>
                                            <option value="RETURNS">Política de Devoluciones</option>
                                            <option value="THANKS">Agradecimiento</option>
                                            <option value="CONFIRMATION">Confirmación</option>
                                        </select>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-xs font-medium text-gray-500 mb-1">Tu Mensaje</label>
                                        <textarea
                                            name="text"
                                            value={replyForm.text}
                                            onChange={handleReplyChange}
                                            className="w-full border border-gray-300 rounded p-3 text-sm focus:ring-2 focus:ring-black focus:outline-none h-32"
                                            placeholder="Escribe tu respuesta aquí..."
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={sending}
                                            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {sending ? 'Enviando...' : <><Send size={16} /> Enviar Respuesta</>}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <Mail size={48} className="mb-4 opacity-20" />
                            <p>Selecciona un mensaje para leer</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminMessages;
