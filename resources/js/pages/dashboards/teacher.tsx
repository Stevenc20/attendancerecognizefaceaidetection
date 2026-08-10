import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Teacher Dashboard',
        href: '/teacher/dashboard',
    },
];

export default function TeacherDashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Teacher Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full items-center justify-center">
                            <h2 className="text-xl font-bold">My Classes</h2>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full items-center justify-center">
                            <h2 className="text-xl font-bold">Today's Sessions</h2>
                        </div>
                    </div>
                    <div className="border-sidebar-border/70 dark:border-sidebar-border relative aspect-video overflow-hidden rounded-xl border">
                        <div className="flex h-full items-center justify-center">
                            <h2 className="text-xl font-bold">Class Reports</h2>
                        </div>
                    </div>
                </div>
                <div className="border-sidebar-border/70 dark:border-sidebar-border relative min-h-[100vh] flex-1 rounded-xl border md:min-h-min p-6">
                    <h1 className="text-2xl font-bold mb-4">Welcome, Teacher</h1>
                    <p className="text-muted-foreground">View your assigned classes, create attendance sessions, and monitor student presence.</p>
                </div>
            </div>
        </AppLayout>
    );
}
