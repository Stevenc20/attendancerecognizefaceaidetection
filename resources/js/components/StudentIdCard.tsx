import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface Student {
    id: number;
    name: string;
    nis?: string;
    nisn?: string;
    classroom?: {
        name: string;
        major?: {
            name: string;
        }
    };
    qr_token?: string;
}

export default function StudentIdCard({ student, onClose }: { student: Student; onClose: () => void }) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
    };

    if (!student.qr_token) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">QR Token Not Found</h2>
                    <p className="text-gray-500 mb-6">This student does not have a QR token generated yet.</p>
                    <button onClick={onClose} className="bg-gray-900 text-white px-6 py-2 rounded-xl">Close</button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 p-4">
            
            <div className="flex gap-4 mb-4">
                <button onClick={handlePrint} className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-emerald-700 transition">
                    Print / Download PDF
                </button>
                <button onClick={onClose} className="bg-gray-800 text-white px-6 py-2 rounded-xl font-bold shadow-sm hover:bg-gray-900 transition">
                    Close
                </button>
            </div>

            <div ref={printRef} className="bg-white" style={{ width: '350px', minHeight: '550px', position: 'relative', overflow: 'hidden' }}>
                
                <style dangerouslySetInnerHTML={{__html: `
                    @media print {
                        @page { size: A4; margin: 0; }
                        body { background: white; margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
                    }
                `}} />

                <div style={{ position: 'absolute', top: '-50px', left: '-50px', width: '200px', height: '200px', background: '#D40000', borderRadius: '50%', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '150px', height: '150px', background: '#FFBE00', borderRadius: '50%', zIndex: 0, border: '20px solid #D40000' }}></div>
                <div style={{ position: 'absolute', bottom: '-100px', left: '-50%', width: '200%', height: '250px', background: '#FFBE00', borderRadius: '50% 50% 0 0', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', bottom: '-120px', left: '-50%', width: '200%', height: '250px', background: '#D40000', borderRadius: '50% 50% 0 0', zIndex: 0 }}></div>
                <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', zIndex: 0 }}></div>

                <div style={{ position: 'relative', zIndex: 10, padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', marginBottom: '24px' }}>
                        <div style={{ width: '45px', height: '45px', borderRadius: '50%', background: '#fff', padding: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <img src="/images/logo.jpg" alt="Logo" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} onError={(e) => { e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2RjMjYyNiIvPjwvc3ZnPg==' }} />
                        </div>
                        <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
                            <div style={{ fontWeight: '900', fontSize: '15px', color: '#111' }}>SMK NEGERI 40 JAKARTA</div>
                            <div style={{ fontSize: '9px', color: '#444' }}>Jl. Nanas II No.9, RT.9/RW.10, Utan Kayu Utara, Matraman, Jakarta Timur 13120</div>
                        </div>
                    </div>

                    <div style={{ width: '150px', height: '150px', background: '#fff', padding: '10px', border: '4px solid #FFBE00', margin: '0 auto 16px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
                        <QRCodeSVG value={student.qr_token} size={122} style={{ width: '100%', height: '100%' }} />
                    </div>

                    <h1 style={{ fontSize: '18px', fontWeight: '900', textAlign: 'center', marginBottom: '20px', textTransform: 'uppercase', color: '#000' }}>
                        {student.name}
                    </h1>

                    <div style={{ background: '#fff', borderRadius: '12px', padding: '16px', width: '100%', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}>
                            <div style={{ color: '#111' }}>NIS</div>
                            <div style={{ color: '#444' }}>: {student.nis || '-'}</div>
                            
                            <div style={{ color: '#111' }}>NISN</div>
                            <div style={{ color: '#444' }}>: {student.nisn || '-'}</div>
                            
                            <div style={{ color: '#111' }}>Kelas</div>
                            <div style={{ color: '#444' }}>: {student.classroom?.name || '-'}</div>

                            <div style={{ color: '#111' }}>Jurusan</div>
                            <div style={{ color: '#444' }}>: {student.classroom?.major?.name || '-'}</div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
