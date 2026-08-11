import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ArrowUpRight, Camera, Smartphone } from 'lucide-react';

export default function SuperAdminDashboard() {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'super_admin';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const metrics = [
        { id: 'Students', value: '1,240', sub: '+42 enrolled this month' },
        { id: 'Admins', value: '4', sub: 'System administrators' },
        { id: 'Classes', value: '36', sub: 'Across 12 grade levels' },
        { id: 'Sessions', value: '24', sub: 'Active attendance sessions' },
    ];

    const liveActivity = [
        { time: '07:32', name: 'Steven Christian', cls: 'XII RPL 1', method: 'Face' },
        { time: '07:32', name: 'Andi Pratama', cls: 'XII RPL 1', method: 'Face' },
        { time: '07:33', name: 'Muhammad Rizky', cls: 'XI DKV 2', method: 'Face' },
        { time: '07:34', name: 'Siti Rahma', cls: 'X RPL 1', method: 'QR' },
        { time: '07:34', name: 'Budi Santoso', cls: 'XII TKJ 1', method: 'Face' },
        { time: '07:35', name: 'Dewi Lestari', cls: 'XI RPL 2', method: 'Face' },
    ];

    const stations = [
        { id: 'ST-001', name: 'Main Entrance', status: 'Online', count: 184, time: '07:41' },
        { id: 'ST-002', name: 'Building A', status: 'Online', count: 291, time: '07:42' },
        { id: 'ST-003', name: 'Building B', status: 'Offline', count: 0, time: '—' },
    ];

    const shortcuts = ['Student Data', 'Class Management', 'Attendance Records', 'Station Setup'];

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Super Admin — SMKN 40" />

            {/* ── HEADER ── */}
            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Administration Dashboard
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    {greeting}, {user.name}.
                </h1>
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

            {/* ── TODAY'S ATTENDANCE ── */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 overflow-hidden">
                <div className="p-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                    <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">
                        Today's Attendance Overview
                    </span>
                    <span className="text-[11px] font-medium text-[#6B6F76] bg-white px-2 py-1 rounded border border-gray-200">
                        Total 1,240 Students
                    </span>
                </div>

                <div className="p-5 grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-center">
                    <div className="md:col-span-2">
                        <div className="flex items-baseline gap-2 mb-1">
                            <span className="font-bold text-[#111318] leading-none tabular-nums" style={{ fontSize: 'clamp(2.5rem, 2rem + 2vw, 3.5rem)' }}>
                                1,086
                            </span>
                            <span className="font-bold text-[#D40000] text-xl">
                                87.6%
                            </span>
                        </div>
                        <p className="text-[13px] text-[#6B6F76] font-medium">
                            Students have arrived today
                        </p>
                    </div>
                    
                    <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: 'Present', pct: 87.6, count: '1,086', color: 'bg-[#111318]' },
                            { label: 'Late', pct: 7.6, count: '94', color: 'bg-[#F05A00]' },
                            { label: 'Absent', pct: 4.8, count: '60', color: 'bg-[#D40000]' },
                        ].map((b) => (
                            <div key={b.label} className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">{b.label}</span>
                                    <span className="text-[14px] font-bold text-[#111318] tabular-nums leading-none">{b.count}</span>
                                </div>
                                <div className="h-[4px] bg-gray-200 rounded-full overflow-hidden">
                                    <div className={`h-full rounded-full ${b.color}`} style={{ width: `${b.pct}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── OPERATIONAL GRID ── */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                
                {/* Live Activity */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-[#D40000] animate-pulse" />
                            <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Live Activity</span>
                        </div>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {liveActivity.map((item, i) => (
                                    <tr key={i} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-2.5 px-4 text-[12px] font-medium text-[#6B6F76] tabular-nums w-16">{item.time}</td>
                                        <td className="py-2.5 px-2 text-[13px] font-semibold text-[#111318]">{item.name}</td>
                                        <td className="py-2.5 px-2 text-[12px] text-[#6B6F76] hidden sm:table-cell w-20">{item.cls}</td>
                                        <td className="py-2.5 px-4 w-24 text-right">
                                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#6B6F76] bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                                                {item.method === 'Face' ? <Camera size={10} /> : <Smartphone size={10} />}
                                                {item.method}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#111318] uppercase tracking-wider">Attendance Stations</span>
                    </div>
                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {stations.map((s, i) => (
                                    <tr key={s.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="text-[13px] font-semibold text-[#111318] mb-0.5">{s.name}</div>
                                            <div className="text-[11px] text-[#6B6F76] font-mono">{s.id}</div>
                                        </td>
                                        <td className="py-3 px-2 text-center">
                                            <span className={`inline-flex text-[10px] font-medium px-2 py-0.5 rounded-full ${s.status === 'Online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-[#D40000] border border-red-100'}`}>
                                                {s.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="text-[13px] font-semibold text-[#111318]">
                                                {s.count > 0 ? `${s.count} scans` : 'Inactive'}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
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
