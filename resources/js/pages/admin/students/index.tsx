import React, { useState } from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Plus, X, Trash2, Edit2, GraduationCap, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Classroom {
    id: number;
    grade: { name: string };
    major: { code: string };
    name: string;
}

interface StudentUser {
    id: number;
    nis: string | null;
    nisn: string | null;
    name: string;
    email: string;
    account_status: 'active' | 'suspended';
    classroom_id: number;
    classroom?: Classroom;
    created_at: string;
}

interface StudentsProps {
    students: {
        data: StudentUser[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
        total: number;
    };
    classrooms: Classroom[];
    filters: { search?: string; classroom_id?: string };
}

export default function StudentsManagement({ students, classrooms, filters }: StudentsProps) {
    const { auth } = usePage().props as any;
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingStudent, setEditingStudent] = useState<StudentUser | null>(null);
    const [confirmAction, setConfirmAction] = useState<{type: 'delete', student: StudentUser} | null>(null);

    const [search, setSearch] = useState(filters?.search || '');
    const [classroomId, setClassroomId] = useState(filters?.classroom_id || 'all');

    const { data, setData, post, put, processing, errors, reset, delete: destroy } = useForm({
        nis: '',
        nisn: '',
        name: '',
        email: '',
        password: '',
        classroom_id: '',
        account_status: 'active',
    });

