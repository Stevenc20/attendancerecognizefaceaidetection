import React from 'react';
import { Head, usePage } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ShieldAlert } from 'lucide-react';

export default function SecurityAlerts() {
    const { auth } = usePage().props as any;

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title="Security Alerts — SMKN 40" />

            <header className="mb-8">
                <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                    Modules
                </p>
                <h1 className="font-bold text-[#111318] leading-tight tracking-tight" style={{ fontSize: 'clamp(2rem, 1.5rem + 2vw, 2.5rem)' }}>
                    Security Alerts.
                </h1>
                <p className="text-[14px] text-[#6B6F76] font-medium mt-1">
                    Monitor spoofing attempts and unrecognized faces.
                </p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col items-center justify-center py-24 text-center">
                <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mb-4">
                    <ShieldAlert className="text-gray-400" size={24} />
                </div>
                <h2 className="text-[#111318] font-bold text-lg mb-2">Coming Soon</h2>
                <p className="text-[#6B6F76] text-sm max-w-sm mx-auto">
                    The Security Alerts module is currently under construction. Please check back later.
                </p>
            </div>
        </DashboardLayout>
    );
}
