import React from 'react';
import { Head, usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ArrowLeft, User, CheckCircle, AlertCircle, Clock } from 'lucide-react';

export default function SessionDetail() {
    const { auth, date, attendances } = usePage().props as any;

    const formattedDate = new Date(date).toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'present': return 'bg-emerald-100 text-emerald-700';
            case 'late': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title={`Attendance Session - ${date}`} />

            <div className="mb-6">
                <Link 
                    href="/admin/sessions" 
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#6B6F76] hover:text-[#111318] transition-colors mb-4"
                >
                    <ArrowLeft size={16} />
                    Back to Global Sessions
                </Link>
                
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                    {formattedDate}
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Total Recorded: {attendances.length}
                </p>
            </div>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-bold uppercase tracking-wider text-[#111318]">Attendance List</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-gray-100 bg-white">
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Student Profile</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Class</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Time In</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Status</th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider">Method</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendances.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="py-8 text-center text-[#6B6F76] text-sm">
                                        No attendance data found for this date.
                                    </td>
                                </tr>
                            ) : (
                                attendances.map((att: any) => (
                                    <tr key={att.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                                                    {att.user?.name?.charAt(0) || '?'}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-[#111318] text-sm">{att.user?.name || 'Unknown User'}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-5 text-sm text-[#111318] font-semibold">
                                            {att.user?.classroom ? `${att.user.classroom.name} • ${att.user.classroom.major?.code || ''}` : 'No Class'}
                                        </td>
                                        <td className="py-3 px-5 text-sm text-[#111318] tabular-nums font-semibold flex items-center gap-1.5">
                                            <Clock size={14} className="text-gray-400" />
                                            {att.time_in}
                                        </td>
                                        <td className="py-3 px-5">
                                            <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide inline-flex items-center gap-1 ${getStatusColor(att.status)}`}>
                                                {att.status === 'present' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                                                {att.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-5 text-xs text-[#6B6F76] font-semibold">
                                            {att.method}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </DashboardLayout>
    );
}
