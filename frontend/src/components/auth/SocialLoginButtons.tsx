/**
 * SocialLoginButtons — Direct Google OAuth & Facebook implementation.
 * Removes Firebase dependency and uses official Google Identity Services via @react-oauth/google.
 */

import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { socialLoginUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// ─── Inlined SVG Icons ────────────────────────────────────────────────────────
const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.4 9.1-9.4 2.6 0 5.4.5 5.4.5v5.9H31c-3 0-3.9 1.9-3.9 3.7V24h6.7l-1.1 6.9h-5.6v16.8C39.2 45.9 48 36 48 24z" />
        <path fill="#fff" d="M33.4 30.9l1.1-6.9h-6.7v-4.5c0-1.9.9-3.7 3.9-3.7h3.1v-5.9s-2.8-.5-5.4-.5c-5.5 0-9.1 3.3-9.1 9.4V24h-6.1v6.9h6.1v16.8c1.2.2 2.5.3 3.7.3s2.5-.1 3.7-.3V30.9h5.7z" />
    </svg>
);

const Spinner = () => (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
);

const SocialLoginButtons = () => {
    const [googleLoading, setGoogleLoading] = useState(false);
    const [facebookLoading, setFacebookLoading] = useState(false);
    
    // Safety check for Client ID
    const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "717104013887-8a9icee4jtt4ou7qjbvvhvupjnilbsda.apps.googleusercontent.com";

    // ─── Google Success Handler ─────────────────────────────────────────────
    const handleGoogleSuccess = async (credentialResponse: any) => {
        setGoogleLoading(true);
        try {
            // credentialResponse.credential is the JWT (ID Token)
            const data = await socialLoginUser(
                '', // name (fetched from token on backend)
                '', // email (fetched from token on backend)
                '', // photoURL (fetched from token on backend)
                'google',
                credentialResponse.credential
            );

            const userPayload = {
                id: data._id,
                email: data.email,
                name: data.name,
                isAdmin: data.isAdmin,
                token: data.token,
            };
            localStorage.setItem('user', JSON.stringify(userPayload));
            
            toast.success(`Welcome, ${data.name}! 🎉`);
            window.location.href = '/'; 
        } catch (err: any) {
            console.error('Login Error:', err);
            toast.error(err.message || 'Google login failed. Please try again.');
        } finally {
            setGoogleLoading(false);
        }
    };

    const handleFacebookLogin = () => {
        toast.info('Facebook login is currently being updated. Please use Google or Email.');
    };

    return (
        <div className="mt-6 space-y-4">
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground whitespace-nowrap select-none">
                    Or continue with
                </span>
                <div className="flex-1 h-px bg-border/60" />
            </div>

            <div className="flex flex-col gap-3">
                {/* Official Google Button */}
                <div className="flex justify-center w-full overflow-hidden rounded-lg border border-border/60 bg-background/50 py-1">
                    {googleLoading ? (
                        <div className="py-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Spinner /> Signing in...
                        </div>
                    ) : (
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => toast.error('Google login failed')}
                            useOneTap
                            theme="outline"
                            size="large"
                            text="continue_with"
                            shape="rectangular"
                            width="100%"
                        />
                    )}
                </div>

                {/* Facebook Button (Kept same style as before but functional logic is placeholder) */}
                <button
                    type="button"
                    onClick={handleFacebookLogin}
                    disabled={googleLoading || facebookLoading}
                    className="
                        group flex items-center justify-center gap-2.5
                        px-4 py-2.5 rounded-lg border border-border/60
                        bg-background/80 text-foreground text-sm font-medium
                        shadow-sm transition-all duration-200
                        hover:border-[#1877F2]/50
                        hover:shadow-[0_0_14px_rgba(24,119,242,0.15)]
                        hover:bg-[#1877F2]/5
                        active:scale-[0.98]
                        disabled:opacity-60 disabled:cursor-not-allowed
                    "
                >
                    {facebookLoading ? <Spinner /> : <FacebookIcon />}
                    <span>Facebook</span>
                </button>
            </div>

            {import.meta.env.DEV && (
                <p className="text-center text-[10px] text-muted-foreground/40 pt-1 select-none">
                    Designed by <span className="font-semibold text-muted-foreground/60">Mathu Bala</span> – UI/UX Developer
                </p>
            )}
        </div>
    );
};

export default SocialLoginButtons;
