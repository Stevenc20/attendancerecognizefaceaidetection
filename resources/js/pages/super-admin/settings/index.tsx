import React from 'react';
import { Head, useForm, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Save, Settings, Building2, Clock, ShieldCheck } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SystemSettings {
    school_name: string;
    school_address: string;
    contact_email: string;
    attendance_start_time: string;
    attendance_late_time: string;
    face_recognition_strictness: 'low' | 'medium' | 'high';
}

interface SettingsProps {
    settings: SystemSettings;
}

export default function SystemSettingsPage({ settings }: SettingsProps) {
    const { auth } = usePage().props as any;

    const { data, setData, post, processing, errors } = useForm({
        school_name: settings.school_name || '',
        school_address: settings.school_address || '',
        contact_email: settings.contact_email || '',
        attendance_start_time: settings.attendance_start_time || '',
        attendance_late_time: settings.attendance_late_time || '',
        face_recognition_strictness: settings.face_recognition_strictness || 'medium',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('super-admin.settings.store'));
    };

    return (
        <DashboardLayout role="super_admin" userName={auth.user.name}>
            <Head title="System Settings — SMKN 40" />

            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    System Administration
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    System Settings.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Configure global parameters for the attendance and monitoring system.
                </p>
            </header>

            <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
                
                {/* ── SCHOOL INFO SECTION ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2 text-[#111318]">
                        <Building2 size={16} />
                        <h2 className="text-[12px] font-bold uppercase tracking-wider">School Information</h2>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">School Name</label>
                                <input 
                                    type="text" 
                                    value={data.school_name} 
                                    onChange={e => setData('school_name', e.target.value)}
                                    className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                />
                                {errors.school_name && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.school_name}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Contact Email</label>
                                <input 
                                    type="email" 
                                    value={data.contact_email} 
                                    onChange={e => setData('contact_email', e.target.value)}
                                    className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                />
                                {errors.contact_email && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.contact_email}</p>}
                            </div>
                        </div>
                        <div>
                            <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">School Address</label>
                            <textarea 
                                value={data.school_address} 
                                onChange={e => setData('school_address', e.target.value)}
                                rows={2}
                                className="w-full py-3 px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none resize-none"
                            ></textarea>
                            {errors.school_address && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.school_address}</p>}
                        </div>
                    </div>
                </div>

                {/* ── ATTENDANCE RULES SECTION ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2 text-[#111318]">
                        <Clock size={16} />
                        <h2 className="text-[12px] font-bold uppercase tracking-wider">Attendance Rules (Default)</h2>
                    </div>
                    <div className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Gate Opens At</label>
                                <input 
                                    type="time" 
                                    value={data.attendance_start_time} 
                                    onChange={e => setData('attendance_start_time', e.target.value)}
                                    className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                />
                                {errors.attendance_start_time && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.attendance_start_time}</p>}
                            </div>
                            <div>
                                <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Marked Late After</label>
                                <input 
                                    type="time" 
                                    value={data.attendance_late_time} 
                                    onChange={e => setData('attendance_late_time', e.target.value)}
                                    className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] text-[#111318] focus:border-[#D40000] focus:ring-[#D40000] focus:ring-1 bg-white hover:bg-gray-50 transition-all outline-none"
                                />
                                {errors.attendance_late_time && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.attendance_late_time}</p>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── SECURITY SECTION ── */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2 text-[#111318]">
                        <ShieldCheck size={16} />
                        <h2 className="text-[12px] font-bold uppercase tracking-wider">Security & Devices</h2>
                    </div>
                    <div className="p-6">
                        <div className="w-full md:w-1/2">
                            <label className="block text-[11px] font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">Face Recognition Strictness</label>
                            <Select 
                                value={data.face_recognition_strictness} 
                                onValueChange={val => setData('face_recognition_strictness', val as any)}
                            >
                                <SelectTrigger className="w-full h-[46px] px-4 rounded-xl border border-gray-200 text-[14px] bg-white hover:bg-gray-50 transition-all focus:ring-1 focus:ring-[#D40000] focus:border-[#D40000] text-[#111318]">
                                    <SelectValue placeholder="Select Strictness Level" />
                                </SelectTrigger>
                                <SelectContent className="bg-white text-[#111318] rounded-xl shadow-xl border-gray-100">
                                    <SelectItem value="low" className="py-2.5">Low (Faster, less accurate)</SelectItem>
                                    <SelectItem value="medium" className="py-2.5">Medium (Recommended)</SelectItem>
                                    <SelectItem value="high" className="py-2.5">High (Slower, highly accurate)</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-[12px] text-[#6B6F76] mt-2 leading-relaxed">
                                Defines the matching threshold for the AI face recognition engine during attendance scanning.
                            </p>
                            {errors.face_recognition_strictness && <p className="text-[#D40000] text-[11px] font-medium mt-1.5">{errors.face_recognition_strictness}</p>}
                        </div>
                    </div>
                </div>

                {/* ── ACTIONS ── */}
                <div className="flex justify-end pt-4 pb-12">
                    <button 
                        type="submit" 
                        disabled={processing}
                        className="flex items-center gap-2 px-6 py-3 text-[14px] font-bold rounded-xl transition-all shadow-sm shadow-red-900/10 hover:-translate-y-0.5 disabled:opacity-50 disabled:hover:translate-y-0"
                        style={{ backgroundColor: '#D40000', color: 'white' }}
                    >
                        <Save size={18} />
                        {processing ? 'Saving...' : 'Save Settings'}
                    </button>
                </div>
            </form>
        </DashboardLayout>
    );
}
