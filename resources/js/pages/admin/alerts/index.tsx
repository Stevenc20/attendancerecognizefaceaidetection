import { Head, usePage, router } from '@inertiajs/react';
import DashboardLayout from '@/layouts/dashboard-layout';
import { ShieldAlert, AlertTriangle, CheckCircle } from 'lucide-react';

export default function SecurityAlerts() {
    const { auth, alerts } = usePage().props as any;

    const resolveAlert = (id: number) => {
        if (confirm('Mark this alert as resolved?')) {
            router.post(`/admin/alerts/${id}/resolve`);
        }
    };

    return (
        <DashboardLayout role="admin" userName={auth.user.name}>
            <Head title="Security Alerts" />

            <header className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <p className="text-[12px] font-medium text-[#6B6F76] uppercase tracking-[0.1em] mb-1">
                        Modules
                    </p>
                    <h1 className="font-bold text-[#D40000] leading-tight tracking-tight text-3xl flex items-center gap-2">
                        <ShieldAlert size={28} />
                        Security Alerts
                    </h1>
                </div>
            </header>

            <section className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col">
                <div className="p-5 border-b border-gray-50 bg-gray-50/50">
                    <h2 className="text-xl font-bold text-[#111318]">Recent Activity</h2>
                    <p className="text-sm text-[#6B6F76] mt-1">Logs of suspicious or unauthorized activities detected by the scanner.</p>
                </div>
                
                <div className="flex-1 divide-y divide-gray-50">
                    {alerts && alerts.length > 0 ? (
                        alerts.map((alert: any) => {
                            const isResolved = !!alert.resolved_at;
                            return (
                                <div key={alert.id} className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${isResolved ? 'bg-white opacity-60' : 'bg-red-50/30'}`}>
                                    <div className="flex gap-4">
                                        <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${isResolved ? 'bg-gray-100 text-gray-500' : 'bg-red-100 text-red-600'}`}>
                                            {isResolved ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-[#111318] capitalize">
                                                    {alert.type.replace(/_/g, ' ')}
                                                </h3>
                                                <span className="text-[11px] font-medium text-[#6B6F76]">
                                                    {new Date(alert.created_at).toLocaleString('id-ID')}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#111318]">{alert.description}</p>
                                            <p className="text-xs text-[#6B6F76] mt-1">Device: {alert.device_id || 'Unknown'}</p>
                                        </div>
                                    </div>
                                    
                                    {!isResolved && (
                                        <button 
                                            onClick={() => resolveAlert(alert.id)}
                                            className="self-start sm:self-center bg-white border border-gray-200 hover:bg-gray-50 text-[#111318] text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Resolve
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-12 text-center text-[#6B6F76] text-sm flex flex-col items-center">
                            <ShieldAlert size={32} className="text-emerald-500/50 mb-3" />
                            All clear! No security alerts recorded.
                        </div>
                    )}
                </div>
            </section>
        </DashboardLayout>
    );
}
