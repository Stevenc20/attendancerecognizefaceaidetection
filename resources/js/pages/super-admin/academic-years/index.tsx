import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Plus, X, Trash2, Edit2, CalendarClock, CheckCircle2, Circle, AlertTriangle } from 'lucide-react';

interface AcademicYear {
    id: number;
    name: string;
    is_active: boolean;
    start_date: string | null;
    end_date: string | null;
}

interface AcademicYearsProps {
    academicYears: AcademicYear[];
}

export default function AcademicYears({ academicYears }: AcademicYearsProps) {
    const { auth } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
    const [confirmAction, setConfirmAction] = useState<{type: 'delete' | 'setActive', year: AcademicYear} | null>(null);

    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        name: '',
        start_date: '',
        end_date: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingYear) {
            put(route('super-admin.academic-years.update', editingYear.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setEditingYear(null);
                },
            });
        } else {
            post(route('super-admin.academic-years.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const openEdit = (year: AcademicYear) => {
        setEditingYear(year);
        setData({
            name: year.name,
            start_date: year.start_date || '',
            end_date: year.end_date || '',
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingYear(null);
        reset();
        setIsModalOpen(true);
    };

    const handleDelete = (year: AcademicYear) => {
        if (year.is_active) return;
        setConfirmAction({ type: 'delete', year });
    };

    const handleSetActive = (year: AcademicYear) => {
        if (year.is_active) return;
        setConfirmAction({ type: 'setActive', year });
    };

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        
        if (confirmAction.type === 'delete') {
            destroy(route('super-admin.academic-years.destroy', confirmAction.year.id), {
                onSuccess: () => setConfirmAction(null)
            });
        } else if (confirmAction.type === 'setActive') {
            put(route('super-admin.academic-years.set-active', confirmAction.year.id), {
                onSuccess: () => setConfirmAction(null)
            });
        }
    };

    return (
        <DashboardLayout role="super_admin" userName={auth.user.name}>
            <Head title="Academic Years — SMKN 40" />

            {/* ── HEADER ── */}
            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    System Administration
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    Academic Years.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Manage school academic years and set the active enrollment period.
                </p>
            </header>

            {/* ── CONTENT ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#111318]">
                        <CalendarClock size={16} />
                        <span className="text-[12px] font-bold uppercase tracking-wider">All Academic Years</span>
                    </div>
                    <button 
                        onClick={openAdd}
                        className="flex items-center gap-1.5 bg-[#111318] text-white text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Plus size={14} />
                        Add Year
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/20">
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider w-12">Status</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Academic Year Name</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Start Date</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">End Date</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academicYears.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[13px] text-[#6B6F76]">No academic years found.</td>
                                </tr>
                            ) : (
                                academicYears.map((year) => (
                                    <tr key={year.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-5">
                                            <button 
                                                onClick={() => handleSetActive(year)}
                                                className={`flex items-center justify-center transition-colors ${year.is_active ? 'text-green-500' : 'text-gray-300 hover:text-[#111318]'}`}
                                                title={year.is_active ? 'Currently Active' : 'Click to set active'}
                                            >
                                                {year.is_active ? <CheckCircle2 size={20} className="fill-green-50" /> : <Circle size={20} />}
                                            </button>
                                        </td>
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-[#111318]">{year.name}</span>
                                                {year.is_active && (
                                                    <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                        Active
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-[13px] font-medium text-[#6B6F76]">
                                            {year.start_date ? new Date(year.start_date).toLocaleDateString('en-GB') : '-'}
                                        </td>
                                        <td className="py-3.5 px-5 text-[13px] font-medium text-[#6B6F76]">
                                            {year.end_date ? new Date(year.end_date).toLocaleDateString('en-GB') : '-'}
                                        </td>
                                        <td className="py-3.5 px-5 text-right flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openEdit(year)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(year)}
                                                disabled={year.is_active}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-gray-400"
                                                title={year.is_active ? 'Cannot delete active year' : 'Delete'}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── MODAL ADD/EDIT ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 relative">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
                            <h3 className="font-bold text-[#111318] text-lg tracking-tight">
                                {editingYear ? 'Edit Academic Year' : 'Create Academic Year'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200 shadow-sm">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Year Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. 2026/2027 Ganjil"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.name && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.name}</p>}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Start Date</label>
                                        <input 
                                            type="date" 
                                            value={data.start_date} 
                                            onChange={e => setData('start_date', e.target.value)}
                                            className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                        />
                                        {errors.start_date && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.start_date}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">End Date</label>
                                        <input 
                                            type="date" 
                                            value={data.end_date} 
                                            onChange={e => setData('end_date', e.target.value)}
                                            className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                        />
                                        {errors.end_date && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.end_date}</p>}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-8 flex items-center justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-5 py-2.5 text-[13px] font-bold text-[#6B6F76] hover:text-[#111318] hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={processing}
                                    className="px-5 py-2.5 bg-[#D40000] hover:bg-[#8E0010] text-white text-[13px] font-bold rounded-xl transition-all shadow-sm shadow-red-900/10 disabled:opacity-50"
                                >
                                    {processing ? 'Saving...' : 'Save Year'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── CONFIRMATION MODAL ── */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 text-center p-6">
                        <div 
                            className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4"
                            style={{ backgroundColor: confirmAction.type === 'delete' ? '#fee2e2' : '#dcfce7' }}
                        >
                            {confirmAction.type === 'delete' ? (
                                <Trash2 className="h-6 w-6" style={{ color: '#dc2626' }} />
                            ) : (
                                <CheckCircle2 className="h-6 w-6" style={{ color: '#16a34a' }} />
                            )}
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] mb-2">
                            {confirmAction.type === 'delete' ? 'Delete Academic Year' : 'Set Active Year'}
                        </h3>
                        <p className="text-[14px] text-[#6B6F76] mb-8">
                            {confirmAction.type === 'delete' 
                                ? `Are you sure you want to delete "${confirmAction.year.name}"? This action cannot be undone.`
                                : `Are you sure you want to set "${confirmAction.year.name}" as the currently active academic year?`
                            }
                        </p>
                        
                        <div className="flex items-center justify-center gap-3">
                            <button 
                                type="button" 
                                onClick={() => setConfirmAction(null)}
                                className="px-5 py-2.5 text-[13px] font-bold text-[#6B6F76] hover:text-[#111318] hover:bg-gray-100 rounded-xl transition-all w-full"
                            >
                                Cancel
                            </button>
                            {confirmAction.type === 'delete' ? (
                                <button 
                                    onClick={executeConfirmAction}
                                    disabled={processing}
                                    className="px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 w-full"
                                    style={{ backgroundColor: '#D40000', color: 'white' }}
                                >
                                    {processing ? 'Processing...' : 'Delete'}
                                </button>
                            ) : (
                                <button 
                                    onClick={executeConfirmAction}
                                    disabled={processing}
                                    className="px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 w-full"
                                    style={{ backgroundColor: '#16a34a', color: 'white' }}
                                >
                                    {processing ? 'Processing...' : 'Set Active'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
