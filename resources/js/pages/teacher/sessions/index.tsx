import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ClipboardList, Calendar } from 'lucide-react';

export default function TeacherSessions() {
    const { auth, homeroomClass, sessions } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'teacher';

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Attendance Sessions" />

            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Teacher
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                    Attendance Sessions
                </h1>
            </header>

            {homeroomClass ? (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-[12px] font-semibold text-[#D40000] uppercase tracking-wider block mb-1">Wali Kelas: {homeroomClass.name}</span>
                            <h2 className="text-xl font-bold text-[#111318]">Recent Sessions</h2>
                            <p className="text-sm text-[#6B6F76] mt-1">Showing last 10 recorded dates</p>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                        Date
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                        Present / Late
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                        Absent
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-right">
                                        Attendance Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {sessions && sessions.length > 0 ? (
                                    sessions.map((session: any, idx: number) => {
                                        const d = new Date(session.date);
                                        const rate = Math.round((session.present_count / session.total_students) * 100) || 0;
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
                                                <td className="py-4 px-5 text-[14px] font-semibold text-emerald-600 tabular-nums">
                                                    {session.present_count} <span className="text-[#6B6F76] text-xs font-normal">/ {session.total_students}</span>
                                                </td>
                                                <td className="py-4 px-5 text-[14px] font-semibold text-red-500 tabular-nums">
                                                    {session.absent_count}
                                                </td>
                                                <td className="py-4 px-5 text-right">
                                                    <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold tabular-nums px-2.5 py-1 rounded-md ${
                                                        rate >= 80 ? 'text-emerald-700 bg-emerald-50' : 
                                                        rate >= 50 ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
                                                    }`}>
                                                        {rate}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-[#6B6F76] text-sm">
                                            No attendance sessions recorded yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-8 text-center flex flex-col items-center justify-center">
                    <ClipboardList className="text-gray-300 mb-3" size={48} />
                    <h2 className="text-lg font-bold text-[#111318] mb-1">No Homeroom Class Assigned</h2>
                    <p className="text-sm text-[#6B6F76] max-w-md">You are not currently assigned as a Wali Kelas (Homeroom Teacher) for any classroom.</p>
                </section>
            )}
        </DashboardLayout>
    );
}
