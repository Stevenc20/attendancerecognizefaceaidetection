import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BarChart3, Download } from 'lucide-react';

export default function TeacherReports() {
    const { auth, homeroomClass, reportData } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'teacher';

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Class Reports" />

            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                        Teacher
                    </p>
                    <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                        Class Reports
                    </h1>
                </div>
                {homeroomClass && (
                    <button className="inline-flex items-center gap-2 bg-[#111318] hover:bg-[#20242D] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors">
                        <Download size={16} />
                        Export to Excel
                    </button>
                )}
            </header>

            {homeroomClass ? (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <span className="text-[12px] font-semibold text-[#D40000] uppercase tracking-wider block mb-1">Wali Kelas: {homeroomClass.name}</span>
                            <h2 className="text-xl font-bold text-[#111318]">Monthly Summary ({currentMonth})</h2>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                        Student Name
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-emerald-600 uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                        Present
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-amber-600 uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                        Late
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-red-600 uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                        Absent
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-right">
                                        Attendance Rate
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {reportData && reportData.length > 0 ? (
                                    reportData.map((row: any, idx: number) => {
                                        const total = row.total_sessions || 1; // avoid division by zero
                                        const rate = Math.round(((row.present + row.late) / total) * 100);
                                        return (
                                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                                <td className="py-4 px-5">
                                                    <div className="text-[14px] font-semibold text-[#111318]">{row.student.name}</div>
                                                    <div className="text-[12px] text-[#6B6F76]">{row.student.nis}</div>
                                                </td>
                                                <td className="py-4 px-5 text-center text-[14px] font-bold text-emerald-600 tabular-nums">
                                                    {row.present}
                                                </td>
                                                <td className="py-4 px-5 text-center text-[14px] font-bold text-amber-500 tabular-nums">
                                                    {row.late}
                                                </td>
                                                <td className="py-4 px-5 text-center text-[14px] font-bold text-red-500 tabular-nums">
                                                    {row.absent}
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
                                        <td colSpan={5} className="py-8 text-center text-[#6B6F76] text-sm">
                                            No attendance data recorded for this month yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-8 text-center flex flex-col items-center justify-center">
                    <BarChart3 className="text-gray-300 mb-3" size={48} />
                    <h2 className="text-lg font-bold text-[#111318] mb-1">No Homeroom Class Assigned</h2>
                    <p className="text-sm text-[#6B6F76] max-w-md">You are not currently assigned as a Wali Kelas (Homeroom Teacher) for any classroom.</p>
                </section>
            )}
        </DashboardLayout>
    );
}
