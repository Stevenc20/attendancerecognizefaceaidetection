import { Link } from '@inertiajs/react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AuthCinematicLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(bgRef.current, 
                { scale: 1.1, opacity: 0 }, 
                { scale: 1, opacity: 1, duration: 2, ease: 'power2.out' }
            );
            gsap.fromTo('.cinematic-brand', 
                { opacity: 0, x: -30 }, 
                { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out', delay: 0.5 }
            );
            gsap.fromTo(formRef.current, 
                { opacity: 0, y: 30 }, 
                { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', delay: 0.8 }
            );
        }, containerRef);
        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="flex min-h-screen relative overflow-hidden selection:bg-brand-red selection:text-white bg-[#0f172a]">
            {/* Global Back Button (Top Left for All Screens) */}
            <div className="absolute top-6 left-6 md:top-8 md:left-12 z-50 cinematic-brand">
                <Link href={home()} className="flex items-center gap-2 text-white/70 hover:text-white transition-colors bg-black/20 hover:bg-black/40 px-4 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-lg">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm font-medium hidden sm:block">Back to Home</span>
                </Link>
            </div>
            {/* Background Image with Overlay */}
            <div ref={bgRef} className="absolute inset-0 z-0">
                <img 
                    src="/images/login-bg.jpg" 
                    alt="School Building" 
                    className="w-full h-full object-cover object-center"
                />
                {/* Elegant overlay: dark at the bottom and right side to ensure form visibility, but overall brighter than before */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-black/40 to-black/80"></div>
                <div className="absolute inset-0 bg-brand-navy/30 mix-blend-multiply"></div>
            </div>
            
            <div className="flex w-full z-10 min-h-screen">
                {/* Left Side - Branding (Hidden on mobile) */}
                <div className="hidden lg:flex w-1/2 flex-col justify-end p-16 xl:p-24 2xl:p-32 cinematic-brand pb-32">
                    <Link href={home()} className="mb-8 inline-block">
                        <div className="flex items-center gap-4 text-white hover:text-brand-red transition-colors">
                            <img src="/images/logo-smkn40.png" alt="Logo SMKN 40" className="w-12 h-12 2xl:w-16 2xl:h-16 object-contain drop-shadow-xl" />
                            <span className="font-bold tracking-widest text-2xl 2xl:text-3xl drop-shadow-md">SMKN 40</span>
                        </div>
                    </Link>
                    
                    <h1 className="text-4xl xl:text-6xl font-light tracking-tight text-white leading-tight mb-4 drop-shadow-xl">
                        Future of <br/> <span className="font-bold">Digital Attendance.</span>
                    </h1>
                    
                    <p className="text-white/80 text-lg font-light max-w-md drop-shadow-md mb-6">
                        Secure, seamless, and integrated campus ecosystem.
                    </p>
                    
                    <p className="text-white/40 text-sm font-medium tracking-wider uppercase border-l-2 border-brand-red pl-4">
                        Created by Steven Christian
                    </p>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-4 sm:p-12 relative min-h-screen">
                    <div className="w-full max-w-md 2xl:max-w-lg flex flex-col gap-6">
                        {/* Mobile Header (Logo Only) */}
                        <div className="flex items-center justify-center lg:hidden cinematic-brand w-full pb-2">
                            <Link href={home()} className="flex items-center gap-3 text-white hover:text-brand-red transition-colors">
                                <img src="/images/logo-smkn40.png" alt="Logo SMKN 40" className="w-10 h-10 object-contain drop-shadow-lg" />
                                <span className="font-bold tracking-widest text-xl drop-shadow-md">SMKN 40</span>
                            </Link>
                        </div>

                        <div 
                            ref={formRef}
                            className="w-full bg-white/10 backdrop-blur-xl border border-white/30 p-6 sm:p-12 2xl:p-16 rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden"
                        >
                            {/* Soft top highlight for 3D glass effect */}
                            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                            
                            <div className="mb-10 text-center">
                                <h2 className="text-3xl font-semibold text-white mb-2">{title}</h2>
                                {description && (
                                    <p className="text-white/70 text-sm font-light">
                                        {description}
                                    </p>
                                )}
                            </div>

                            {/* Form Content */}
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
