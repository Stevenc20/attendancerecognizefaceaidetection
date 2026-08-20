import React, { useState, useEffect, useRef } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ScanLine, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { attendance } from '@/actions/admin/scanner-controller';

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
}

export default function QRScannerPage() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [lastScan, setLastScan] = useState<LogEntry | null>(null);
    
    const qrBufferRef = useRef<string>('');
    const processingRef = useRef<boolean>(false);

    // Live clock timer
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // QR Code Scanner Event Listener
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

            if (e.key === 'Enter') {
                if (qrBufferRef.current.length > 5) {
                    processQRAttendance(qrBufferRef.current);
                }
                qrBufferRef.current = '';
            } else if (e.key.length === 1) {
                qrBufferRef.current += e.key;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

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
                    const utterance = new SpeechSynthesisUtterance(\ berhasil absen);
                    utterance.lang = 'id-ID';
                    window.speechSynthesis.speak(utterance);
                    
                    const time = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                    const newLog: LogEntry = {
                        id: Math.random().toString(36).substring(7),
                        time,
                        user,
                        status: data.message.includes('already') ? 'already' : 'success',
                        message: data.message.includes('already') ? 'Sudah Absen' : 'Berhasil Absen',
                    };
                    
                    setLastScan(newLog);
                    setLogs(prev => [newLog, ...prev].slice(0, 10));
                }
            } else {
                 const errorLog: LogEntry = {
                     id: Math.random().toString(36).substring(7),
                     time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                     user: { id: 0, name: 'QR Tidak Valid' },
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

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Head title="QR Scanner — SMKN 40" />
            
            {/* Left Side: Status / Scanner */}
            <div className="flex-1 flex flex-col p-8 items-center justify-center relative">
                <Link href="/admin/dashboard" className="absolute top-8 left-8 text-gray-500 hover:text-gray-900 font-medium">
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
                </div>

                {!lastScan ? (
                    <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100 flex flex-col items-center max-w-lg w-full text-center">
                        <div className="w-32 h-32 bg-amber-100 rounded-full flex items-center justify-center mb-6">
                            <ScanLine className="w-16 h-16 text-amber-600 animate-pulse" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Silakan Scan QR Code</h2>
                        <p className="text-gray-500">Tembakkan barcode scanner ke Kartu Pelajar Anda.</p>
                    </div>
                ) : (
                    <div className={\g-white rounded-3xl p-10 shadow-lg border-t-8 flex flex-col items-center max-w-lg w-full text-center animate-in zoom-in duration-300 \\}>
                        {lastScan.status === 'success' && <CheckCircle2 className="w-20 h-20 text-emerald-500 mb-6" />}
                        {lastScan.status === 'already' && <Clock className="w-20 h-20 text-amber-500 mb-6" />}
                        {lastScan.status === 'error' && <XCircle className="w-20 h-20 text-red-500 mb-6" />}
                        
                        <h2 className="text-3xl font-black text-gray-900 mb-2 uppercase">{lastScan.user.name}</h2>
                        {lastScan.user.classroom && (
                            <p className="text-lg font-bold text-gray-500 mb-6">{lastScan.user.classroom.name}</p>
                        )}
                        
                        <div className={\inline-block px-6 py-2 rounded-full font-bold text-lg uppercase tracking-wider \\}>
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
                                        <span>{log.time}</span>
                                        <span className={\ont-semibold \\}>{log.message}</span>
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
