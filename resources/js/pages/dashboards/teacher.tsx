import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ArrowUpRight, Users } from 'lucide-react';

export default function TeacherDashboard() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'teacher';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const metrics = [
        { id: 'My Classes', value: '4', sub: '2 scheduled today' },
        { id: 'Active Sessions', value: '2', sub: 'Currently running' },
        { id: 'Attendance Rate', value: '94%', sub: 'Average this week' },
    ];

    const classes = [
        { name: 'Mathematics', section: 'XII RPL 1', students: 32, schedule: 'Mon · Wed · Fri', today: true },
        { name: 'Mathematics', section: 'XII RPL 2', students: 34, schedule: 'Tue · Thu', today: true },
        { name: 'Physics', section: 'XI TKJ 1', students: 30, schedule: 'Mon · Wed', today: false },
        { name: 'Physics', section: 'XI TKJ 2', students: 28, schedule: 'Tue · Thu', today: false },
    ];

    const sessions = [
        { name: 'Mathematics — XII RPL 1', time: '08:00 – 09:30', present: 28, total: 32, status: 'Active' },
        { name: 'Physics — XI TKJ 1', time: '10:00 – 11:30', present: 0, total: 30, status: 'Upcoming' },
    ];

    const shortcuts = ['My Classes', 'Create Session', 'Class Reports'];

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Teacher — SMKN 40" />

            {/* ── HEADER ── */}
            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Teaching Dashboard
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    {greeting}, {user.name}.
                </h1>
            </header>

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

            {/* ── TODAY'S SESSIONS ── */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Today's Sessions</span>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            {sessions.map((s, i) => {
                                const pct = s.total > 0 ? Math.round((s.present / s.total) * 100) : 0;
                                const isActive = s.status === 'Active';
                                return (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-4 px-5">
                                            <div className="text-[14px] font-semibold text-[#111318] mb-1">{s.name}</div>
                                            <div className="text-[12px] text-[#6B6F76]">{s.time}</div>
                                        </td>
                                        <td className="py-4 px-5 w-1/3">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[13px] font-semibold text-[#111318] tabular-nums">
                                                    {s.present} <span className="text-[#6B6F76] font-normal">/ {s.total}</span>
                                                </span>
                                                {isActive && <span className="text-[12px] font-bold text-[#111318] tabular-nums">{pct}%</span>}
                                            </div>
                                            <div className="h-[4px] bg-gray-200 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full transition-all ${isActive ? 'bg-[#111318]' : 'bg-gray-300'}`} style={{ width: `${pct}%` }} />
                                            </div>
                                        </td>
                                        <td className="py-4 px-5 text-right">
                                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                                                isActive 
                                                ? 'text-emerald-600 bg-emerald-50 border border-emerald-100' 
                                                : 'text-[#6B6F76] bg-gray-100 border border-gray-200'
                                            }`}>
                                                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                                {s.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── MY CLASSES ── */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">My Classes</span>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            {classes.map((cls, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3.5 px-5">
                                        <span className="text-[14px] font-semibold text-[#111318]">{cls.name}</span>
                                        <span className="text-[13px] text-[#6B6F76] ml-2">— {cls.section}</span>
                                    </td>
                                    <td className="py-3.5 px-5 text-[12px] font-medium text-[#6B6F76] tabular-nums">
                                        <div className="flex items-center gap-1.5">
                                            <Users size={12} className="text-[#6B6F76]" />
                                            {cls.students}
                                        </div>
                                    </td>
                                    <td className="py-3.5 px-5 text-[12px] text-[#6B6F76] hidden sm:table-cell">{cls.schedule}</td>
                                    <td className="py-3.5 px-5 text-right w-24">
                                        {cls.today && (
                                            <span className="inline-flex text-[10px] font-bold text-[#D40000] bg-red-50 border border-red-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                Today
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ── SHORTCUTS ── */}
            <footer className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <span className="text-[12px] font-semibold text-[#6B6F76] uppercase tracking-wider pl-1">
                    Quick Actions
                </span>
                <div className="flex flex-wrap gap-2">
                    {shortcuts.map((s) => (
                        <a key={s} href="#" className="flex items-center gap-1 text-[12px] font-semibold text-[#111318] bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                            {s}
                            <ArrowUpRight size={12} className="text-[#6B6F76]" />
                        </a>
                    ))}
                </div>
            </footer>
        </DashboardLayout>
    );
}
