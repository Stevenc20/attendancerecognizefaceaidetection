import React, { useRef, useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react';

export default function DataImportPage() {
    const { auth, flash } = usePage().props as any;
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [dragActive, setDragActive] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null as File | null,
    });

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file: File) => {
        const isExcel = file.name.endsWith('.xlsx') || file.name.endsWith('.xls');
        if (!isExcel) {
            alert("Only .xlsx or .xls files are allowed. Your file is: " + file.name);
            return;
        }
        setData('file', file);
    };

    const submitImport = (e: React.FormEvent) => {
        e.preventDefault();
        if (!data.file) return;
        
        post('/admin/import', {
            forceFormData: true,
            onSuccess: () => {
                reset('file');
                if (fileInputRef.current) fileInputRef.current.value = '';
            },
        });
    };

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title="Data Import — SMKN 40" />

            <div className="max-w-3xl mx-auto space-y-6">
                <header className="mb-2">
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1 text-center">
                        System Administration
                    </p>
                    <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-center" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                        Data Import.
                    </h1>
                    <p className="text-[14px] text-[#6B6F76] font-medium mt-1 text-center">
                        Upload the official school Excel format to enroll students and teachers automatically.
                    </p>
                </header>
                
                {flash?.success && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-5 flex gap-3 animate-in fade-in slide-in-from-top-4">
                        <CheckCircle2 className="text-green-600 shrink-0" />
                        <div>
                            <h3 className="font-bold text-green-800">Import Successful</h3>
                            <p className="text-green-700 text-sm mt-1">{flash.success}</p>
                        </div>
                    </div>
                )}
                
                {errors?.file && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-5 flex gap-3 animate-in fade-in slide-in-from-top-4">
                        <AlertTriangle className="text-red-600 shrink-0" />
                        <div>
                            <h3 className="font-bold text-red-800">Import Failed</h3>
                            <p className="text-red-700 text-sm mt-1">{errors.file}</p>
                        </div>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6">
                        <h2 className="text-[16px] font-bold text-[#111318] mb-4">Upload Excel File</h2>
                        
                        <form onSubmit={submitImport}>
                            <div 
                                className={`border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center transition-all cursor-pointer relative ${
                                    dragActive ? 'border-blue-500 bg-blue-50' : 
                                    data.file ? 'border-green-500 bg-green-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50 hover:bg-gray-50'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept=".xlsx,.xls"
                                    onChange={handleChange}
                                    className="hidden"
                                />
                                
                                {data.file ? (
                                    <>
                                        <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center text-green-600 mb-4">
                                            <FileSpreadsheet size={32} />
                                        </div>
                                        <p className="font-bold text-[#111318] text-lg">{data.file.name}</p>
                                        <p className="text-sm text-gray-500 mt-1">{(data.file.size / 1024 / 1024).toFixed(2)} MB</p>
                                        <p className="text-[13px] text-green-600 font-medium mt-4 bg-green-100 px-3 py-1 rounded-full">Ready to import</p>
                                    </>
                                ) : (
                                    <>
                                        <div className="h-16 w-16 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-[#6B6F76] mb-4 group-hover:scale-105 transition-transform">
                                            <UploadCloud size={32} />
                                        </div>
                                        <p className="font-bold text-[#111318] text-[15px]">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-[13px] text-[#6B6F76] mt-2">
                                            Supports .xlsx and .xls formats
                                        </p>
                                    </>
                                )}
                            </div>

                            <div className="mt-6 bg-[#fff8f5] border border-[#ffecd9] rounded-xl p-4 text-[13px] text-[#111318] leading-relaxed">
                                <b className="text-[#F05A00] block mb-1">Important Note:</b>
                                The system will automatically scan all sheets and create Classes, Students, and Teachers. Existing records with the same NIS/NIP will be automatically skipped or updated.
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                {data.file && (
                                    <button 
                                        type="button" 
                                        onClick={() => {
                                            setData('file', null);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }}
                                        className="px-5 py-3 text-[14px] font-bold text-[#6B6F76] hover:text-[#111318] hover:bg-gray-100 rounded-xl transition-all"
                                        disabled={processing}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={!data.file || processing}
                                    className="flex items-center gap-2 px-6 py-3 text-[14px] font-bold rounded-xl transition-all shadow-sm shadow-red-900/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
                                    style={{ backgroundColor: '#D40000', color: 'white' }}
                                >
                                    {processing ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            Importing Data...
                                        </>
                                    ) : (
                                        'Start Import Process'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
