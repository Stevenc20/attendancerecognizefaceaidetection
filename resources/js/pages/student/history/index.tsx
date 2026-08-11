import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { History } from 'lucide-react';

export default function AttendanceHistory() {
    const { auth } = usePage().props as any;

    return (
        <DashboardLayout role="student" userName={auth.user.name}>
            <Head title="Attendance History — SMKN 40" />

            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Student Portal
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    Attendance History.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    View your daily attendance logs and performance.
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                    <History className="text-gray-400" size={24} />
                </div>
                <h2 className="text-[#111318] font-bold text-lg mb-2">Coming Soon</h2>
                <p className="text-[#6B6F76] text-sm max-w-sm mx-auto">
                    The Attendance History module is currently under construction. Please check back later.
                </p>
            </div>
        </DashboardLayout>
    );
}
