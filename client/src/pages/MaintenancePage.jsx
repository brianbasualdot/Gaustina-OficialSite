import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Instagram, MessageCircle, Pin, Music2 } from 'lucide-react';

const SparkleCanvas = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 3;
                this.speedY = (Math.random() - 0.5) * 3;
                this.color = `hsla(${Math.random() * 20 + 40}, 100%, 65%, ${Math.random() * 0.9 + 0.1})`; // Gold/Spark tones
                this.life = 1;
                this.decay = Math.random() * 0.03 + 0.02;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= this.decay;
                if (this.size > 0.05) this.size -= 0.015;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const handleMouseMove = (e) => {
            for (let i = 0; i < 4; i++) {
                particles.push(new Particle(e.clientX, e.clientY));
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        window.addEventListener('resize', resize);
        window.addEventListener('mousemove', handleMouseMove);
        // Also support touch for mobile
        const handleTouchMove = (e) => {
            if (e.touches && e.touches[0]) {
                for (let i = 0; i < 4; i++) {
                    particles.push(new Particle(e.touches[0].clientX, e.touches[0].clientY));
                }
            }
        };
        window.addEventListener('touchmove', handleTouchMove);

        resize();
        animate();

        return () => {
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
};

const MaintenancePage = () => {
    const socialLinks = [
        {
            name: 'Instagram',
            icon: Instagram,
            url: 'https://www.instagram.com/gaustina/',
            color: 'hover:text-pink-500'
        },
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            url: 'https://wa.me/5492215791290',
            color: 'hover:text-green-500'
        },
        {
            name: 'TikTok',
            icon: Music2,
            url: 'https://www.tiktok.com/@bgaustina',
            color: 'hover:text-cyan-400'
        },
        {
            name: 'Pinterest',
            icon: Pin,
            url: 'https://www.pinterest.com/bgaustina/',
            color: 'hover:text-red-600'
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#fdfdfd] relative overflow-hidden flex items-center justify-center font-heading">
            {/* ✨ Interactive Sparkle Effect (Mouse Follow) */}
            <SparkleCanvas />

            <div className="relative z-10 max-w-2xl w-full px-6 flex flex-col items-center text-center">
                {/* 🏷️ Logo Animation */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="mb-12"
                >
                    <img
                        src="https://tamyyvryopjvppkjauqa.supabase.co/storage/v1/object/public/products/logoinicio.png"
                        alt="Gaustina"
                        className="h-24 md:h-32 w-auto object-contain drop-shadow-sm pointer-events-none"
                    />
                </motion.div>

                {/* 📝 Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1.5 }}
                    className="space-y-6"
                >
                    <h1 className="text-4xl md:text-5xl font-heading text-brand-primary font-bold tracking-tight">
                        Estamos perfeccionando <br /> cada detalle para vos.
                    </h1>

                    <div className="w-16 h-1 bg-brand-accent/30 mx-auto rounded-full" />

                    <p className="text-gray-500 font-body text-lg md:text-xl max-w-md mx-auto leading-relaxed">
                        Nuestro taller está temporalmente cerrado por mantenimiento preventivo.
                    </p>
                    <p className="text-brand-primary font-script text-4xl md:text-5xl py-6 opacity-90 italic">
                        Pronto verás la magia..
                    </p>
                </motion.div>

                {/* 📱 Social Dock */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mt-16 bg-white/60 backdrop-blur-md border border-white/80 p-6 rounded-3xl shadow-xl flex gap-8 items-center"
                >
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`text-gray-400 ${social.color} transition-all duration-300 transform hover:scale-125`}
                            title={social.name}
                        >
                            <social.icon size={28} strokeWidth={1.5} />
                        </a>
                    ))}
                </motion.div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                body { overflow: hidden; }
                .font-heading { font-family: 'Montserrat', sans-serif; }
                .font-body { font-family: 'Inter', sans-serif; }
                .font-script { font-family: 'Cedarville Cursive', cursive; }
            `}} />
        </div>
    );
};

export default MaintenancePage;
