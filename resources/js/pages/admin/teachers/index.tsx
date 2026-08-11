import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Plus, X, Trash2, Edit2, UserCog, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TeacherUser {
    id: number;
    nip: string | null;
    name: string;
    email: string;
    account_status: 'active' | 'suspended';
    created_at: string;
}

interface TeachersProps {
    teachers: TeacherUser[];
}

export default function TeachersManagement({ teachers }: TeachersProps) {
    const { auth } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTeacher, setEditingTeacher] = useState<TeacherUser | null>(null);
    const [confirmAction, setConfirmAction] = useState<{type: 'delete', teacher: TeacherUser} | null>(null);

    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        nip: '',
        name: '',
        email: '',
        password: '',
        account_status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingTeacher) {
            put(route('admin.teachers.update', editingTeacher.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setEditingTeacher(null);
                },
            });
        } else {
            post(route('admin.teachers.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const openEdit = (teacher: TeacherUser) => {
        setEditingTeacher(teacher);
        setData({
            nip: teacher.nip || '',
            name: teacher.name,
            email: teacher.email,
            password: '', 
            account_status: teacher.account_status,
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingTeacher(null);
        reset();
        setIsModalOpen(true);
    };

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        
        destroy(route('admin.teachers.destroy', confirmAction.teacher.id), {
            onSuccess: () => setConfirmAction(null)
        });
    };

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title="Teacher Management — SMKN 40" />

            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Academics
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    Teacher Management.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Manage school teachers, NIP, and access accounts.
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#111318]">
                        <UserCog size={16} />
                        <span className="text-[12px] font-bold uppercase tracking-wider">Teachers List</span>
                    </div>
                    <button 
                        onClick={openAdd}
                        className="flex items-center gap-1.5 bg-[#111318] text-white text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Plus size={14} />
                        Add Teacher
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/20">
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Teacher Profile</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">NIP</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Status</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-[13px] text-[#6B6F76]">No teachers found.</td>
                                </tr>
                            ) : (
                                teachers.map((teacher) => (
                                    <tr key={teacher.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-orange-100 text-[#F05A00] flex items-center justify-center font-bold text-xs">
                                                    {teacher.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#111318]">{teacher.name}</div>
                                                    <div className="text-[12px] text-[#6B6F76]">{teacher.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-[13px] font-medium text-[#111318]">
                                            {teacher.nip || <span className="text-gray-400 italic">Not set</span>}
                                        </td>
                                        <td className="py-3.5 px-5">
                                            {teacher.account_status === 'active' ? (
                                                <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                    Active
                                                </span>
                                            ) : (
                                                <span className="bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                                                    Suspended
                                                </span>
                                            )}
                                        </td>
                                        <td className="py-3.5 px-5 text-right flex items-center justify-end gap-2">
                                            <button 
                                                onClick={() => openEdit(teacher)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setConfirmAction({type: 'delete', teacher})}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
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

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 relative">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-[#111318] text-lg tracking-tight">
                                {editingTeacher ? 'Edit Teacher' : 'Add Teacher'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">NIP (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={data.nip} 
                                        onChange={e => setData('nip', e.target.value)}
                                        placeholder="Nomor Induk Pegawai"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.nip && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.nip}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. Budi Santoso, S.Kom"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.name && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.name}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)}
                                        placeholder="teacher@smkn40.sch.id"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.email && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">
                                        Password {editingTeacher && <span className="text-gray-400 font-normal normal-case">(Leave blank to keep)</span>}
                                    </label>
                                    <input 
                                        type="password" 
                                        value={data.password} 
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder={editingTeacher ? "••••••••" : "Create password"}
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.password && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.password}</p>}
                                </div>
                                {editingTeacher && (
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Account Status</label>
                                        <Select 
                                            value={data.account_status} 
                                            onValueChange={val => setData('account_status', val as any)}
                                        >
                                            <SelectTrigger className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] bg-white hover:bg-gray-50 transition-all text-[#111318]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white text-[#111318]">
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="suspended" className="text-red-600">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.account_status && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.account_status}</p>}
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-8 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-[13px] font-bold text-[#6B6F76] hover:text-[#111318] hover:bg-gray-100 rounded-xl transition-all">
                                    Cancel
                                </button>
                                <button type="submit" disabled={processing} className="px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all shadow-sm" style={{ backgroundColor: '#D40000', color: 'white' }}>
                                    {processing ? 'Saving...' : 'Save Teacher'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DELETE MODAL */}
            {confirmAction && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm border border-gray-100 text-center p-6">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full mb-4" style={{ backgroundColor: '#fee2e2' }}>
                            <Trash2 className="h-6 w-6" style={{ color: '#dc2626' }} />
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] mb-2">Remove Teacher</h3>
                        <p className="text-[14px] text-[#6B6F76] mb-8">
                            Are you sure you want to permanently delete "{confirmAction.teacher.name}"?
                        </p>
                        <div className="flex gap-3">
                            <button type="button" onClick={() => setConfirmAction(null)} className="px-5 py-2.5 text-[13px] font-bold text-[#6B6F76] hover:bg-gray-100 rounded-xl transition-all w-full">Cancel</button>
                            <button onClick={executeConfirmAction} disabled={processing} className="px-5 py-2.5 text-[13px] font-bold rounded-xl w-full" style={{ backgroundColor: '#D40000', color: 'white' }}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
