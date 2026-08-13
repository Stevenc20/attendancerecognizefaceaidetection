import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BarChart3, Download, Printer } from 'lucide-react';
import React, { useState, useRef } from 'react';

export default function TeacherReports() {
    const { auth, homeroomClass, reportData } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'teacher';

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [hasSignature, setHasSignature] = useState(false);

    const startDrawing = (e: any) => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        ctx.beginPath();
        const rect = canvas.getBoundingClientRect();
        // Handle scaling between display size and actual size
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        
        ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
        setIsDrawing(true);
        setHasSignature(true);
    };

    const stopDrawing = () => {
        setIsDrawing(false);
        if (canvasRef.current) {
            canvasRef.current.getContext('2d')?.beginPath();
        }
    };

    const draw = (e: any) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const clientX = e.clientX || (e.touches && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0].clientY);
        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const clearSignature = () => {
        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            setHasSignature(false);
        }
    };

    const handleExport = () => {
        if (!reportData || reportData.length === 0) return;
        
        let csv = 'Student Name,NIS,Present,Late,Absent,Attendance Rate\n';
        reportData.forEach((row: any) => {
            const total = row.total_sessions || 1;
            const rate = Math.round(((row.present + row.late) / total) * 100);
            csv += `"${row.student.name}","${row.student.nis}",${row.present},${row.late},${row.absent},"${rate}%"\n`;
        });
        
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Report_${homeroomClass?.name}_${currentMonth.replace(' ', '_')}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Class Reports" />

            <style>{`
                @media print {
                    @page { size: landscape; margin: 15mm; }
                    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
                    aside { display: none !important; }
                    div[style*="margin-left"] { margin-left: 0 !important; }
                    header.print\\:hidden { display: none !important; }
                }
            `}</style>

            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 print:hidden">
                <div>
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                        Teacher
                    </p>
                    <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                        Class Reports
                    </h1>
                </div>
                {homeroomClass && (
                    <div className="flex gap-2">
                        <button onClick={handlePrint} className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-[#111318] px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                            <Printer size={16} />
                            Print Report
                        </button>
                        <button onClick={handleExport} className="inline-flex items-center gap-2 bg-[#111318] hover:bg-[#20242D] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                            <Download size={16} />
                            Export CSV
                        </button>
                    </div>
                )}
            </header>

            {homeroomClass ? (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-[12px] font-semibold text-[#D40000] uppercase tracking-wider block mb-1">Wali Kelas: {homeroomClass.name}</span>
                            <h2 className="text-xl font-bold text-[#111318]">Monthly Summary ({currentMonth})</h2>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                        Student Name
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-emerald-600 uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                        Present
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-amber-600 uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                        Late
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                        Absent
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-right">
                                        Attendance Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData && reportData.length > 0 ? (
                                    reportData.map((row: any, idx: number) => {
                                        const total = row.total_sessions || 1; // avoid division by zero
                                        const rate = Math.round(((row.present + row.late) / total) * 100);
                                        return (
                                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-5">
                                                    <div className="text-[14px] font-semibold text-[#111318]">{row.student.name}</div>
                                                    <div className="text-[12px] text-[#6B6F76]">{row.student.nis}</div>
                                                </td>
                                                <td className="py-4 px-5 text-center text-[14px] font-bold text-emerald-600 tabular-nums">
                                                    {row.present}
                                                </td>
                                                <td className="py-4 px-5 text-center text-[14px] font-bold text-amber-500 tabular-nums">
                                                    {row.late}
                                                </td>
                                                <td className="py-4 px-5 text-center text-[14px] font-bold text-red-500 tabular-nums">
                                                    {row.absent}
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold tabular-nums px-2.5 py-1 rounded-md ${
                                                        rate >= 80 ? 'text-emerald-700 bg-emerald-50' : 
                                                        rate >= 50 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
                                                    }`}>
                                                        {rate}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-[#6B6F76] text-sm">
                                            No attendance data recorded for this month yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* SIGNATURE BLOCK */}
                    <div className="p-8 pt-10 border-t border-gray-50 bg-white flex justify-end">
                        <div className="text-center w-64 relative group">
                            <p className="text-sm text-[#111318] mb-6">
                                Jakarta, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                <br />
                                Wali Kelas
                            </p>

                            {/* INLINE SIGNATURE CANVAS */}
                            <div className="h-32 w-full mb-4 relative touch-none group">
                                <canvas
                                    ref={canvasRef}
                                    width={256}
                                    height={128}
                                    className="cursor-crosshair w-full h-full border-b border-dashed border-gray-300 print:border-none relative z-10"
                                    onMouseDown={startDrawing}
                                    onMouseUp={stopDrawing}
                                    onMouseOut={stopDrawing}
                                    onMouseMove={draw}
                                    onTouchStart={startDrawing}
                                    onTouchEnd={stopDrawing}
                                    onTouchMove={draw}
                                />
                                {!hasSignature && (
                                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center print:hidden opacity-40 z-0">
                                        <span className="text-[#6B6F76] text-xs font-semibold uppercase tracking-wider mb-1">Draw Here</span>
                                        <span className="text-gray-300">✍️</span>
                                    </div>
                                )}
                                {hasSignature && (
                                    <button 
                                        onClick={clearSignature} 
                                        className="absolute -right-2 -top-2 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-600 rounded-full p-1.5 text-[10px] opacity-0 group-hover:opacity-100 transition-all print:hidden z-20"
                                        title="Clear Signature"
                                    >
                                        ❌
                                    </button>
                                )}
                            </div>

                            <p className="font-bold text-[#111318] border-b border-[#111318] pb-1 mb-1">{user.name}</p>
                            <p className="text-xs text-[#6B6F76]">NIP. {user.nis || '-'}</p>
                        </div>
                    </div>
                </section>
            ) : (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-8 text-center flex flex-col items-center justify-center">
                    <BarChart3 className="text-gray-300 mb-3" size={48} />
                    <h2 className="text-lg font-bold text-[#111318] mb-1">No Homeroom Class Assigned</h2>
                    <p className="text-sm text-[#6B6F76] max-w-md">You are not currently assigned as a Wali Kelas (Homeroom Teacher) for any classroom.</p>
                </section>
            )}
        </DashboardLayout>
    );
}
