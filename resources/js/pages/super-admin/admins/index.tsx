import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Plus, X, Trash2, Edit2, Users, Shield, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AdminUser {
    id: number;
    name: string;
    email: string;
    account_status: 'active' | 'suspended';
    created_at: string;
}

interface AdminsProps {
    admins: AdminUser[];
}

export default function AdminsManagement({ admins }: AdminsProps) {
    const { auth } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
    const [confirmAction, setConfirmAction] = useState<{type: 'delete', admin: AdminUser} | null>(null);

    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        name: '',
        email: '',
        password: '',
        account_status: 'active',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingAdmin) {
            put(route('super-admin.admins.update', editingAdmin.id), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setEditingAdmin(null);
                },
            });
        } else {
            post(route('super-admin.admins.store'), {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const openEdit = (admin: AdminUser) => {
        setEditingAdmin(admin);
        setData({
            name: admin.name,
            email: admin.email,
            password: '', // Leave blank unless they want to change it
            account_status: admin.account_status,
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingAdmin(null);
        reset();
        setIsModalOpen(true);
    };

    const handleDelete = (admin: AdminUser) => {
        setConfirmAction({ type: 'delete', admin });
    };

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        
        if (confirmAction.type === 'delete') {
            destroy(route('super-admin.admins.destroy', confirmAction.admin.id), {
                onSuccess: () => setConfirmAction(null)
            });
        }
    };

    return (
        <DashboardLayout role="super_admin" userName={auth.user.name}>
            <Head title="Admin Management — SMKN 40" />

            {/* ── HEADER ── */}
            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    System Administration
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    Admin Management.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Manage system administrators and their access status.
                </p>
            </header>

            {/* ── CONTENT ── */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#111318]">
                        <Users size={16} />
                        <span className="text-[12px] font-bold uppercase tracking-wider">Administrators</span>
                    </div>
                    <button 
                        onClick={openAdd}
                        className="flex items-center gap-1.5 bg-[#111318] text-white text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Plus size={14} />
                        Add Admin
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/20">
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Admin Name</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Email Address</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Status</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admins.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="py-8 text-center text-[13px] text-[#6B6F76]">No admins found.</td>
                                </tr>
                            ) : (
                                admins.map((admin) => (
                                    <tr key={admin.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {admin.name.charAt(0)}
                                                </div>
                                                <span className="font-bold text-[#111318]">{admin.name}</span>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-[13px] font-medium text-[#6B6F76]">
                                            {admin.email}
                                        </td>
                                        <td className="py-3.5 px-5">
                                            {admin.account_status === 'active' ? (
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
                                                onClick={() => openEdit(admin)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => handleDelete(admin)}
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete"
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
                                {editingAdmin ? 'Edit Administrator' : 'Create Administrator'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-1.5 rounded-full transition-colors border border-transparent hover:border-gray-200 shadow-sm">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Admin Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        placeholder="e.g. John Doe"
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
                                        placeholder="admin@smkn40.sch.id"
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.email && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">
                                        Password {editingAdmin && <span className="text-gray-400 font-normal normal-case">(Leave blank to keep current)</span>}
                                    </label>
                                    <input 
                                        type="password" 
                                        value={data.password} 
                                        onChange={e => setData('password', e.target.value)}
                                        placeholder={editingAdmin ? "••••••••" : "Create a strong password"}
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.password && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.password}</p>}
                                </div>
                                {editingAdmin && (
                                    <div>
                                        <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Account Status</label>
                                        <Select 
                                            value={data.account_status} 
                                            onValueChange={val => setData('account_status', val as any)}
                                        >
                                            <SelectTrigger className={`w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] bg-white hover:bg-gray-50 transition-all focus:ring-1 focus:ring-[#D40000] focus:border-[#D40000] text-[#111318]`}>
                                                <SelectValue placeholder="Select Status" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-xl border-gray-100 shadow-xl bg-white text-[#111318]">
                                                <SelectItem value="active" className="text-[14px] py-2.5 cursor-pointer">Active</SelectItem>
                                                <SelectItem value="suspended" className="text-[14px] py-2.5 cursor-pointer text-red-600">Suspended</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {errors.account_status && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.account_status}</p>}
                                    </div>
                                )}
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
                                    className="px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all shadow-sm disabled:opacity-50"
                                    style={{ backgroundColor: '#D40000', color: 'white' }}
                                >
                                    {processing ? 'Saving...' : 'Save Admin'}
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
                            style={{ backgroundColor: '#fee2e2' }}
                        >
                            <Trash2 className="h-6 w-6" style={{ color: '#dc2626' }} />
                        </div>
                        <h3 className="text-lg font-bold text-[#111318] mb-2">
                            Remove Administrator
                        </h3>
                        <p className="text-[14px] text-[#6B6F76] mb-8">
                            Are you sure you want to permanently delete "{confirmAction.admin.name}"? They will lose all access to the system.
                        </p>
                        
                        <div className="flex items-center justify-center gap-3">
                            <button 
                                type="button" 
                                onClick={() => setConfirmAction(null)}
                                className="px-5 py-2.5 text-[13px] font-bold text-[#6B6F76] hover:text-[#111318] hover:bg-gray-100 rounded-xl transition-all w-full"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={executeConfirmAction}
                                disabled={processing}
                                className="px-5 py-2.5 text-[13px] font-bold rounded-xl transition-all shadow-sm disabled:opacity-50 w-full"
                                style={{ backgroundColor: '#D40000', color: 'white' }}
                            >
                                {processing ? 'Processing...' : 'Delete Admin'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
