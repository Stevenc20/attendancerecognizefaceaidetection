import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { User, Mail, Hash, BookOpen, GraduationCap, Building2 } from 'lucide-react';

export default function StudentProfile() {
    const { auth, profile } = usePage().props as any;

    return (
        <DashboardLayout role="student" userName={auth.user.name}>
            <Head title="My Profile" />

            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                        Modules
                    </p>
                    <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                        My Profile
                    </h1>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#D40000] to-[#F05A00] flex items-center justify-center text-white shadow-lg mb-4">
                            <span className="text-3xl font-bold">{profile.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <h2 className="text-xl font-bold text-[#111318]">{profile.name}</h2>
                        <p className="text-sm text-[#6B6F76] mb-6">{profile.email}</p>
                        
                        <div className="w-full pt-6 border-t border-gray-100">
                            <p className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider mb-2">Account Status</p>
                            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full text-emerald-700 bg-emerald-50 border border-emerald-100">
                                ACTIVE STUDENT
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="font-bold text-[#111318] flex items-center gap-2">
                                <GraduationCap size={18} className="text-[#D40000]" />
                                Academic Information
                            </h3>
                        </div>
                        <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <p className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Hash size={14} /> NIS
                                </p>
                                <p className="font-bold text-[#111318] text-lg">{profile.nis || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Hash size={14} /> NISN
                                </p>
                                <p className="font-bold text-[#111318] text-lg">{profile.nisn || '-'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <Building2 size={14} /> Classroom
                                </p>
                                <p className="font-bold text-[#111318] text-lg">{profile.classroom_name}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <User size={14} /> Homeroom Teacher
                                </p>
                                <p className="font-bold text-[#111318] text-lg">{profile.teacher_name}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                            <h3 className="font-bold text-[#111318] flex items-center gap-2">
                                <BookOpen size={18} className="text-[#D40000]" />
                                Registration Details
                            </h3>
                        </div>
                        <div className="p-6">
                            <p className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider mb-1">
                                Joined
                            </p>
                            <p className="font-bold text-[#111318] text-lg">{profile.joined_at}</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
