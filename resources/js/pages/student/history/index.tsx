import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { CalendarCheck, Search } from 'lucide-react';

export default function AttendanceHistory() {
    const { auth, history } = usePage().props as any;

    return (
        <DashboardLayout role="student" userName={auth.user.name}>
            <Head title="Attendance History" />

            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                        Modules
                    </p>
                    <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                        Attendance History
                    </h1>
                </div>
            </header>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#111318]">All Records</h2>
                        <p className="text-sm text-[#6B6F76] mt-1">A complete log of your attendance history.</p>
                    </div>
                    {/* Placeholder search input */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search by date..." 
                            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D40000]/20 focus:border-[#D40000] transition-all"
                            disabled
                        />
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
                                    Time
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                    Status
                                </th>
                                <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-right">
                                    Method
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {history && history.length > 0 ? (
                                history.map((record: any) => {
                                    const d = new Date(record.date);
                                    return (
                                        <tr key={record.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                                                        <CalendarCheck size={16} />
                                                    </div>
                                                    <div className="text-[14px] font-semibold text-[#111318]">
                                                        {d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-[14px] font-medium text-[#111318]">
                                                {record.time_in}
                                            </td>
                                            <td className="py-4 px-5">
                                                <span className={`inline-flex items-center gap-1 text-[12px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                                    record.status === 'Present' ? 'text-emerald-700 bg-emerald-50' : 
                                                    record.status === 'Late' ? 'text-amber-700 bg-amber-50' : 'text-red-700 bg-red-50'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="py-4 px-5 text-right text-[12px] font-semibold text-[#6B6F76] uppercase">
                                                {record.method}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={4} className="py-12 text-center text-[#6B6F76] text-sm">
                                        You have no attendance records yet.
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
