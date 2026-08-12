import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Users, GraduationCap } from 'lucide-react';

export default function TeacherClasses() {
    const { auth, homeroomClass, students } = usePage().props as any;
    const user = auth.user;
    const role = user.role || 'teacher';

    return (
        <DashboardLayout role={role} userName={user.name}>
            <Head title="My Classes" />

            <header className="mb-6">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Teacher
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                    My Classes
                </h1>
            </header>

            {homeroomClass ? (
                <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                    <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                        <span className="text-[12px] font-semibold text-[#D40000] uppercase tracking-wider block mb-1">Wali Kelas</span>
                        <h2 className="text-xl font-bold text-[#111318]">{homeroomClass.name}</h2>
                        <p className="text-sm text-[#6B6F76] mt-1">Total {students?.length || 0} Students</p>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[600px]">
                            <thead>
                                <tr>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                        Student Name
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white">
                                        NIS / Identifier
                                    </th>
                                    <th className="py-3 px-5 text-[11px] font-semibold text-[#6B6F76] uppercase tracking-wider border-b border-gray-100 bg-white text-right">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {students && students.length > 0 ? (
                                    students.map((student: any) => (
                                        <tr key={student.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                                            <td className="py-4 px-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                                        <GraduationCap size={16} />
                                                    </div>
                                                    <div className="text-[14px] font-semibold text-[#111318]">{student.name}</div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-5 text-[13px] text-[#6B6F76] tabular-nums">
                                                {student.nis || student.email}
                                            </td>
                                            <td className="py-4 px-5 text-right">
                                                <span className="inline-flex text-[10px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="py-8 text-center text-[#6B6F76] text-sm">
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
        </DashboardLayout>
    );
}
