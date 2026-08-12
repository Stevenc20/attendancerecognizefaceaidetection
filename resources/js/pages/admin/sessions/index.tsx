import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Calendar } from 'lucide-react';

export default function AttendanceSessions() {
    const { auth, sessions } = usePage().props as any;

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title="Attendance Sessions" />

            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Modules
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                    Global Sessions
                </h1>
            </header>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-[#111318]">Active Attendance Dates</h2>
                    <p className="text-sm text-[#6B6F76] mt-1">Global attendance data across all classes for the last 10 active days.</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[600px]">
                        <thead>
                            <tr>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                    Date
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-emerald-600 uppercase tracking-wider border-b border-gray-100 bg-white">
                                    Total Present / Late
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                    Total Recorded
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions && sessions.length > 0 ? (
                                sessions.map((session: any, idx: number) => {
                                    const d = new Date(session.date);
                                    return (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-red-50 text-[#D40000] flex items-center justify-center">
                                                        <Calendar size={16} />
                                                    </div>
                                                    <div className="text-[14px] font-semibold text-[#111318]">
                                                        {d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-[14px] font-bold text-emerald-600 tabular-nums">
                                                {session.present_count}
                                            </td>
                                            <td className="py-4 px-5 text-[14px] font-medium text-[#6B6F76] tabular-nums">
                                                {session.total_recorded}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={3} className="py-8 text-center text-[#6B6F76] text-sm">
                                        No attendance sessions recorded globally yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </DashboardLayout>
    );
}