    const applyFilters = () => {
        const query: any = {};
        if (search) query.search = search;
        if (classroomId !== 'all') query.classroom_id = classroomId;
        
        // Use Inertia router to visit the page with query parameters
        import('@inertiajs/react').then(({ router }) => {
            router.get('/admin/students', query, { preserveState: true, preserveScroll: true });
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') applyFilters();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (editingStudent) {
            put(`/admin/students/${editingStudent.id}`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                    setEditingStudent(null);
                },
            });
        } else {
            post(`/admin/students`, {
                onSuccess: () => {
                    setIsModalOpen(false);
                    reset();
                },
            });
        }
    };

    const openEdit = (student: StudentUser) => {
        setEditingStudent(student);
        setData({
            nis: student.nis || '',
            nisn: student.nisn || '',
            name: student.name,
            email: student.email,
            password: '', 
            classroom_id: student.classroom_id?.toString() || '',
            account_status: student.account_status,
        });
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setEditingStudent(null);
        reset();
        setIsModalOpen(true);
    };

    const executeConfirmAction = () => {
        if (!confirmAction) return;
        
        destroy(`/admin/students/${confirmAction.student.id}`, {
            onSuccess: () => setConfirmAction(null)
        });
    };

    const getClassroomName = (c?: Classroom) => {
        if (!c) return 'No Class';
        return c.name;
    };

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title="Student Management — SMKN 40" />

            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Academics
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    Student Management.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Manage enrolled students, classes, and access accounts. Total: {students.total}
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6 p-4 flex flex-wrap gap-4 items-center">
                <div className="flex-1 min-w-[200px]">
                    <input 
                        type="text" 
                        placeholder="Search name or NIS..." 
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full h-[40px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] bg-white outline-none focus:border-[#D40000]"
                    />
                </div>
                <div className="w-[250px]">
                    <Select value={classroomId} onValueChange={setClassroomId}>
                        <SelectTrigger className="h-[40px] rounded-xl border border-gray-200 text-[14px] bg-white">
                            <SelectValue placeholder="All Classes" />
                        </SelectTrigger>
                        <SelectContent className="bg-white max-h-[300px] overflow-y-auto">
                            <SelectItem value="all">All Classes</SelectItem>
                            {classrooms?.map(c => (
                                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <button 
                    onClick={applyFilters}
                    className="h-[40px] px-6 rounded-xl bg-gray-100 text-[#111318] text-[13px] font-bold hover:bg-gray-200 transition-colors"
                >
                    Filter
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#111318]">
                        <GraduationCap size={16} />
                        <span className="text-[12px] font-bold uppercase tracking-wider">Students List</span>
                    </div>
                    <button 
                        onClick={openAdd}
                        className="flex items-center gap-1.5 bg-[#111318] text-white text-[12px] font-semibold px-4 py-2 rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                    >
                        <Plus size={14} />
                        Add Student
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/20">
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Student Profile</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Identifiers</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Class</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Status</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.data.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[13px] text-[#6B6F76]">No students found.</td>
                                </tr>
                            ) : (
                                students.data.map((student) => (
                                    <tr key={student.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {student.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#111318]">{student.name}</div>
                                                    <div className="text-[12px] text-[#6B6F76]">{student.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-[12px] font-medium text-[#111318]">
                                            <div className="flex gap-2">
                                                <span className="text-gray-500">NIS:</span> {student.nis || '—'}
                                            </div>
                                            <div className="flex gap-2">
                                                <span className="text-gray-500">NISN:</span> {student.nisn || '—'}
                                            </div>
                                        </td>
                                        <td className="py-3.5 px-5 text-[13px] font-bold text-[#111318]">
                                            {getClassroomName(student.classroom)}
                                        </td>
                                        <td className="py-3.5 px-5">
                                            {student.account_status === 'active' ? (
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
                                                onClick={() => openEdit(student)}
                                                className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button 
                                                onClick={() => setConfirmAction({type: 'delete', student})}
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
                
                {/* Pagination */}
                {students.last_page > 1 && (
                    <div className="p-4 border-t border-gray-100 flex flex-wrap gap-1 justify-center">
                        {students.links.map((link, i) => (
                            <button
                                key={i}
                                disabled={!link.url}
                                onClick={() => {
                                    if (link.url) {
                                        import('@inertiajs/react').then(({ router }) => {
                                            router.get(link.url!, {}, { preserveScroll: true });
                                        });
                                    }
                                }}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1 text-[13px] rounded-lg transition-colors ${link.active ? 'bg-[#D40000] text-white font-bold' : link.url ? 'text-[#6B6F76] hover:bg-gray-100' : 'text-gray-300 cursor-not-allowed'}`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 relative">
                        <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                            <h3 className="font-bold text-[#111318] text-lg tracking-tight">
                                {editingStudent ? 'Edit Student' : 'Add Student'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-900 bg-white hover:bg-gray-100 p-1.5 rounded-full transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[80vh]">
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">NIS (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={data.nis} 
                                        onChange={e => setData('nis', e.target.value)}
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.nis && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.nis}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">NISN (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={data.nisn} 
                                        onChange={e => setData('nisn', e.target.value)}
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.nisn && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.nisn}</p>}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Full Name</label>
                                    <input 
                                        type="text" 
                                        value={data.name} 
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.name && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.name}</p>}
                                </div>
                                
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Classroom</label>
                                    <Select 
                                        value={data.classroom_id} 
                                        onValueChange={val => setData('classroom_id', val)}
                                    >
                                        <SelectTrigger className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] bg-white hover:bg-gray-50 transition-all text-[#111318]">
                                            <SelectValue placeholder="Select Classroom" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white text-[#111318]">
                                            {classrooms.map(c => (
                                                <SelectItem key={c.id} value={c.id.toString()}>
                                                    {getClassroomName(c)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.classroom_id && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.classroom_id}</p>}
                                </div>

                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Email Address</label>
                                    <input 
                                        type="email" 
                                        value={data.email} 
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.email && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.email}</p>}
                                </div>
                                <div>
                                    <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">
                                        Password {editingStudent && <span className="text-gray-400 font-normal normal-case">(Leave blank to keep)</span>}
                                    </label>
                                    <input 
                                        type="password" 
                                        value={data.password} 
                                        onChange={e => setData('password', e.target.value)}
                                        className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                    />
                                    {errors.password && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.password}</p>}
                                </div>
                                {editingStudent && (
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
                                    {processing ? 'Saving...' : 'Save Student'}
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
                        <h3 className="text-lg font-bold text-[#111318] mb-2">Remove Student</h3>
                        <p className="text-[14px] text-[#6B6F76] mb-8">
                            Are you sure you want to permanently delete "{confirmAction.student.name}"?
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
