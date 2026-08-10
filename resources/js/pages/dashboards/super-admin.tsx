import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Super Admin Dashboard',
        href: '/super-admin/dashboard',
    },
];

export default function SuperAdminDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full items-center justify-center">
                            <h2 className="text-xl font-bold">School Setup</h2>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full items-center justify-center">
                            <h2 className="text-xl font-bold">Admin Management</h2>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full items-center justify-center">
                            <h2 className="text-xl font-bold">System Settings</h2>
                        </div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome, Super Admin</h1>
                    <p className="text-muted-foreground">You have full access to configure the academic year, grades, majors, and classes.</p>
                </div>
            </div>
        </AppLayout>
    );
}
