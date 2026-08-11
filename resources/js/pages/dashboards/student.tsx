import { Head, usePage, Link } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Camera, Smartphone, ArrowUpRight } from 'lucide-react';

export default function StudentDashboard({ hasEnrolled }: { hasEnrolled: boolean }) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'student';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const todayStatus = { status: 'Present', time: '07:15', method: 'Face Recognition' };

    const metrics = [
        { id: 'Attendance Rate', value: '92%', sub: 'Current semester' },
        { id: 'Total Present', value: '45', sub: 'Days attended' },
        { id: 'Total Absent', value: '4', sub: 'Days missed' },
    ];

    const recentAttendance = [
        { date: 'Today, 11 Aug', time: '07:15', status: 'Present', method: 'Face' },
        { date: 'Fri, 08 Aug', time: '07:10', status: 'Present', method: 'Face' },
        { date: 'Thu, 07 Aug', time: '07:05', status: 'Present', method: 'QR' },
        { date: 'Wed, 06 Aug', time: '07:45', status: 'Late', method: 'Face' },
        { date: 'Tue, 05 Aug', time: '—', status: 'Absent', method: '—' },
        { date: 'Mon, 04 Aug', time: '07:20', status: 'Present', method: 'Face' },
        { date: 'Fri, 01 Aug', time: '07:18', status: 'Present', method: 'QR' },
    ];

    const shortcuts = ['Attendance History', 'My Profile', 'My Device'];

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Student — SMKN 40" />

            {/* ── HEADER ── */}
            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Student Portal
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    {greeting}, {user.name}.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    XII RPL 1
                </p>
            </header>

            {/* ── TODAY'S STATUS (Hero) ── */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">
                        Today's Status
                    </span>
                </div>

                <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                            todayStatus.status === 'Present' ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] animate-pulse' : 
                            todayStatus.status === 'Late' ? 'bg-[#F05A00] shadow-[0_0_12px_rgba(240,90,0,0.5)]' : 'bg-[#D40000]'
                        }`} />
                        <span className="font-bold text-[#111318] leading-none tracking-tight uppercase" style={{ fontSize: 'clamp(2.5rem, 2rem + 2vw, 3.5rem)' }}>
                            {todayStatus.status}
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-[13px] font-medium text-[#6B6F76] bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-100">
                        <span className="tabular-nums flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                            Recorded at {todayStatus.time}
                        </span>
                        <div className="w-px h-4 bg-gray-200" />
                        <span className="flex items-center gap-1.5 text-[#111318]">
                            {todayStatus.method === 'Face Recognition' ? <Camera size={14} className="text-[#6B6F76]" /> : <Smartphone size={14} className="text-[#6B6F76]" />}
                            {todayStatus.method}
                        </span>
                    </div>
                </div>
            </section>

            {/* ── METRICS ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {metrics.map((m, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col justify-between">
                        <div className="text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider mb-2">{m.id}</div>
                        <div className="font-bold text-[#111318] tabular-nums leading-none mb-1.5" style={{ fontSize: 'clamp(1.75rem, 1.5rem + 1vw, 2.25rem)' }}>
                            {m.value}
                        </div>
                        <div className="text-[11px] text-[#6B6F76]">{m.sub}</div>
                    </div>
                ))}
            </div>

            {/* ── TWO-COLUMN GRID ── */}
            <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-6">
                
                {/* Attendance History */}
                <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Attendance History</span>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {recentAttendance.map((record, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3.5 px-5 text-[13px] font-medium text-[#111318]">{record.date}</td>
                                        <td className="py-3.5 px-3 text-[12px] font-medium text-[#6B6F76] tabular-nums w-16">{record.time}</td>
                                        <td className="py-3.5 px-3 text-center w-24">
                                            <span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                                record.status === 'Present' ? 'bg-gray-100 text-[#111318]' : 
                                                record.status === 'Late' ? 'bg-orange-50 text-[#F05A00] border border-orange-100' : 'bg-red-50 text-[#D40000] border border-red-100'
                                            }`}>
                                                {record.status}
                                            </span>
                                        </td>
                                        <td className="py-3.5 px-5 text-right w-24">
                                            {record.method !== '—' && (
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#6B6F76] bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                                    {record.method === 'Face' ? <Camera size={10} /> : <Smartphone size={10} />}
                                                    {record.method}
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Device & Face Info */}
                <div className="lg:col-span-2 flex flex-col gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                            <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Registered Device</span>
                        </div>
                        <div className="p-5">
                            <div className="text-[15px] font-semibold text-[#111318] mb-1">iPhone 13 Pro</div>
                            <div className="text-[12px] font-mono text-[#6B6F76] bg-gray-50 px-2 py-1 rounded border border-gray-100 inline-block uppercase">4F8A-92BC-7D1E-XXXX</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Face Enrollment</span>
                            {!hasEnrolled && (
                                <a href="/student/face-enrollment" className="text-[11px] font-bold text-white bg-[#D40000] px-3 py-1 rounded-full hover:bg-red-700 transition-colors">
                                    Register Now
                                </a>
                            )}
                        </div>
                        <div className="p-5">
                            {hasEnrolled ? (
                                <>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                                        <span className="text-[15px] font-semibold text-[#111318]">Enrolled</span>
                                    </div>
                                    <div className="text-[13px] text-[#6B6F76] font-medium">Ready for face attendance</div>
                                </>
                            ) : (
                                <>
                                    <div className="flex items-center gap-2 mb-1.5">
                                        <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)] animate-pulse" />
                                        <span className="text-[15px] font-semibold text-[#111318]">Not Enrolled</span>
                                    </div>
                                    <div className="text-[13px] text-[#6B6F76] font-medium">Biometric data is missing</div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* ✨ SHORTCUTS ✨ */}
            <footer className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <span className="text-[12px] font-semibold text-[#6B6F76] uppercase tracking-wider pl-1">
                    Quick Actions
                </span>
                <div className="flex flex-wrap gap-2">
                    <Link href="/student/history" className="flex items-center gap-1 text-[12px] font-semibold text-[#111318] bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                        Attendance History
                        <ArrowUpRight size={12} className="text-[#6B6F76]" />
                    </Link>
                    <Link href="/student/profile" className="flex items-center gap-1 text-[12px] font-semibold text-[#111318] bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                        My Profile
                        <ArrowUpRight size={12} className="text-[#6B6F76]" />
                    </Link>
                    <Link href="/student/device" className="flex items-center gap-1 text-[12px] font-semibold text-[#111318] bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                        My Device
                        <ArrowUpRight size={12} className="text-[#6B6F76]" />
                    </Link>
                </div>
            </footer>
        </DashboardLayout>
    );
}
