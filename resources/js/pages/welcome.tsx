import { Head, Link, router } from '@inertiajs/react';
import { ArrowDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import Lenis from 'lenis';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const MAJORS = [
    { id: '01', title: 'RPL', desc: 'Rekayasa Perangkat Lunak', img: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop' },
    { id: '02', title: 'DKV', desc: 'Desain Komunikasi Visual', img: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop' },
    { id: '03', title: 'TKJ', desc: 'Teknik Komputer Jaringan', img: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?q=80&w=1000&auto=format&fit=crop' },
    { id: '04', title: 'AKL', desc: 'Akuntansi Keuangan', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000&auto=format&fit=crop' },
    { id: '05', title: 'MPLB', desc: 'Manajemen Perkantoran', img: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=1000&auto=format&fit=crop' }
];

export default function Welcome() {
    const loaderRef = useRef<HTMLDivElement>(null);
    const logoRef = useRef<HTMLDivElement>(null);
    const heroTextRef = useRef<HTMLDivElement>(null);
    const galleryContainerRef = useRef<HTMLDivElement>(null);
    const galleryLeftRef = useRef<HTMLDivElement>(null);
    const galleryRightRef = useRef<HTMLDivElement>(null);
    const scrollLineRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const transitionOverlayRef = useRef<HTMLDivElement>(null);
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTimelineStep, setActiveTimelineStep] = useState(0);

    const handleLoginClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (transitionOverlayRef.current) {
            gsap.to(transitionOverlayRef.current, {
                opacity: 1,
                pointerEvents: 'auto',
                duration: 0.6,
                ease: 'power3.inOut',
                onComplete: () => {
                    router.visit('/login');
                }
            });
        } else {
            router.visit('/login');
        }
    };

    const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        window.scrollTo(0, 0);

        const lenis = new Lenis({
            autoRaf: false,
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        lenis.on('scroll', ScrollTrigger.update);

        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        gsap.ticker.lagSmoothing(0);

        lenis.stop();

        const tl = gsap.timeline({
            onComplete: () => {
                setIsLoading(false);
                lenis.start();
                ScrollTrigger.refresh();
            }
        });

        gsap.set(logoRef.current, { scale: 0, opacity: 0 });
        gsap.set(heroTextRef.current, { opacity: 0, y: 100 });
        
        tl.to(logoRef.current, { 
            scale: 1, 
            opacity: 1, 
            duration: 1.5, 
            ease: "elastic.out(1, 0.5)" 
        })
        .to(logoRef.current, {
            y: -40,
            duration: 1,
            ease: "power3.inOut",
            delay: 0.5
        })
        .to(loaderRef.current, {
            backgroundColor: "transparent",
            duration: 0.5
        }, "-=0.5")
        .to(heroTextRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: "power4.out"
        }, "-=0.5");

        const logo = logoRef.current;
        if (logo) {
            const handleMove = (e: MouseEvent | TouchEvent) => {
                let clientX = 0;
                let clientY = 0;
                
                if (window.TouchEvent && e instanceof TouchEvent) {
                    const touch = e.touches[0];
                    clientX = touch.clientX;
                    clientY = touch.clientY;
                } else if (e instanceof MouseEvent) {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }

                const rect = logo.getBoundingClientRect();
                const x = clientX - rect.left - rect.width / 2;
                const y = clientY - rect.top - rect.height / 2;
                
                const maxDist = 80;
                const dist = Math.sqrt(x*x + y*y);
                const pullX = (x / dist) * Math.min(dist, maxDist);
                const pullY = (y / dist) * Math.min(dist, maxDist);
                
                const rotateX = (y / (rect.height / 2)) * -25;
                const rotateY = (x / (rect.width / 2)) * 25;

                if (dist < 300) {
                    gsap.to(logo, { 
                        x: pullX, 
                        y: pullY - 40, 
                        rotationX: rotateX,
                        rotationY: rotateY,
                        transformPerspective: 800,
                        duration: 0.5, 
                        ease: 'power2.out', 
                        overwrite: 'auto' 
                    });
                } else {
                    gsap.to(logo, { 
                        x: 0, 
                        y: -40, 
                        rotationX: 0,
                        rotationY: 0,
                        duration: 1, 
                        ease: 'elastic.out(1, 0.3)', 
                        overwrite: 'auto' 
                    });
                }
            };
            
            const handleLeave = () => {
                gsap.to(logo, { 
                    x: 0, 
                    y: -40, 
                    rotationX: 0,
                    rotationY: 0,
                    duration: 1, 
                    ease: 'elastic.out(1, 0.3)', 
                    overwrite: 'auto' 
                });
            };

            window.addEventListener('mousemove', handleMove);
            window.addEventListener('touchmove', handleMove, { passive: true });
            window.addEventListener('mouseout', handleLeave);
            window.addEventListener('touchend', handleLeave);

            if (scrollLineRef.current) {
                gsap.fromTo(scrollLineRef.current, 
                    { y: -30, opacity: 0 },
                    { y: 60, opacity: 1, duration: 1.5, repeat: -1, ease: 'power2.inOut' }
                );
            }

            return () => {
                window.removeEventListener('mousemove', handleMove);
                window.removeEventListener('touchmove', handleMove);
                window.removeEventListener('mouseout', handleLeave);
                window.removeEventListener('touchend', handleLeave);
                window.removeEventListener('scroll', handleScroll);
            };
        }

        return () => {
            lenis.destroy();
        };
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const ctx = gsap.context(() => {
            const numMajors = MAJORS.length;
            
            const galleryTl = gsap.timeline({
                scrollTrigger: {
                    trigger: galleryContainerRef.current,
                    start: "top top",
                    end: `+=${numMajors * 100}%`,
                    pin: true,
                    scrub: 1,
                }
            });

            MAJORS.forEach((major, i) => {
                if (i !== 0) {
                    gsap.set(`.major-text-${i}`, { yPercent: 100, opacity: 0 });
                    gsap.set(`.major-img-${i}`, { clipPath: "inset(100% 0% 0% 0%)" });
                }
            });

            MAJORS.forEach((major, i) => {
                if (i === 0) return;

                galleryTl.to(`.major-text-${i-1}`, {
                    yPercent: -100,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.inOut"
                }, `step${i}`);

                galleryTl.fromTo(`.major-text-${i}`, {
                    yPercent: 100,
                    opacity: 0
                }, {
                    yPercent: 0,
                    opacity: 1,
                    duration: 1,
                    ease: "power2.inOut"
                }, `step${i}`);

                galleryTl.fromTo(`.major-img-${i}`, {
                    clipPath: "inset(100% 0% 0% 0%)",
                }, {
                    clipPath: "inset(0% 0% 0% 0%)",
                    duration: 1,
                    ease: "power3.inOut"
                }, `step${i}`);
            });

            // Security Timeline Animation
            // Removed GSAP width animation so the line is always visible,
            // relying on CSS flowing animation instead for the glowing effect.

        }, galleryContainerRef);

        return () => ctx.revert();
    }, [isLoading]);

    return (
        <>
            <Head>
                <title>SMKN 40 Jakarta - Attendance System</title>
                <meta name="description" content="Sistem presensi kehadiran siswa SMKN 40 Jakarta yang modern, aman, dan terpercaya." />
            </Head>

            <style>{`
                @keyframes flow {
                    0% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes flow-y {
                    0% { background-position: 50% 100%; }
                    100% { background-position: 50% 0%; }
                }
                .animate-flow-x { 
                    background-size: 200% auto;
                    animation: flow 1.5s linear infinite; 
                }
                .animate-flow-y { 
                    background-size: auto 200%;
                    animation: flow-y 1.5s linear infinite; 
                }
            `}</style>
            
            <div 
                ref={loaderRef} 
                className={`fixed inset-0 z-40 bg-brand-navy pointer-events-none ${isLoading ? 'opacity-100' : ''}`}
            ></div>

            {/* Transition Overlay for Page Changes */}
            <div 
                ref={transitionOverlayRef} 
                className="fixed inset-0 z-[999] bg-[#0f172a] opacity-0 pointer-events-none"
            ></div>

            {/* Mobile Menu Overlay */}
            <div 
                className={`fixed inset-0 z-[90] bg-[#0A0A0A]/95 backdrop-blur-2xl transition-all duration-500 flex flex-col items-center justify-center gap-6 ${isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
            >
                <a href="#hero" onClick={(e) => { handleScrollTo(e, 'hero'); setIsMobileMenuOpen(false); }} className="text-white text-2xl md:text-3xl font-black uppercase tracking-widest hover:text-brand-red transition-colors">Home</a>
                <a href="#majors" onClick={(e) => { handleScrollTo(e, 'majors'); setIsMobileMenuOpen(false); }} className="text-white text-2xl md:text-3xl font-black uppercase tracking-widest hover:text-brand-red transition-colors">Majors</a>
                <a href="#security" onClick={(e) => { handleScrollTo(e, 'security'); setIsMobileMenuOpen(false); }} className="text-white text-2xl md:text-3xl font-black uppercase tracking-widest hover:text-brand-red transition-colors">Security</a>
            </div>

            {/* Split Pill Navbar (Background Appears on Scroll) */}
            <nav className="fixed top-4 md:top-6 w-full px-4 md:px-10 flex justify-between items-start z-[100] pointer-events-none">
                
                {/* Left Pill: Brand */}
                <div className={`pointer-events-auto flex items-center justify-center px-4 md:px-6 py-2.5 md:py-3.5 rounded-full transition-all duration-500 ${isScrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
                    <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="text-white font-black tracking-[0.2em] uppercase text-[10px] sm:text-xs md:text-sm drop-shadow-md hover:text-brand-red transition-colors">SMKN 40</a>
                </div>
                
                {/* Right Pill: Menu & Actions */}
                <div className={`pointer-events-auto flex items-center gap-1 md:gap-2 p-1 md:p-1.5 rounded-full transition-all duration-500 ${isScrolled ? 'bg-[#0A0A0A]/80 backdrop-blur-xl border border-white/10 shadow-2xl' : 'bg-transparent border-transparent'}`}>
                    <div className={`hidden md:flex items-center gap-1 px-3 border-r pr-4 transition-colors duration-500 ${isScrolled ? 'border-white/10' : 'border-transparent'}`}>
                        <a href="#hero" onClick={(e) => handleScrollTo(e, 'hero')} className="text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Home</a>
                        <a href="#majors" onClick={(e) => handleScrollTo(e, 'majors')} className="text-white/80 hover:text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Majors</a>
                        <a href="#security" onClick={(e) => handleScrollTo(e, 'security')} className="text-white/80 hover:text-white text-xs font-medium px-4 py-2 rounded-full hover:bg-white/10 transition-colors">Security</a>
                    </div>

                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden text-white hover:text-brand-red transition-colors font-bold text-[10px] sm:text-xs tracking-[0.2em] uppercase px-3"
                    >
                        {isMobileMenuOpen ? 'Close' : 'Menu'}
                    </button>
                    
                    <a 
                        href="/login" 
                        onClick={handleLoginClick}
                        className={`flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold px-4 md:px-6 py-2 md:py-2.5 rounded-full transition-all duration-300 shadow-md ${isScrolled ? 'bg-white text-black hover:bg-brand-red hover:text-white' : 'bg-brand-red text-white hover:bg-white hover:text-brand-red'}`}
                    >
                        Login
                    </a>
                </div>
            </nav>

            <main className="bg-brand-navy min-h-screen text-white font-sans selection:bg-brand-red selection:text-white w-full">
                <section id="hero" className="relative h-[100dvh] w-full flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-brand-navy">
                        <img 
                            src="/images/bg.jpg" 
                            alt="School Background" 
                            className="w-full h-full object-cover opacity-50"
                            fetchPriority="high"
                            decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/30 via-transparent to-brand-navy"></div>
                    </div>

                    <div className="relative z-50 flex flex-col items-center w-full px-4" style={{ perspective: '1000px' }}>
                        <div 
                            ref={logoRef}
                            className="w-20 h-20 sm:w-32 sm:h-32 md:w-48 md:h-48 lg:w-56 lg:h-56 mb-4 md:mb-8 flex items-center justify-center cursor-pointer rounded-full overflow-hidden bg-black shadow-[0_0_40px_rgba(0,0,0,0.6)]"
                        >
                            <img 
                                src="/images/logo.jpg" 
                                alt="SMKN 40 Logo" 
                                className="w-full h-full object-cover scale-[1.2]" 
                                fetchPriority="high"
                                decoding="async"
                            />
                        </div>
                        
                        <div ref={heroTextRef} className="text-center px-4 flex flex-col items-center">
                            <h1 className="font-black text-4xl sm:text-6xl md:text-8xl lg:text-[8rem] tracking-tighter leading-[0.85] uppercase drop-shadow-2xl">
                                SMKN 40 <br/> Jakarta
                            </h1>
                            <div className="mt-2 md:mt-6 overflow-hidden flex flex-col items-center gap-1.5 md:gap-3">
                                <p className="text-brand-orange text-xs sm:text-base md:text-2xl font-bold tracking-[0.1em] md:tracking-[0.4em] uppercase drop-shadow-md">
                                    Attendance System
                                </p>
                                <p className="text-white/40 text-[9px] sm:text-[10px] md:text-sm font-medium tracking-[0.1em] md:tracking-[0.3em] uppercase">
                                    Created by <span className="text-white/80 font-bold">Steven Christian</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Animated Scroll Indicator */}
                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-50">
                        <span className="text-xs tracking-[0.4em] uppercase font-bold text-white/80 drop-shadow-md">Scroll</span>
                        <div className="w-[2px] h-20 bg-white/20 relative overflow-hidden rounded-full">
                            <div ref={scrollLineRef} className="w-full h-10 bg-brand-red absolute top-0 left-0 rounded-full"></div>
                        </div>
                    </div>

                    {/* Smooth fade into next section */}
                    <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-b from-transparent to-brand-navy z-10 pointer-events-none"></div>
                </section>

                {/* 2. Transition Section (School Reveal) */}
                <section className="relative h-[60dvh] md:min-h-[100dvh] flex items-center justify-center px-4 md:px-6 py-12 md:py-32 overflow-hidden bg-brand-navy">
                    {/* Parallax Background */}
                    <div className="absolute inset-0 z-0">
                        <div 
                            className="w-full h-full bg-cover bg-center bg-fixed opacity-50"
                            style={{ backgroundImage: "url('/images/bg.jpg')" }}
                        ></div>
                        {/* Multi-stop gradient: navy at top, slowly transitioning to off-white at the very bottom */}
                        <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/95 via-brand-navy/70 via-[60%] to-[#F0F0F0]"></div>
                    </div>

                    <div className="relative z-10 text-center px-2">
                        <h2 className="text-4xl sm:text-5xl md:text-7xl lg:text-[8rem] font-black max-w-6xl text-center leading-[0.9] tracking-tighter uppercase text-white drop-shadow-2xl">
                            Present is <span className="text-brand-red">more</span> <br className="hidden sm:block" /> than being here.
                        </h2>
                    </div>
                </section>
                
                {/* 3. Major Gallery (Obys Peter Lindbergh Style) */}
                <section id="majors" ref={galleryContainerRef} className="h-[100dvh] w-full flex flex-col md:flex-row bg-[#F0F0F0] text-brand-navy relative">
                    
                    {/* Left: Text Content */}
                    <div ref={galleryLeftRef} className="w-full md:w-1/2 h-1/2 md:h-full relative flex items-center justify-center px-6 md:px-20 z-20 order-2 md:order-1 overflow-hidden">
                        {MAJORS.map((major, i) => (
                            <div 
                                key={major.id} 
                                className={`absolute top-0 left-0 w-full h-full px-6 md:px-20 flex flex-col justify-center major-text-${i} ${i === 0 ? 'opacity-100' : 'opacity-0'}`}
                            >
                                <span className="text-brand-red text-sm md:text-2xl font-bold tracking-[0.2em] md:tracking-[0.3em] mb-2 md:mb-4">
                                    {major.id} / {MAJORS.length.toString().padStart(2, '0')}
                                </span>
                                <h2 className="text-5xl sm:text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-none mb-3 md:mb-6 text-brand-navy drop-shadow-sm">
                                    {major.title}
                                </h2>
                                <p className="text-sm md:text-3xl text-brand-navy/60 font-medium tracking-[0.1em] md:tracking-[0.2em] uppercase max-w-xs md:max-w-full">
                                    {major.desc}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Right: Images Stacking Up */}
                    <div ref={galleryRightRef} className="w-full md:w-1/2 h-1/2 md:h-full relative overflow-hidden z-10 bg-[#E5E5E5] order-1 md:order-2">
                        {MAJORS.map((major, i) => (
                            <div 
                                key={major.id} 
                                className={`absolute inset-0 major-img-${i}`}
                                style={{ zIndex: i }}
                            >
                                {/* Subtle warm overlay for editorial look */}
                                <div className="absolute inset-0 bg-[#F0F0F0]/10 mix-blend-multiply z-10"></div>
                                <img 
                                    src={major.img} 
                                    alt={major.title} 
                                    className="w-full h-full object-cover saturate-[0.8] contrast-[1.1]"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Security Storytelling */}
                <section id="security" className="-mt-[1px] min-h-screen bg-brand-navy flex flex-col items-center justify-center relative overflow-hidden py-12 md:py-32">
                    {/* Tall gradient: smoothly dissolves the light section into dark navy */}
                    <div className="absolute top-0 left-0 w-full h-20 md:h-96 bg-gradient-to-b from-[#F0F0F0] via-[#F0F0F0]/30 to-transparent z-0 pointer-events-none"></div>

                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-brand-orange/10 via-brand-navy to-brand-navy z-0"></div>
                    
                    <div className="relative z-20 container mx-auto px-4 md:px-6 flex flex-col items-center pt-8 md:pt-24 text-center">
                        <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-[7rem] font-black uppercase tracking-tighter mb-4 md:mb-12 leading-[0.9] text-white drop-shadow-xl px-2">
                            Security built into <br className="hidden sm:block" /> <span className="text-brand-red">every check.</span>
                        </h2>
                        
                        <div ref={timelineRef} className="relative w-full max-w-6xl mt-8 md:mt-24 px-4 md:px-0 group/timeline" onMouseLeave={() => setActiveTimelineStep(0)}>
                            <style>{`
                                .timeline-dynamic-fill {
                                    width: 2px;
                                    height: ${activeTimelineStep === 1 ? '15%' : activeTimelineStep === 2 ? '50%' : activeTimelineStep === 3 ? '85%' : '0%'};
                                }
                                @media (min-width: 768px) {
                                    .timeline-dynamic-fill {
                                        height: 2px;
                                        width: ${activeTimelineStep === 1 ? '15%' : activeTimelineStep === 2 ? '50%' : activeTimelineStep === 3 ? '85%' : '0%'};
                                    }
                                }
                            `}</style>
                            {/* Base Line */}
                            <div className="absolute left-[51px] md:left-0 top-0 md:top-[44px] w-[2px] h-full md:w-full md:h-[2px] bg-white/10 z-0 rounded-full"></div>
                            
                            {/* Animated Flowing Line (Dynamic Width) */}
                            <div className="timeline-dynamic-fill absolute left-[51px] md:left-0 top-0 md:top-[44px] z-10 rounded-full shadow-[0_0_15px_rgba(255,0,0,0.8)] overflow-hidden transition-all duration-700 ease-out">
                                <div className="hidden md:block w-full h-full bg-[linear-gradient(90deg,#E5252A,#ff8f92,#E5252A)] animate-flow-x opacity-100 transition-opacity"></div>
                                <div className="block md:hidden w-full h-full bg-[linear-gradient(180deg,#E5252A,#ff8f92,#E5252A)] animate-flow-y opacity-100 transition-opacity"></div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between relative z-20 gap-8 md:gap-8">
                                {/* Step 1 */}
                                <div 
                                    className={`timeline-step flex md:flex-col items-start md:items-center gap-6 w-full md:w-1/3 text-left md:text-center p-6 rounded-2xl border border-transparent transition-all duration-500 ease-out cursor-pointer ${activeTimelineStep >= 1 ? 'bg-white/5 border-white/10 -translate-y-4' : ''}`}
                                    onMouseEnter={() => setActiveTimelineStep(1)}
                                >
                                    <div className={`w-8 h-8 rounded-full border-4 flex-shrink-0 z-20 transition-all duration-500 ${activeTimelineStep >= 1 ? 'border-brand-navy bg-brand-red scale-125 shadow-[0_0_20px_rgba(229,37,42,1)]' : 'border-brand-navy bg-white/30'}`}></div>
                                    <div className="pt-0 md:pt-4">
                                        <h3 className={`font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 transition-colors ${activeTimelineStep >= 1 ? 'text-brand-red' : 'text-brand-orange'}`}>01. Device</h3>
                                        <p className="text-base sm:text-xl lg:text-3xl font-light text-white leading-snug">Trusted binding mechanism prevents spoofing.</p>
                                    </div>
                                </div>
                                
                                {/* Step 2 */}
                                <div 
                                    className={`timeline-step flex md:flex-col items-start md:items-center gap-6 w-full md:w-1/3 text-left md:text-center p-6 rounded-2xl border border-transparent transition-all duration-500 ease-out cursor-pointer ${activeTimelineStep >= 2 ? 'bg-white/5 border-white/10 -translate-y-4' : ''}`}
                                    onMouseEnter={() => setActiveTimelineStep(2)}
                                >
                                    <div className={`w-8 h-8 rounded-full border-4 flex-shrink-0 z-20 transition-all duration-500 ${activeTimelineStep >= 2 ? 'border-brand-navy bg-brand-red scale-125 shadow-[0_0_20px_rgba(229,37,42,1)]' : 'border-brand-navy bg-white/30'}`}></div>
                                    <div className="pt-0 md:pt-4">
                                        <h3 className={`font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 transition-colors ${activeTimelineStep >= 2 ? 'text-brand-red' : 'text-brand-orange'}`}>02. Location</h3>
                                        <p className="text-base sm:text-xl lg:text-3xl font-light text-white leading-snug">Geofence validation ensures on-site presence.</p>
                                    </div>
                                </div>
                                
                                {/* Step 3 */}
                                <div 
                                    className={`timeline-step flex md:flex-col items-start md:items-center gap-6 w-full md:w-1/3 text-left md:text-center p-6 rounded-2xl border border-transparent transition-all duration-500 ease-out cursor-pointer ${activeTimelineStep >= 3 ? 'bg-white/5 border-white/10 -translate-y-4' : ''}`}
                                    onMouseEnter={() => setActiveTimelineStep(3)}
                                >
                                    <div className={`w-8 h-8 rounded-full border-4 flex-shrink-0 z-20 transition-all duration-500 ${activeTimelineStep >= 3 ? 'border-brand-navy bg-brand-red scale-125 shadow-[0_0_20px_rgba(229,37,42,1)]' : 'border-brand-navy bg-white/30'}`}></div>
                                    <div className="pt-0 md:pt-4">
                                        <h3 className={`font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-2 transition-colors ${activeTimelineStep >= 3 ? 'text-brand-red' : 'text-brand-orange'}`}>03. Session</h3>
                                        <p className="text-base sm:text-xl lg:text-3xl font-light text-white leading-snug">Dynamic QR with anti-replay protection.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
