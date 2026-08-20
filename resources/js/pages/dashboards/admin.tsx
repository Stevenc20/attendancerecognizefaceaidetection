import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ArrowUpRight, Camera, Smartphone, ScanLine } from 'lucide-react';

export default function AdminDashboard({ metrics, recentActivity }: { metrics: any[], recentActivity: any[] }) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'admin';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const activeSessions: any[] = []; // Hidden for now

    const shortcuts = [
        { label: 'Add Student', href: '/admin/students' },
        { label: 'Create Session', href: '/admin/sessions' },
        { label: 'View Reports', href: '/admin/reports' },
        { label: 'Security Alerts', href: '/admin/alerts' },
    ];

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Admin — SMKN 40" />

            {/* ✨ HEADER ✨ */}
            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                        Management Dashboard
                    </p>
                    <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                        {greeting}, {user.name}.
                    </h1>
                </div>
                <div className="flex gap-3 mt-4 lg:mt-0">
                    <a href="/admin/scanner" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#080B1A] hover:bg-gray-800 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(8,11,26,0.4)] hover:-translate-y-0.5">
                        <Camera size={20} />
                        Launch Face AI
                    </a>
                    <a href="/admin/qr-scanner" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D40000] hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-[0_4px_14px_rgba(212,0,0,0.4)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(212,0,0,0.6)]">
                        <ScanLine size={20} />
                        Launch QR Scanner
                    </a>
                </div>
            </header>

            {/* ── METRICS ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

            {/* ACTIVE SESSIONS - Hidden until feature is built */}
            {activeSessions.length > 0 && (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Active Sessions</span>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {activeSessions.map((s, i) => {
                                    const pct = Math.round((s.present / s.total) * 100);
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
                                                    <span className="text-[12px] font-bold text-[#111318] tabular-nums">{pct}%</span>
                                                </div>
                                                <div className="h-[4px] bg-gray-200 rounded-full overflow-hidden">
                                                    <div className="h-full bg-[#111318] rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-emerald-600 uppercase tracking-wider bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-full">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
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
            )}

            {/* ── RECENT ACTIVITY ── */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#D40000] animate-pulse" />
                    <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Live Feed</span>
                </div>
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <tbody>
                            {recentActivity.map((item, i) => (
                                <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                    <td className="py-3.5 px-5 text-[12px] font-medium text-[#6B6F76] tabular-nums w-20">{item.time}</td>
                                    <td className="py-3.5 px-3 text-[13px] font-semibold text-[#111318]">{item.name}</td>
                                    <td className="py-3.5 px-3 text-[12px] text-[#6B6F76] hidden sm:table-cell">{item.cls}</td>
                                    <td className="py-3.5 px-3 text-center">
                                        <span className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-md ${
                                            item.status === 'Present' ? 'bg-gray-100 text-[#111318]' : 'bg-orange-50 text-[#F05A00] border border-orange-100'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-5 text-right">
                                        <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-[#6B6F76] bg-gray-50 px-2 py-1 rounded border border-gray-100">
                                            {item.method === 'Face' ? <Camera size={10} /> : <Smartphone size={10} />}
                                            {item.method}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* ✨ SHORTCUTS ✨ */}
            <footer className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <span className="text-[12px] font-semibold text-[#6B6F76] uppercase tracking-wider pl-1">
                    Quick Actions
                </span>
                <div className="flex flex-wrap gap-2">
                    {shortcuts.map((s) => (
                        <a key={s.label} href={s.href} className="flex items-center gap-1 text-[12px] font-semibold text-[#111318] bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors">
                            {s.label}
                            <ArrowUpRight size={12} className="text-[#6B6F76]" />
                        </a>
                    ))}
                </div>
            </footer>
        </DashboardLayout>
    );
}
