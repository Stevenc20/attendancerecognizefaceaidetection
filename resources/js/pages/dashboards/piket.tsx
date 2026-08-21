import React from 'react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Head, usePage } from '@inertiajs/react';
import { Users, UserCheck, UserX, UserMinus, AlertCircle, Clock } from 'lucide-react';

interface Stats {
    total_students: number;
    present: number;
    late: number;
    absent: number;
    sick_permit: number;
}

interface ClassStat {
    id: number;
    name: string;
    teacher: string;
    total: number;
    present: number;
    late: number;
    absent: number;
    sick_permit: number;
}

interface Alert {
    student_name: string;
    classroom: string;
    teacher: string;
    status: string;
    remarks?: string;
}

interface PiketProps {
    stats: Stats;
    classrooms: ClassStat[];
    alerts: Alert[];
}

export default function PiketDashboard({ stats, classrooms, alerts }: PiketProps) {
    const { auth } = usePage().props as any;

    return (
        <DashboardLayout role={auth.user.role} userName={auth.user.name} avatar={auth.user.avatar}>
            <Head title="Dashboard Piket" />

            <div className="space-y-6">
                {/* Header */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Pantau Kehadiran Perwalian</h1>
                        <p className="text-gray-500 text-sm mt-1">
                            Monitor siswa yang belum hadir atau terlambat per kelas secara real-time.
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Tanggal Hari Ini</div>
                        <div className="text-lg font-bold text-[#D40000]">
                            {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500">Total Siswa</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.total_students}</div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
                        <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                            <UserCheck size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500">Hadir Tepat Waktu</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.present}</div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow border-l-4 border-l-amber-500">
                        <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                            <Clock size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500">Terlambat</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.late}</div>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow border-l-4 border-l-[#D40000]">
                        <div className="p-3 bg-red-50 text-[#D40000] rounded-xl">
                            <UserX size={24} />
                        </div>
                        <div>
                            <div className="text-sm font-semibold text-gray-500">Belum Hadir / Alpha</div>
                            <div className="text-2xl font-bold text-gray-900">{stats.absent}</div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Class List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <Users size={18} className="text-gray-400" />
                            Status Perwalian
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {classrooms.map(cls => (
                                <div key={cls.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold text-gray-900">{cls.name}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">Wali: {cls.teacher}</p>
                                        </div>
                                        <div className="bg-gray-100 px-2 py-1 rounded text-xs font-semibold text-gray-600">
                                            {cls.total} Siswa
                                        </div>
                                    </div>
                                    
                                    {/* Progress Bar */}
                                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden flex mb-2">
                                        <div style={{ width: `${(cls.present / (cls.total || 1)) * 100}%` }} className="bg-emerald-500 h-full" title="Hadir"></div>
                                        <div style={{ width: `${(cls.late / (cls.total || 1)) * 100}%` }} className="bg-amber-500 h-full" title="Terlambat"></div>
                                        <div style={{ width: `${(cls.sick_permit / (cls.total || 1)) * 100}%` }} className="bg-blue-400 h-full" title="Sakit/Izin"></div>
                                        <div style={{ width: `${(cls.absent / (cls.total || 1)) * 100}%` }} className="bg-gray-200 h-full" title="Belum Hadir"></div>
                                    </div>

                                    <div className="flex justify-between text-[11px] font-medium mt-3">
                                        <span className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">{cls.present} Hadir</span>
                                        <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">{cls.late} Telat</span>
                                        <span className="text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">{cls.sick_permit} Izin</span>
                                        <span className="text-[#D40000] bg-red-50 px-1.5 py-0.5 rounded">{cls.absent} Alpha</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Alerts Panel */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <AlertCircle size={18} className="text-[#D40000]" />
                            Peringatan Ketidakhadiran
                        </h2>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col h-[600px]">
                            <div className="p-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                                Daftar Siswa Belum Hadir / Alpha
                            </div>
                            <div className="overflow-y-auto p-4 space-y-3 flex-1 custom-scrollbar">
                                {alerts.filter(a => a.status === 'Belum Hadir' || a.status === 'Alpha').length === 0 ? (
                                    <div className="text-center text-gray-400 py-10 flex flex-col items-center">
                                        <UserCheck size={32} className="mb-2 text-emerald-300" />
                                        <p>Semua siswa sudah masuk.</p>
                                    </div>
                                ) : (
                                    alerts.filter(a => a.status === 'Belum Hadir' || a.status === 'Alpha').map((alert, idx) => (
                                        <div key={idx} className="flex gap-3 p-3 rounded-lg border border-red-100 bg-red-50/50 hover:bg-red-50 transition-colors">
                                            <div className="mt-0.5 text-[#D40000]">
                                                <UserMinus size={16} />
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm text-gray-900">{alert.student_name}</div>
                                                <div className="text-xs text-gray-600 mt-0.5">
                                                    Kelas <span className="font-semibold">{alert.classroom}</span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 mt-1">
                                                    Wali: {alert.teacher}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e7eb; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d1d5db; }
            `}</style>
        </DashboardLayout>
    );
}
