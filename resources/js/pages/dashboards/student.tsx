import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { CheckCircle, XCircle, Clock, ShieldCheck, QrCode, Fingerprint, CalendarCheck } from 'lucide-react';

export default function StudentDashboard() {
    const { auth, hasEnrolled, hasPasskey, stats, todayRecord, recentAttendances } = usePage().props as any;

    const currentMonth = new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' });

    return (
        <DashboardLayout role="student" userName={auth.user.name}>
            <Head title="Student Dashboard" />

            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow-sm border border-blue-100 p-8 mb-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-md">
                <div>
                    <h1 className="text-[#111318] font-bold text-2xl md:text-3xl mb-2">Welcome back, {auth.user.name}!</h1>
                    <p className="text-[#6B6F76]">Here is your attendance summary for {currentMonth}.</p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-[#6B6F76] uppercase tracking-wider mb-1">Today's Date</p>
                    <p className="font-bold text-[#111318] text-xl">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* Left Column: Stats & Status */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Today's Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h2 className="text-lg font-bold text-[#111318] mb-1">Today's Status</h2>
                            <p className="text-sm text-[#6B6F76]">Your recorded attendance for today.</p>
                        </div>
                        
                        {todayRecord ? (
                            <div className={`px-6 py-3 rounded-full flex items-center gap-3 ${
                                todayRecord.status === 'Present' ? 'bg-emerald-50 text-emerald-600' :
                                todayRecord.status === 'Late' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                            }`}>
                                {todayRecord.status === 'Present' ? <CheckCircle size={24} /> :
                                 todayRecord.status === 'Late' ? <Clock size={24} /> : <XCircle size={24} />}
                                <span className="font-bold text-lg uppercase tracking-wider">{todayRecord.status}</span>
                                <span className="text-sm border-l border-current pl-3 opacity-80">{todayRecord.time_in}</span>
                            </div>
                        ) : (
                            <div className="px-6 py-3 rounded-full flex items-center gap-3 bg-gray-50 text-gray-500 border border-gray-200">
                                <Clock size={24} />
                                <span className="font-bold text-lg uppercase tracking-wider">Not Recorded</span>
                            </div>
                        )}
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-blue-500 transition-transform hover:scale-[1.02]">
                            <p className="text-[12px] font-semibold text-[#6B6F76] uppercase tracking-wider mb-1">Attendance Rate</p>
                            <p className="text-2xl font-bold text-[#111318]">{stats.rate}%</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-emerald-500 transition-transform hover:scale-[1.02]">
                            <p className="text-[12px] font-semibold text-[#6B6F76] uppercase tracking-wider mb-1">Present</p>
                            <p className="text-2xl font-bold text-emerald-600">{stats.present}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-amber-500 transition-transform hover:scale-[1.02]">
                            <p className="text-[12px] font-semibold text-[#6B6F76] uppercase tracking-wider mb-1">Late</p>
                            <p className="text-2xl font-bold text-amber-500">{stats.late}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 border-l-4 border-l-red-500 transition-transform hover:scale-[1.02]">
                            <p className="text-[12px] font-semibold text-[#6B6F76] uppercase tracking-wider mb-1">Absent</p>
                            <p className="text-2xl font-bold text-red-500">{stats.absent}</p>
                        </div>
                    </div>

                    {/* Recent History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-5 border-b border-gray-50 flex justify-between items-center">
                            <h2 className="font-bold text-[#111318]">Recent Attendance</h2>
                            <Link href="/student/history" className="text-sm font-semibold text-[#D40000] hover:underline">View All</Link>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {recentAttendances && recentAttendances.length > 0 ? (
                                recentAttendances.map((record: any) => (
                                    <div key={record.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                                <CalendarCheck size={18} />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-[#111318]">
                                                    {new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                                </p>
                                                <p className="text-xs text-[#6B6F76]">Method: <span className="uppercase">{record.method}</span></p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold text-sm uppercase tracking-wider ${
                                                record.status === 'Present' ? 'text-emerald-600' :
                                                record.status === 'Late' ? 'text-amber-500' : 'text-red-500'
                                            }`}>
                                                {record.status}
                                            </p>
                                            <p className="text-xs font-semibold text-[#6B6F76]">{record.time_in}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-[#6B6F76] text-sm">No recent attendance records found.</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Cards */}
                <div className="space-y-6">
                    {/* Face Enrollment Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${hasEnrolled ? 'bg-emerald-50 text-emerald-500' : 'bg-red-50 text-red-500'}`}>
                            {hasEnrolled ? <ShieldCheck size={32} /> : <XCircle size={32} />}
                        </div>
                        <h3 className="font-bold text-[#111318] text-lg mb-1">Face Recognition</h3>
                        <p className="text-sm text-[#6B6F76] mb-4">
                            {hasEnrolled 
                                ? "Your face data is registered and active for the AI Scanner." 
                                : "You haven't registered your face data yet. Please enroll to use the scanner."}
                        </p>
                        
                        <Link 
                            href="/student/face-enrollment" 
                            className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                                hasEnrolled 
                                ? 'bg-gray-100 text-[#111318] hover:bg-gray-200' 
                                : 'bg-[#D40000] text-white hover:bg-[#8E0010]'
                            }`}
                        >
                            {hasEnrolled ? 'Update Face Data' : 'Register Now'}
                        </Link>
                    </div>

                    {/* Biometric/Passkey Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center transition-all hover:shadow-md">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${hasPasskey ? 'bg-blue-50 text-blue-500' : 'bg-gray-50 text-gray-400'}`}>
                            <Fingerprint size={32} />
                        </div>
                        <h3 className="font-bold text-[#111318] text-lg mb-1">Biometric Login</h3>
                        <p className="text-sm text-[#6B6F76] mb-4">
                            {hasPasskey 
                                ? "You have registered a Passkey (Fingerprint/FaceID) for secure login." 
                                : "Register your device's fingerprint or FaceID for passwordless login."}
                        </p>
                        
                        <Link 
                            href="/student/device" 
                            className="w-full py-2.5 rounded-lg text-sm font-semibold bg-gray-100 text-[#111318] hover:bg-gray-200 transition-colors"
                        >
                            Manage Devices
                        </Link>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
