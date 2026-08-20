import React, { useState } from 'react';
import { X, Printer, Users } from 'lucide-react';
import { Classroom } from '@/types';

interface BulkPrintModalProps {
    classrooms: Classroom[];
    onClose: () => void;
}

export default function BulkPrintModal({ classrooms, onClose }: BulkPrintModalProps) {
    const [classroomId, setClassroomId] = useState('all');
    const [layout, setLayout] = useState<18 | 20>(18);

    const handleGenerate = () => {
        // Open the print view in a new tab
        const url = new URL('/admin/students/print', window.location.origin);
        if (classroomId !== 'all') {
            url.searchParams.append('classroom_id', classroomId);
        }
        url.searchParams.append('layout', layout.toString());
        
        window.open(url.toString(), '_blank');
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-50 flex items-center justify-center">
                            <Printer className="text-indigo-600" size={20} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">PRINT STUDENT QR</h2>
                            <p className="text-sm text-gray-500">Bulk print QR cards</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Class Filter */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-900 flex items-center gap-2">
                            <Users size={16} className="text-gray-400" />
                            Class Filter
                        </label>
                        <select
                            value={classroomId}
                            onChange={(e) => setClassroomId(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-indigo-500 focus:border-indigo-500 block p-3"
                        >
                            <option value="all">All Classes</option>
                            {classrooms.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Layout Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-bold text-gray-900">Layout (Cards per A4)</label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setLayout(18)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                    layout === 18 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                }`}
                            >
                                <span className="text-2xl font-black mb-1">18</span>
                                <span className="text-xs font-semibold">3 × 6 Grid</span>
                                <span className="text-[10px] mt-1 opacity-70">Larger QR (Ideal)</span>
                            </button>
                            
                            <button
                                type="button"
                                onClick={() => setLayout(20)}
                                className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${
                                    layout === 20 
                                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                }`}
                            >
                                <span className="text-2xl font-black mb-1">20</span>
                                <span className="text-xs font-semibold">4 × 5 Grid</span>
                                <span className="text-[10px] mt-1 opacity-70">More Compact</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleGenerate}
                        className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center gap-2 shadow-sm shadow-indigo-200"
                    >
                        <Printer size={16} />
                        Generate PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
