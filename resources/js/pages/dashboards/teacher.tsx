import { Head, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ArrowUpRight, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function TeacherDashboard() {
    const { auth, homeroomClass, dates, attendanceMatrix, classMetrics } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'teacher';

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    const metrics = [
        { id: 'Total Students', value: classMetrics?.total_students || 0, sub: 'In Homeroom Class' },
        { id: 'Present Today', value: classMetrics?.present_today || 0, sub: 'Attendance Recorded' },
        { id: 'Absent Today', value: classMetrics?.absent_today || 0, sub: 'No Attendance Recorded' },
    ];

    const shortcuts = [
        'Start Class Session',
        'Input Grades',
        'Message Students',
        'View Schedule'
    ];

    const getStatusIcon = (status: string, studentId: number, date: string) => {
        let icon;
        switch(status) {
            case 'Present': icon = <CheckCircle className="text-emerald-500 mx-auto" size={16} />; break;
            case 'Late': icon = <Clock className="text-amber-500 mx-auto" size={16} />; break;
            case 'Absent': icon = <XCircle className="text-red-500/50 mx-auto" size={16} />; break;
            default: icon = <span className="text-gray-300">-</span>; break;
        }

        const handleToggle = () => {
            const nextStatus = status === 'Present' ? 'Late' : (status === 'Late' ? 'Absent' : 'Present');
            router.post('/teacher/attendance', {
                user_id: studentId,
                date: date,
                status: nextStatus
            }, { preserveScroll: true, preserveState: true });
        };

        return (
            <button onClick={handleToggle} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors focus:outline-none" title={`Click to change. Current: ${status}`}>
                {icon}
            </button>
        );
    };

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="Teacher Dashboard" />

            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Teaching Dashboard
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    {greeting}, {user.name}.
                </h1>
            </header>

            {/* METRICS */}
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

            {/* HOMEROOM ATTENDANCE MATRIX */}
            {homeroomClass ? (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                            <span className="text-[12px] font-semibold text-[#D40000] uppercase tracking-wider block mb-1">Wali Kelas</span>
                            <h2 className="text-lg font-bold text-[#111318]">{homeroomClass.name}</h2>
                        </div>
                        <div className="flex items-center gap-4 text-[13px] font-medium text-[#6B6F76]">
                            <span className="flex items-center gap-1"><CheckCircle className="text-emerald-500" size={14}/> Present</span>
                            <span className="flex items-center gap-1"><Clock className="text-amber-500" size={14}/> Late</span>
                            <span className="flex items-center gap-1"><XCircle className="text-red-500/50" size={14}/> Absent</span>
                        </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white sticky left-0 z-10 w-64 shadow-[1px_0_0_#f3f4f6]">
                                        Student Name
                                    </th>
                                    {dates && dates.map((date: string) => {
                                        const d = new Date(date);
                                        return (
                                            <th key={date} className="py-3 px-4 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 text-center min-w-[80px]">
                                                {d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                                            </th>
                                        );
                                    })}
                                </tr>
                            </thead>
                            <tbody>
                                {attendanceMatrix && attendanceMatrix.length > 0 ? (
                                    attendanceMatrix.map((student: any) => (
                                        <tr key={student.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-3 px-5 border-r border-gray-50 bg-white/50 sticky left-0 z-10 shadow-[1px_0_0_#f3f4f6]">
                                                <div className="text-[13px] font-semibold text-[#111318] truncate w-60">{student.name}</div>
                                                <div className="text-[11px] text-[#6B6F76]">{student.nis}</div>
                                            </td>
                                            {dates && dates.map((date: string) => (
                                                <td key={date} className="py-2 px-2 text-center border-r border-gray-50 last:border-0">
                                                    {getStatusIcon(student.attendances[date], student.id, date)}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={(dates?.length || 0) + 1} className="py-8 text-center text-[#6B6F76] text-sm">
                                            No students found in this class.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            ) : (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 p-8 text-center flex flex-col items-center justify-center">
                    <Users className="text-gray-300 mb-3" size={48} />
                    <h2 className="text-lg font-bold text-[#111318] mb-1">No Homeroom Class Assigned</h2>
                    <p className="text-sm text-[#6B6F76] max-w-md">You are not currently assigned as a Wali Kelas (Homeroom Teacher) for any classroom.</p>
                </section>
            )}

            {/* SHORTCUTS */}
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
