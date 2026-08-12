import React, { useState } from 'react';
import { Head, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { Fingerprint, Smartphone, Laptop, PlusCircle, Loader2 } from 'lucide-react';
import { usePasskeyRegister } from '@laravel/passkeys/react';

export default function StudentDevice() {
    const { auth, devices } = usePage().props as any;
    
    const { register, isLoading, error } = usePasskeyRegister({
        onSuccess: () => {
            router.reload();
        },
    });

    const handleRegisterDevice = async () => {
        const name = prompt("Enter a name for this device (e.g. My Phone):", "My Phone");
        if (name) {
            await register(name);
        }
    };

    return (
        <DashboardLayout role="student" userName={auth.user.name}>
            <Head title="My Device" />

            <header className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                        Modules
                    </p>
                    <h1 className="font-bold text-[#111318] leading-tight tracking-tight text-3xl">
                        My Device (Passkey)
                    </h1>
                </div>
                
                <button 
                    onClick={handleRegisterDevice}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 bg-[#D40000] hover:bg-[#8E0010] text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <PlusCircle size={18} />}
                    {isLoading ? "Registering..." : "Register New Device"}
                </button>
            </header>
            
            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100 text-sm font-medium">
                    {error}
                </div>
            )}

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden mb-6">
                <div className="p-5 border-b border-gray-50 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-[#111318]">Registered Biometrics</h2>
                        <p className="text-sm text-[#6B6F76] mt-1">Manage devices allowed to login without a password.</p>
                    </div>
                </div>
                
                <div className="divide-y divide-gray-50">
                    {devices && devices.length > 0 ? (
                        devices.map((device: any) => {
                            const isMobile = device.name?.toLowerCase().includes('phone') || device.name?.toLowerCase().includes('mobile');
                            return (
                                <div key={device.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                                            {isMobile ? <Smartphone size={24} /> : <Laptop size={24} />}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[#111318] text-lg mb-1">{device.name}</h3>
                                            <p className="text-sm text-[#6B6F76] flex items-center gap-1.5">
                                                <Fingerprint size={14} /> Passkey Credential
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider mb-1">Added On</p>
                                        <p className="text-sm font-medium text-[#111318]">
                                            {new Date(device.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-16 text-center flex flex-col items-center justify-center">
                            <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4 border border-gray-100">
                                <Fingerprint className="text-gray-400" size={32} />
                            </div>
                            <h3 className="text-lg font-bold text-[#111318] mb-2">No Devices Registered</h3>
                            <p className="text-sm text-[#6B6F76] max-w-sm mb-6">
                                You haven't registered any biometric devices yet. Register your phone or laptop to enable fast and secure passwordless login.
                            </p>
                        </div>
                    )}
                </div>
            </section>
        </DashboardLayout>
    );
}
