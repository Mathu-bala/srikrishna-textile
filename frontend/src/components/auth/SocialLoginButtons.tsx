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
const Spinner = () => (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
);

const SocialLoginButtons = () => {
    const [googleLoading, setGoogleLoading] = useState(false);
    
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


            </div>


        </div>
    );
};

export default SocialLoginButtons;
