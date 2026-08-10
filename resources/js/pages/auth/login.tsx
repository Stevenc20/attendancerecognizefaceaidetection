import { Form, Head } from '@inertiajs/react';
import InputError from '@/components/input-error';
import TeamInvitationAlert from '@/components/team-invitation-alert';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import type { TeamInvitationContext } from '@/types';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
    teamInvitation?: TeamInvitationContext | null;
};

export default function Login({
    status,
    canResetPassword,
    teamInvitation,
}: Props) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <>
            <Head title="Log in" />

            {teamInvitation && (
                <TeamInvitationAlert
                    invitation={teamInvitation}
                    action="Log in"
                />
            )}

            <div className="flex flex-col gap-6 w-full relative z-20">
                {/* Google Auth Button (Placeholder for now) */}
                <button 
                    type="button" 
                    className="w-full bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:-translate-y-1 h-12 md:h-14 flex items-center justify-center gap-3 rounded-xl transition-all hover:border-brand-orange hover:shadow-[0_0_15px_rgba(255,143,146,0.3)] group"
                >
                    <svg viewBox="0 0 24 24" className="w-5 h-5 group-hover:scale-110 transition-transform">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-white/10"></div>
                    <span className="flex-shrink-0 mx-4 text-white/30 text-xs md:text-sm uppercase tracking-[0.2em]">Or use school credentials</span>
                    <div className="flex-grow border-t border-white/10"></div>
                </div>

                <Form
                    {...store.form()}
                    resetOnSuccess={['password']}
                    className="flex flex-col gap-6"
                >
                    {({ processing, errors }) => (
                        <>
                            <div className="grid gap-6">
                                {/* Floating Label Input for Email/NIS */}
                                <div className="relative group">
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        tabIndex={1}
                                        autoComplete="email"
                                        className="block px-2.5 pb-2.5 pt-6 w-full text-sm md:text-base text-white bg-white/5 border-0 border-b-2 border-white/20 rounded-t-lg appearance-none focus:outline-none focus:ring-0 focus:border-brand-red focus:bg-white/10 peer transition-all"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="email"
                                        className="absolute text-sm text-white/50 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-brand-red cursor-text"
                                    >
                                        Student NIS or Email
                                    </label>
                                    <InputError message={errors.email} className="mt-1" />
                                </div>

                                {/* Floating Label Input for Password */}
                                <div className="relative group">
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        required
                                        tabIndex={2}
                                        autoComplete="current-password"
                                        className="block px-2.5 pb-2.5 pt-6 w-full text-sm md:text-base text-white bg-white/5 border-0 border-b-2 border-white/20 rounded-t-lg appearance-none focus:outline-none focus:ring-0 focus:border-brand-red focus:bg-white/10 peer transition-all pr-12"
                                        placeholder=" "
                                    />
                                    <label
                                        htmlFor="password"
                                        className="absolute text-sm text-white/50 duration-300 transform -translate-y-4 scale-75 top-5 z-10 origin-[0] left-2.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4 peer-focus:text-brand-red cursor-text"
                                    >
                                        Password
                                    </label>
                                    
                                    <button 
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-4 text-white/50 hover:text-white transition-colors p-1"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>

                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                <div className="flex items-center justify-between mt-2">
                                    <div className="flex items-center space-x-3">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                            tabIndex={3}
                                            className="border-white/20 data-[state=checked]:bg-brand-red data-[state=checked]:border-brand-red"
                                        />
                                        <Label htmlFor="remember" className="text-white/70 font-normal">Remember me</Label>
                                    </div>
                                    
                                    {canResetPassword && (
                                        <TextLink
                                            href={request()}
                                            className="text-sm text-brand-orange hover:text-brand-red transition-colors"
                                            tabIndex={5}
                                        >
                                            Forgot password?
                                        </TextLink>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    className="mt-6 w-full h-12 md:h-14 bg-brand-red hover:bg-[#ff1a20] text-white font-bold tracking-wider uppercase rounded-xl transition-all hover:shadow-[0_0_20px_rgba(229,37,42,0.6)] hover:-translate-y-1"
                                    tabIndex={4}
                                    disabled={processing}
                                    data-test="login-button"
                                >
                                    {processing && <Spinner className="mr-2" />}
                                    Access System
                                </Button>
                            </div>
                        </>
                    )}
                </Form>

                {status && (
                    <div className="mt-4 text-center text-sm font-medium text-green-500 bg-green-500/10 p-3 rounded-lg border border-green-500/20">
                        {status}
                    </div>
                )}
            </div>
        </>
    );
}

Login.layout = {
    title: 'Authenticate',
    description: 'Enter your credentials to activate your account or access the dashboard.',
};
