import { Head } from '@inertiajs/react';

/**
 * Registration is disabled.
 * Students are enrolled by Admin/Super Admin.
 * This page is kept as a stub to prevent build errors.
 */
export default function Register() {
    return (
        <>
            <Head title="Registration Disabled" />
            <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
                <div className="text-center p-10 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-md">
                    <h1 className="text-2xl font-bold text-[#080B1A] mb-4">Registration Disabled</h1>
                    <p className="text-gray-500 mb-6">
                        Student accounts are created by school administrators. 
                        Please contact your school admin if you need an account.
                    </p>
                    <a href="/login" className="inline-block px-6 py-3 bg-[#D40000] text-white font-medium rounded-xl hover:bg-[#8E0010] transition-colors">
                        Go to Login
                    </a>
                </div>
            </div>
        </>
    );
}
