import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Building2, Plus, X, Trash2, Library, GraduationCap, Edit2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SchoolSetupProps {
    majors: any[];
    grades: any[];
    classrooms: any[];
}

export default function SchoolSetup({ majors, grades, classrooms }: SchoolSetupProps) {
    const { auth } = usePage().props as any;
    const [activeTab, setActiveTab] = useState<'classrooms' | 'majors' | 'grades'>('classrooms');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isMajorModalOpen, setIsMajorModalOpen] = useState(false);
    const [editingMajor, setEditingMajor] = useState<any>(null);

    const { data, setData, post, processing, errors, reset, delete: destroy } = useForm({
        grade_id: '',
        major_id: '',
        section: '',
    });

    const majorForm = useForm({
        code: '',
        name: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('super-admin.classrooms.store'), {
            onSuccess: () => {
                setIsModalOpen(false);
                reset();
            },
        });
    };

    const handleDeleteClassroom = (id: number) => {
        if (confirm('Are you sure you want to delete this classroom?')) {
            destroy(route('super-admin.classrooms.destroy', id));
        }
    };

    const handleMajorSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingMajor) {
            majorForm.put(route('super-admin.majors.update', editingMajor.id), {
                onSuccess: () => {
                    setIsMajorModalOpen(false);
                    majorForm.reset();
                    setEditingMajor(null);
                },
            });
        } else {
            majorForm.post(route('super-admin.majors.store'), {
                onSuccess: () => {
                    setIsMajorModalOpen(false);
                    majorForm.reset();
                },
            });
        }
    };

    const openEditMajor = (major: any) => {
        setEditingMajor(major);
        majorForm.setData({
            code: major.code,
            name: major.name,
        });
        setIsMajorModalOpen(true);
    };

    const openAddMajor = () => {
        setEditingMajor(null);
        majorForm.reset();
        setIsMajorModalOpen(true);
    };

    const handleDeleteMajor = (id: number) => {
        if (confirm('Are you sure you want to delete this major?')) {
            majorForm.delete(route('super-admin.majors.destroy', id));
        }
    };

    return (
        <DashboardLayout role="super_admin" userName={auth.user.name}>
            <Head title="School Setup — SMKN 40" />

            {/* ── HEADER ── */}
            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    System Administration
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    School Setup.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Manage grades, majors, and classrooms for the academic system.
                </p>
            </header>

            {/* ── TABS ── */}
            <div className="flex gap-6 border-b border-gray-200 mb-6">
                {[
                    { id: 'classrooms', label: 'Classrooms', icon: Building2 },
                    { id: 'majors', label: 'Majors', icon: Library },
                    { id: 'grades', label: 'Grades', icon: GraduationCap },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 pb-3 text-[13px] font-bold uppercase tracking-wider transition-colors relative ${
                            activeTab === tab.id ? 'text-[#D40000]' : 'text-[#6B6F76] hover:text-[#111318]'
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#D40000] rounded-t-full" />
                        )}
                    </button>
                ))}
            </div>

            {/* ── CONTENT ── */}
            {activeTab === 'classrooms' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">All Classrooms</span>
                        <button 
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-1.5 bg-[#111318] text-white text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Plus size={14} />
                            Add Classroom
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100 bg-gray-50/20">
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Class Name</th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Grade & Major</th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider text-right">Students</th>
                                    <th className="py-3 px-5 w-16"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {classrooms.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-[13px] text-[#6B6F76]">No classrooms found.</td>
                                    </tr>
                                ) : (
                                    classrooms.map((cls) => (
                                        <tr key={cls.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3.5 px-5 font-semibold text-[#111318]">{cls.name}</td>
                                            <td className="py-3.5 px-5 text-[13px] text-[#6B6F76]">{cls.grade.name} — {cls.major.code}</td>
                                            <td className="py-3.5 px-5 text-right font-medium text-[#111318]">{cls.students_count}</td>
                                            <td className="py-3.5 px-5 text-right">
                                                <button 
                                                    onClick={() => handleDeleteClassroom(cls.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Delete Classroom"
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
            )}

            {activeTab === 'majors' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Majors (Jurusan)</span>
                        <button 
                            onClick={openAddMajor}
                            className="flex items-center gap-1.5 bg-[#111318] text-white text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            <Plus size={14} />
                            Add Major
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {majors.map((major) => (
                                    <tr key={major.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-5 w-40 font-bold text-[#111318]">{major.code}</td>
                                        <td className="py-4 px-5 text-[14px] text-[#6B6F76]">{major.name}</td>
                                        <td className="py-4 px-5 text-right flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openEditMajor(major)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit Major"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteMajor(major.id)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete Major"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'grades' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Grades (Tingkat)</span>
                    </div>
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            {grades.map((grade) => (
                                <tr key={grade.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4 px-5 w-24 font-bold text-[#111318]">{grade.name}</td>
                                    <td className="py-4 px-5 text-[14px] text-[#6B6F76]">Level {grade.level}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* ── MODAL ADD CLASSROOM ── */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 relative">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
                            <h3 className="font-bold text-[#111318] text-lg tracking-tight">Create Classroom</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200 shadow-sm">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Grade (Tingkat)</label>
                                    <Select 
                                        value={data.grade_id} 
                                        onValueChange={val => setData('grade_id', val)}
                                    >
                                        <SelectTrigger className={`w-full rounded-xl border border-gray-200 text-[14px] h-[46px] px-4 bg-white hover:bg-gray-50 transition-all focus:ring-1 focus:ring-[#D40000] focus:border-[#D40000] ${!data.grade_id ? 'text-gray-400' : 'text-gray-900'}`}>
                                            <SelectValue placeholder="Select Grade..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl">
                                            {grades.map(g => (
                                                <SelectItem key={g.id} value={String(g.id)} className="text-[14px] py-2.5 cursor-pointer">
                                                    {g.name} (Level {g.level})
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.grade_id && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.grade_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Major (Jurusan)</label>
                                    <Select 
                                        value={data.major_id} 
                                        onValueChange={val => setData('major_id', val)}
                                    >
                                        <SelectTrigger className={`w-full rounded-xl border border-gray-200 text-[14px] h-[46px] px-4 bg-white hover:bg-gray-50 transition-all focus:ring-1 focus:ring-[#D40000] focus:border-[#D40000] ${!data.major_id ? 'text-gray-400' : 'text-gray-900'}`}>
                                            <SelectValue placeholder="Select Major..." />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-gray-100 shadow-xl max-h-[280px]">
                                            {majors.map(m => (
                                                <SelectItem key={m.id} value={String(m.id)} className="text-[14px] py-2.5 cursor-pointer">
                                                    {m.code} — {m.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.major_id && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.major_id}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Section (Rombel)</label>
                                    <input 
                                        type="text" 
                                        value={data.section} 
                                        onChange={e => setData('section', e.target.value)}
                                        placeholder="e.g. 1, 2, A, B"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-gray-900 focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.section && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.section}</p>}
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
                                    {processing ? 'Saving...' : 'Save Classroom'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ── MODAL ADD/EDIT MAJOR ── */}
            {isMajorModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 relative">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between bg-white">
                            <h3 className="font-bold text-[#111318] text-lg tracking-tight">{editingMajor ? 'Edit Major' : 'Add Major'}</h3>
                            <button onClick={() => setIsMajorModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200 shadow-sm">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleMajorSubmit} className="p-6">
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Major Code (Singkatan)</label>
                                    <input 
                                        type="text" 
                                        value={majorForm.data.code} 
                                        onChange={e => majorForm.setData('code', e.target.value)}
                                        placeholder="e.g. RPL/PPLG, DKV 1"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-gray-900 focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {majorForm.errors.code && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{majorForm.errors.code}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Full Name (Nama Lengkap)</label>
                                    <input 
                                        type="text" 
                                        value={majorForm.data.name} 
                                        onChange={e => majorForm.setData('name', e.target.value)}
                                        placeholder="e.g. Rekayasa Perangkat Lunak"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-gray-900 focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {majorForm.errors.name && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{majorForm.errors.name}</p>}
                                </div>
                            </div>
                            
                            <div className="mt-8 flex items-center justify-end gap-3 pt-2">
                                <button 
                                    type="button" 
                                    onClick={() => setIsMajorModalOpen(false)}
                                    className="px-5 py-2.5 text-[13px] font-bold text-[#6B6F76] hover:text-[#111318] hover:bg-gray-100 rounded-xl transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={majorForm.processing}
                                    className="px-5 py-2.5 bg-[#D40000] hover:bg-[#8E0010] text-white text-[13px] font-bold rounded-xl transition-all shadow-sm shadow-red-900/10 disabled:opacity-50"
                                >
                                    {majorForm.processing ? 'Saving...' : 'Save Major'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </DashboardLayout>
    );
}
