import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ScanLine, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { attendance } from '@/routes/admin/scanner';

interface LogEntry {
    id: string;
    time: string;
    user: {
        id: number;
        name: string;
        nisn?: string;
        classroom?: { name: string; };
    };
    status: 'success' | 'already' | 'error';
    message: string;
    count?: number;
}

export default function QRScannerPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [lastScan, setLastScan] = useState<LogEntry | null>(null);
    
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const processingRef = useRef<boolean>(false);
    
    const audioSuccessRef = useRef<HTMLAudioElement>(null);
    const audioAlreadyRef = useRef<HTMLAudioElement>(null);

    const playAudio = (type: 'success' | 'already') => {
        try {
            const audioEl = type === 'success' ? audioSuccessRef.current : audioAlreadyRef.current;
            if (audioEl) {
                audioEl.currentTime = 0;
                audioEl.play().catch(e => console.error("Audio DOM play failed:", e));
            }
        } catch (error) {
            console.error("Audio trigger error:", error);
        }
    };

    // Live clock timer
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const [isFocused, setIsFocused] = useState(true);

    // Keep focus on the hidden input automatically
    useEffect(() => {
        const interval = setInterval(() => {
            if (document.activeElement !== inputRef.current) {
                inputRef.current?.focus();
                setIsFocused(true);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Auto-submit for physical scanners that don't send Enter key
    useEffect(() => {
        if (inputValue.length > 5) {
            const timeout = setTimeout(() => {
                const token = inputValue.trim();
                if (token.length > 5) {
                    processQRAttendance(token);
                }
                setInputValue('');
            }, 400); // Wait 400ms after last character is typed to accommodate slow/laggy physical scanners
            return () => clearTimeout(timeout);
        }
    }, [inputValue]);

    const handleInputSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const token = inputValue.trim();
        if (token.length > 5) {
            processQRAttendance(token);
        }
        setInputValue('');
    };

    const playAudio = (type: 'success' | 'already') => {
        const audio = type === 'success' ? audioSuccess : audioAlready;
        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(e => console.warn('Audio play failed:', e));
        }
    };

    const processQRAttendance = (qrToken: string) => {
        if (processingRef.current) return;
        processingRef.current = true;

        fetch(attendance.url(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
            },
            body: JSON.stringify({
                qr_token: qrToken,
                method: 'QR'
            })
        })
        .then(res => res.json())
        .then((data: any) => {
            if (data.message === 'Attendance recorded successfully' || data.message === 'Attendance already recorded for today') {
                const user = data.attendance?.user;
                if (user) {
                    const firstName = user.name.split(' ')[0];
                    const isAlready = data.message?.includes('already');
                    
                    // Mainkan suara presensi (File MP3 Statis dari User)
                    if (!isAlready) {
                        playAudio('success');
                    } else {
                        playAudio('already');
                    }
                    
                    setLogs(prev => {
                        const existing = prev.find(l => l.user.id === user.id);
                        if (existing) {
                            const updated = { ...existing, count: (existing.count || 1) + 1, status: 'already' as const, message: 'Sudah Absen' };
                            setLastScan(updated);
                            return prev.map(l => l.id === existing.id ? updated : l);
                        } else {
                            const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                            const newLog: LogEntry = {
                                id: Math.random().toString(36).substring(7),
                                time,
                                user,
                                status: isAlready ? 'already' : 'success',
                                message: isAlready ? 'Sudah Absen' : 'Berhasil Absen',
                                count: 1
                            };
                            setLastScan(newLog);
                            return [newLog, ...prev].slice(0, 10);
                        }
                    });
                }
            } else {
                 const errorLog: LogEntry = {
                     id: Math.random().toString(36).substring(7),
                     time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                     user: { id: 0, name: data.received_token ? `Invalid: ${data.received_token.substring(0, 10)}...` : 'QR Tidak Valid' },
                     status: 'error',
                     message: 'Gagal Dikenali'
                 };
                 setLastScan(errorLog);
                 setLogs(prev => [errorLog, ...prev].slice(0, 10));
            }
        }).catch(err => {
            console.error("QR Fetch Error:", err);
        }).finally(() => {
            processingRef.current = false;
        });
    };

    const unlockAudio = () => {
        inputRef.current?.focus();
        
        // Pancing Audio Context di browser dengan memutar lalu memberhentikan
        if (audioSuccessRef.current) {
            audioSuccessRef.current.play().then(() => audioSuccessRef.current?.pause()).catch(() => {});
        }
        if (audioAlreadyRef.current) {
            audioAlreadyRef.current.play().then(() => audioAlreadyRef.current?.pause()).catch(() => {});
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title="QR Scanner — SMKN 40" />
            
            {/* DOM Audio Elements for reliable playback */}
            <audio ref={audioSuccessRef} src="/audio/hadir.mp3" preload="auto" />
            <audio ref={audioAlreadyRef} src="/audio/sudahtercatat.mp3" preload="auto" />
            
            {/* Left Side: Status / Scanner */}
            <div className="flex-1 flex flex-col p-8 items-center justify-center relative" onClick={unlockAudio}>
                <Link href="/dashboard" className="absolute top-8 left-8 text-gray-500 hover:text-gray-900 font-medium">
                    &larr; Back to Dashboard
                </Link>
                <div className="text-center mb-12">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src="/images/logo.jpg" alt="Logo" className="w-12 h-12 rounded-full shadow-sm" />
                        <h1 className="text-2xl font-black text-[#111318]">SMKN 40 JAKARTA</h1>
                    </div>
                    <div className="text-5xl font-black text-[#D40000] tracking-tighter">
                        {currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-gray-500 font-medium mt-2">
                        {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                    <div className="text-xs font-medium text-gray-400 mt-1">
                        Created by Steven Christian
                    </div>
                </div>

                {/* HIDDEN INPUT FOR PHYSICAL SCANNER */}
                <form onSubmit={handleInputSubmit} className="mb-6 w-full max-w-lg">
                    <input 
                        ref={inputRef}
                        type="password" 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        className="opacity-0 absolute h-0 w-0"
                        autoFocus
                    />
                </form>

                {!lastScan ? (
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center max-w-lg w-full text-center">
                        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                            <ScanLine className="w-16 h-16 text-amber-600 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">SIAP MENERIMA SCAN QR</h2>
                        <p className="text-gray-500 font-medium mb-6">Langsung tembak Kartu Pelajar pakai alat scanner.</p>
                        
                        {isFocused ? (
                            <div className="inline-flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
                                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse relative"></span>
                                <span className="text-sm font-bold text-blue-700">Sistem Aktif & Menunggu Scan Kartu Pelajar...</span>
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-red-50 px-4 py-2 rounded-full border border-red-100 cursor-pointer" onClick={unlockAudio}>
                                <span className="w-2.5 h-2.5 rounded-full bg-red-500 relative"></span>
                                <span className="text-sm font-bold text-red-700">Sistem Terhenti (Klik di Sini)</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className={`bg-white rounded-3xl p-10 shadow-lg border-t-8 flex flex-col items-center max-w-lg w-full text-center animate-in zoom-in duration-300 ${lastScan.status === 'success' ? 'border-emerald-500' : lastScan.status === 'already' ? 'border-amber-500' : 'border-red-500'}`}>
                        {lastScan.status === 'success' && <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />}
                        {lastScan.status === 'already' && <Clock className="w-20 h-20 text-amber-500 mb-6" />}
                        {lastScan.status === 'error' && <XCircle className="w-20 h-20 text-red-500 mb-6" />}
                        
                        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase">{lastScan.user.name}</h2>
                        {lastScan.user.classroom && (
                            <p className="text-lg font-bold text-gray-500 mb-6">{lastScan.user.classroom.name}</p>
                        )}
                        
                        <div className={`inline-block px-6 py-2 rounded-full font-bold text-lg uppercase tracking-wider ${
                            lastScan.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                            lastScan.status === 'already' ? 'bg-amber-100 text-amber-700' : 
                            'bg-red-100 text-red-700'
                        }`}>
                            {lastScan.message}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Side: Log */}
            <div className="w-96 bg-white border-l border-gray-200 flex flex-col shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-[#111318] flex items-center gap-2">
                        <Clock size={18} />
                        Riwayat Scan (Hari Ini)
                    </h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {logs.length === 0 ? (
                        <div className="text-center text-gray-400 py-10 text-sm">Belum ada riwayat scan.</div>
                    ) : (
                        logs.map((log) => (
                            <div key={log.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition border border-gray-50">
                                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 text-sm font-bold text-gray-600">
                                    {log.user.name.charAt(0)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-bold text-[#111318] truncate text-sm">{log.user.name}</div>
                                    <div className="text-xs text-gray-500 flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span>{log.time}</span>
                                            {log.count && log.count > 1 && (
                                                <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] font-bold">
                                                    {log.count}x
                                                </span>
                                            )}
                                        </div>
                                        <span className={`font-semibold ${
                                            log.status === 'success' ? 'text-emerald-600' : 
                                            log.status === 'already' ? 'text-amber-600' : 
                                            'text-red-600'
                                        }`}>{log.message}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
