import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { 
    LayoutGrid, Building2, Calendar, Users, Settings, 
    GraduationCap, UserCog, ClipboardList, ShieldAlert, BarChart3, 
    BookOpen, History, User, Smartphone, LogOut, Menu, X, ChevronRight,
    PanelLeftClose, PanelLeft, UploadCloud, Camera, ScanLine
} from 'lucide-react';

interface DashboardLayoutProps {
    role: string;
    userName: string;
    children: React.ReactNode;
}

const getDashboardUrl = (role: string) => {
    switch (role?.toLowerCase()) {
        case 'super_admin': return '/super-admin/dashboard';
        case 'admin': return '/admin/dashboard';
        case 'teacher': return '/teacher/dashboard';
        case 'student': return '/student/dashboard';
        case 'piket': return '/piket/dashboard';
        default: return '/dashboard';
    }
};

const getNavItems = (role: string) => {
    const dashboardUrl = getDashboardUrl(role);
    switch (role?.toLowerCase()) {
        case 'super_admin':
            return [
                { name: 'Dashboard', icon: LayoutGrid, href: dashboardUrl },
                { name: 'School Setup', icon: Building2, href: '/super-admin/schools' },
                { name: 'Academic Year', icon: Calendar, href: '/super-admin/academic-years' },
                { name: 'Admin Management', icon: Users, href: '/super-admin/admins' },
                { name: 'System Settings', icon: Settings, href: '/super-admin/settings' },
            ];
        case 'piket':
            return [
                { name: 'Dashboard Piket', icon: LayoutGrid, href: dashboardUrl },
                { name: 'QR Scanner', icon: ScanLine, href: '/admin/qr-scanner' },
            ];
        case 'admin':
            return [
                { name: 'Dashboard', icon: LayoutGrid, href: dashboardUrl },
                { name: 'Face AI', icon: Camera, href: '/admin/scanner' },
                { name: 'QR Scanner', icon: ScanLine, href: '/admin/qr-scanner' },
                { name: 'Student Management', icon: GraduationCap, href: '/admin/students' },
                { name: 'Teacher Management', icon: UserCog, href: '/admin/teachers' },
                { name: 'Data Import', icon: UploadCloud, href: '/admin/import' },
                { name: 'Attendance Sessions', icon: ClipboardList, href: '/admin/sessions' },
                { name: 'Security Alerts', icon: ShieldAlert, href: '/admin/alerts' },
                { name: 'Reports', icon: BarChart3, href: '/admin/reports' },
            ];
        case 'teacher':
            return [
                { name: 'Dashboard', icon: LayoutGrid, href: dashboardUrl },
                { name: 'My Classes', icon: BookOpen, href: '/teacher/classes' },
                { name: 'Attendance Sessions', icon: ClipboardList, href: '/teacher/sessions' },
                { name: 'Class Reports', icon: BarChart3, href: '/teacher/reports' },
            ];
        case 'student':
            return [
                { name: 'Dashboard', icon: LayoutGrid, href: dashboardUrl },
                { name: 'Attendance History', icon: History, href: '/student/history' },
                { name: 'My Profile', icon: User, href: '/student/profile' },
                { name: 'My Device', icon: Smartphone, href: '/student/device' },
            ];
        default:
            return [{ name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' }];
    }
};

/** Decorative SVG vectors for the sidebar background */
function SidebarVectors({ collapsed }: { collapsed: boolean }) {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
            <svg className="absolute -top-16 -right-16 opacity-[0.04]" width="220" height="220" viewBox="0 0 220 220">
                <circle cx="110" cy="110" r="100" stroke="#D40000" strokeWidth="2" fill="none" />
                <circle cx="110" cy="110" r="70" stroke="#D40000" strokeWidth="1.5" fill="none" />
                <circle cx="110" cy="110" r="40" stroke="#D40000" strokeWidth="1" fill="none" />
            </svg>
            <svg className="absolute top-32 left-3 opacity-[0.06]" width="60" height="100" viewBox="0 0 60 100">
                {[...Array(5)].map((_, row) =>
                    [...Array(3)].map((_, col) => (
                        <circle key={`${row}-${col}`} cx={10 + col * 20} cy={10 + row * 20} r="2" fill="#080B1A" />
                    ))
                )}
            </svg>
            {!collapsed && (
                <svg className="absolute top-1/2 -translate-y-1/2 right-2 opacity-[0.03]" width="80" height="160" viewBox="0 0 80 160">
                    <line x1="0" y1="0" x2="80" y2="80" stroke="#D40000" strokeWidth="1" />
                    <line x1="0" y1="20" x2="80" y2="100" stroke="#D40000" strokeWidth="1" />
                    <line x1="0" y1="40" x2="80" y2="120" stroke="#D40000" strokeWidth="1" />
                    <line x1="0" y1="60" x2="80" y2="140" stroke="#D40000" strokeWidth="1" />
                    <line x1="0" y1="80" x2="80" y2="160" stroke="#D40000" strokeWidth="1" />
                </svg>
            )}
            <svg className="absolute -bottom-8 -left-8 opacity-[0.04]" width="140" height="140" viewBox="0 0 140 140">
                <polygon points="0,140 70,0 140,140" stroke="#F05A00" strokeWidth="1.5" fill="none" />
                <polygon points="20,140 70,30 120,140" stroke="#F05A00" strokeWidth="1" fill="none" />
            </svg>
            <svg className="absolute bottom-40 right-6 opacity-[0.05]" width="40" height="40" viewBox="0 0 40 40">
                <line x1="20" y1="5" x2="20" y2="35" stroke="#080B1A" strokeWidth="2" />
                <line x1="5" y1="20" x2="35" y2="20" stroke="#080B1A" strokeWidth="2" />
            </svg>
            {!collapsed && (
                <svg className="absolute top-64 left-6 opacity-[0.04]" width="30" height="34" viewBox="0 0 30 34">
                    <polygon points="15,0 30,8.5 30,25.5 15,34 0,25.5 0,8.5" stroke="#D40000" strokeWidth="1.5" fill="none" />
                </svg>
            )}
            <svg className="absolute bottom-20 right-3 opacity-[0.03]" width="50" height="50" viewBox="0 0 50 50">
                <circle cx="25" cy="25" r="20" stroke="#080B1A" strokeWidth="1.5" fill="none" strokeDasharray="4 4" />
            </svg>
        </div>
    );
}

export default function DashboardLayout({ role, userName, children }: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const navItems = getNavItems(role);
    const { url } = usePage();

    React.useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [sidebarOpen]);

    const handleLogout = (e: React.MouseEvent) => {
        e.preventDefault();
        router.post('/logout');
    };

    const sidebarWidth = collapsed ? 72 : 260;

    return (
        <div className="min-h-screen bg-[#F7F7F5]" style={{ fontFamily: "'Instrument Sans', system-ui, sans-serif" }}>
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div 
                    className="fixed inset-0 z-40 bg-black/20 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar — fixed on desktop, drawer on mobile */}
            <aside
                className={`
                    print:hidden
                    fixed inset-y-0 left-0 z-50 flex flex-col bg-[#FAFAFA]
                    border-r border-[#E5E5E2] h-[100dvh]
                    transition-all duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
                `}
                style={{ width: `${sidebarWidth}px` }}
            >
                {/* Decorative Vectors */}
                <SidebarVectors collapsed={collapsed} />

                {/* Brand header */}
                <div className={`relative z-10 h-[72px] flex items-center border-b border-[#E5E5E2]/70 flex-shrink-0 ${collapsed ? 'px-3 justify-center' : 'px-5'}`}>
                    <div className="flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100 w-11 h-11 flex-shrink-0">
                        <img 
                            src="/images/logo-smkn40.png" 
                            alt="SMKN 40" 
                            className="h-7 w-7 rounded object-contain"
                        />
                    </div>
                    {!collapsed && (
                        <div className="ml-3">
                            <div className="font-bold text-[15px] text-[#080B1A] leading-tight tracking-tight">SMKN 40</div>
                            <div className="text-[11px] font-semibold text-[#D40000] tracking-wide">ATTENDANCE</div>
                        </div>
                    )}
                    <button 
                        className={`p-2 text-[#6B6F76] hover:text-[#D40000] hover:bg-red-50 rounded-lg transition-all lg:hidden ${collapsed ? '' : 'ml-auto'}`}
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Navigation — scrollable middle area */}
                <nav className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-0.5 min-h-0">
                    {!collapsed && (
                        <div className="px-3 mb-3 text-[10px] font-bold text-[#6B6F76]/60 uppercase tracking-[0.2em]">
                            Menu
                        </div>
                    )}
                    {navItems.map((item) => {
                        const isActive = item.href !== '#' && url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                title={collapsed ? item.name : undefined}
                                className={`
                                    flex items-center rounded-xl transition-all duration-200 group relative
                                    ${collapsed ? 'justify-center py-3 px-0 mx-auto' : 'px-3 py-2.5'}
                                    ${isActive 
                                        ? 'bg-white text-[#D40000] font-semibold shadow-sm border border-gray-100' 
                                        : 'text-[#6B6F76] hover:bg-[#E5E5E2]/50 hover:text-[#111318] border border-transparent'}
                                `}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-[#D40000] rounded-r-full" />
                                )}
                                <item.icon 
                                    size={collapsed ? 20 : 18} 
                                    strokeWidth={isActive ? 2.2 : 1.8}
                                    className={`flex-shrink-0 ${!collapsed ? 'mr-3' : ''} ${isActive ? 'text-[#D40000]' : 'text-[#6B6F76] group-hover:text-[#111318]'} transition-colors`} 
                                />
                                {!collapsed && (
                                    <>
                                        <span className="text-[13px] transition-transform whitespace-nowrap">{item.name}</span>
                                        {isActive && <ChevronRight size={14} className="ml-auto text-[#D40000] flex-shrink-0" />}
                                    </>
                                )}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse toggle — pinned */}
                <div className="relative z-10 hidden lg:flex px-3 py-2 border-t border-[#E5E5E2]/70 flex-shrink-0">
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className={`flex items-center text-[#6B6F76] hover:text-[#111318] hover:bg-gray-200/50 rounded-xl transition-all duration-200 group ${collapsed ? 'w-full justify-center py-2.5' : 'w-full px-3 py-2.5'}`}
                        title={collapsed ? "Expand" : "Collapse"}
                    >
                        {collapsed ? <PanelLeft size={18} /> : (
                            <>
                                <PanelLeftClose size={16} className="mr-2.5" />
                                <span className="text-xs font-medium">Collapse</span>
                            </>
                        )}
                    </button>
                </div>

                {/* User info & logout — pinned to bottom */}
                <div className={`relative z-10 border-t border-[#E5E5E2]/70 flex-shrink-0 ${collapsed ? 'p-2' : 'p-3'}`}>
                    {!collapsed ? (
                        <div className="flex items-center px-3 py-2.5 mb-1.5 bg-white/80 rounded-xl border border-gray-100">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#080B1A] to-[#1a2035] text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {userName.charAt(0)}
                            </div>
                            <div className="ml-2.5 overflow-hidden">
                                <p className="text-[13px] font-semibold text-[#080B1A] truncate">{userName}</p>
                                <p className="text-[10px] text-gray-400 capitalize font-medium tracking-wide">{role.replace('_', ' ')}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center mb-1.5 py-1.5" title={userName}>
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-[#080B1A] to-[#1a2035] text-white flex items-center justify-center font-bold text-xs">
                                {userName.charAt(0)}
                            </div>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        title={collapsed ? 'Sign Out' : undefined}
                        className={`flex items-center text-[13px] font-medium text-[#6B6F76] rounded-xl hover:bg-red-50 hover:text-[#D40000] transition-colors cursor-pointer ${collapsed ? 'w-full justify-center py-2' : 'w-full px-3 py-2'}`}
                    >
                        <LogOut size={16} className={collapsed ? '' : 'mr-2.5'} />
                        {!collapsed && 'Sign Out'}
                    </button>
                </div>
            </aside>

            {/* Main content — scrolls independently */}
            <div
                className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'lg:pl-64' : 'lg:pl-0'} print:pl-0 min-h-screen flex flex-col`}
                style={{ marginLeft: `${sidebarWidth}px` }}
            >
                {/* Minimal top bar */}
                <header className="print:hidden h-12 bg-white/80 backdrop-blur-md border-b border-[#E5E5E2] flex items-center px-5 lg:px-8 sticky top-0 z-30 flex-shrink-0">
                    <button 
                        className="mr-3 lg:hidden text-[#6B6F76] hover:text-[#111318]"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={18} />
                    </button>
                    <div className="flex-1" />
                    <span className="text-[11px] font-medium text-[#6B6F76]/60 tracking-[0.04em]">
                        {new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase()}
                    </span>
                </header>

                {/* Page content */}
                <main className="flex-1 px-5 lg:px-8 py-8 lg:py-10">
                    <div style={{ maxWidth: 'clamp(320px, 100%, 1200px)', margin: '0 auto' }} className="2xl:!max-w-[clamp(1200px,70vw,1800px)]">
                        {children}
                    </div>
                </main>
            </div>

            {/* Mobile: reset margin since sidebar is a drawer */}
            <style>{`
                @media (max-width: 1023px) {
                    [style*="margin-left"] {
                        margin-left: 0 !important;
                    }
                }
            `}</style>
        </div>
    );
}
