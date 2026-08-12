import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { BarChart3, Building } from 'lucide-react';

export default function GlobalReports() {
    const { auth, reports } = usePage().props as any;

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title="Global Reports" />

            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Modules
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                    Global Reports
                </h1>
            </header>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-[#111318]">Classroom Performance</h2>
                    <p className="text-sm text-[#6B6F76] mt-1">Aggregate attendance rates grouped by classroom for the current month.</p>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                            <tr>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                    Classroom
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                    Wali Kelas
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                    Total Students
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-center">
                                    Active Sessions
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-right">
                                    Avg. Attendance Rate
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports && reports.length > 0 ? (
                                reports.map((row: any, idx: number) => {
                                    const rate = row.attendance_rate;
                                    return (
                                        <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <Building size={16} />
                                                    </div>
                                                    <div className="text-[14px] font-bold text-[#111318]">
                                                        {row.class_name}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-[14px] font-semibold text-[#111318]">
                                                {row.teacher_name}
                                            </td>
                                            <td className="py-4 px-5 text-center text-[14px] font-bold text-[#111318] tabular-nums">
                                                {row.total_students}
                                            </td>
                                            <td className="py-4 px-5 text-center text-[14px] font-medium text-[#6B6F76] tabular-nums">
                                                {row.active_sessions}
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <span className={`inline-flex items-center gap-1.5 text-[12px] font-bold tabular-nums px-2.5 py-1 rounded-md ${
                                                    rate >= 80 ? 'text-emerald-700 bg-emerald-50' : 
                                                    rate >= 50 ? 'text-amber-700 bg-amber-50' : 
                                                    rate > 0 ? 'text-red-700 bg-red-50' : 'text-gray-500 bg-gray-100'
                                                }`}>
                                                    {rate}%
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={5} className="py-12 text-center text-[#6B6F76] text-sm flex-col items-center">
                                        <BarChart3 size={32} className="mx-auto mb-3 text-gray-300" />
                                        No classroom data found.
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
