import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';

interface Student {
    id: number;
    name: string;
    nis?: string;
    nisn?: string;
    qr_token?: string;
    classroom?: {
        name: string;
        major?: {
            code?: string;
        };
    };
}

interface PrintProps {
    students: Student[];
    layout: number; // 18 or 20
    schoolName: string;
}

export default function BulkPrintQR({ students, layout, schoolName }: PrintProps) {
    // Trigger print dialog as soon as component renders and images/fonts are loaded
    useEffect(() => {
        const timer = setTimeout(() => {
            window.print();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    // Layout configuration
    const gridClass = layout === 20 ? 'grid-cols-4' : 'grid-cols-3';
    
    // Chunk students into pages
    const chunkedStudents: Student[][] = [];
    for (let i = 0; i < students.length; i += layout) {
        chunkedStudents.push(students.slice(i, i + layout));
    }

    if (students.length === 0) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No Students Found</h2>
                    <p className="text-gray-500">There are no students in the selected class.</p>
                    <button 
                        onClick={() => window.close()} 
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
                    >
                        Close Window
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-200 print:bg-white font-sans text-gray-900">
            <Head title={`Print ${students.length} QR Cards`} />
            
            {/* Screen-only Controls */}
            <div className="print:hidden fixed top-4 right-4 flex gap-2">
                <button 
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-lg"
                >
                    Print Now
                </button>
                <button 
                    onClick={() => window.close()}
                    className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg text-sm font-bold shadow-lg"
                >
                    Close
                </button>
            </div>

            {chunkedStudents.map((page, pageIndex) => (
                <div 
                    key={pageIndex} 
                    className="w-[210mm] h-[297mm] mx-auto bg-white mb-8 shadow-xl print:shadow-none print:mb-0 box-border p-4"
                    style={{ pageBreakAfter: 'always' }}
                >
                    <div className={`grid ${gridClass} gap-2 h-full`}>
                        {page.map(student => (
                            <div 
                                key={student.id} 
                                className="border border-gray-800 rounded-lg p-2 flex flex-col items-center justify-between overflow-hidden"
                            >
                                {/* Header */}
                                <div className="text-center w-full mb-1">
                                    <div className="font-bold text-[10px] leading-tight uppercase tracking-tight truncate">
                                        {schoolName}
                                    </div>
                                    <div className="w-full h-px bg-gray-800 my-1"></div>
                                </div>
                                
                                {/* QR Code */}
                                <div className="flex-1 flex items-center justify-center p-1">
                                    {student.qr_token ? (
                                        <QRCodeSVG
                                            value={student.qr_token}
                                            size={layout === 20 ? 75 : 90}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    ) : (
                                        <div className="text-[10px] text-gray-400 text-center">No QR</div>
                                    )}
                                </div>
                                
                                {/* Student Info */}
                                <div className="w-full text-center mt-1">
                                    <div className="font-bold text-[11px] leading-tight uppercase truncate">
                                        {student.name}
                                    </div>
                                    <div className="text-[9px] font-semibold text-gray-700 leading-tight">
                                        NIS: {student.nis || '-'}
                                    </div>
                                    <div className="text-[9px] font-semibold text-gray-700 leading-tight">
                                        {student.classroom?.name || 'No Class'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
