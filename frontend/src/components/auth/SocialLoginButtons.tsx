/**
 * SocialLoginButtons — Real Firebase OAuth login.
 * Works with Google & Facebook via signInWithPopup.
 * Falls back to "coming soon" toast when Firebase keys are not configured.
 *
 * Designed by Mathu Bala – UI/UX Developer
 */

import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { auth, googleProvider, facebookProvider, isConfigured } from '@/lib/firebase';
import { socialLoginUser } from '@/services/api';
import { useAuth } from '@/context/AuthContext';

// ─── Inlined SVG Icons (no extra packages) ────────────────────────────────────
const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#FFC107" d="M43.6 20.2H42V20H24v8h11.3C33.7 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.5 29.4 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.6-.4-3.8z" />
        <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19.1 12 24 12c3.1 0 5.8 1.1 7.9 3l5.7-5.7C34.3 6.5 29.4 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
        <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.3 35.3 26.8 36 24 36c-5.3 0-9.7-2.9-11.3-7H5.8C9.1 38.8 16 44 24 44z" />
        <path fill="#1976D2" d="M43.6 20.2H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4.1 5.5l6.2 5.2C40.2 35.8 44 30.4 44 24c0-1.3-.1-2.6-.4-3.8z" />
    </svg>
);

const FacebookIcon = () => (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
        <path fill="#1877F2" d="M48 24C48 10.7 37.3 0 24 0S0 10.7 0 24c0 12 8.8 21.9 20.3 23.7V30.9h-6.1V24h6.1v-5.3c0-6 3.6-9.4 9.1-9.4 2.6 0 5.4.5 5.4.5v5.9H31c-3 0-3.9 1.9-3.9 3.7V24h6.7l-1.1 6.9h-5.6v16.8C39.2 45.9 48 36 48 24z" />
        <path fill="#fff" d="M33.4 30.9l1.1-6.9h-6.7v-4.5c0-1.9.9-3.7 3.9-3.7h3.1v-5.9s-2.8-.5-5.4-.5c-5.5 0-9.1 3.3-9.1 9.4V24h-6.1v6.9h6.1v16.8c1.2.2 2.5.3 3.7.3s2.5-.1 3.7-.3V30.9h5.7z" />
    </svg>
);
// ─────────────────────────────────────────────────────────────────────────────

const Spinner = () => (
    <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
        <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
);

// Shared handler: runs Firebase popup → calls our backend → sets auth context
const useSocialLogin = () => {
    const { login: _ctxLogin } = useAuth();
    const navigate = useNavigate();

    // We bypass AuthContext.login (which needs email+password) and instead
    // directly set the user via a tiny helper exposed from context.
    // Since AuthContext stores user from localStorage, we write it directly
    // and trigger a reload-free state update via the socialLogin context helper.
    const handleProvider = async (
        provider: 'google' | 'facebook',
        loadingSetter: (v: boolean) => void,
    ) => {
        if (!isConfigured || !auth) {
            toast.info('🔧 Firebase not configured yet.', {
                description: 'Add your Firebase keys to the .env file to enable social login.',
            });
            return;
        }

        const firebaseProvider = provider === 'google' ? googleProvider : facebookProvider;

        loadingSetter(true);
        try {
            // 1️⃣  Open OAuth popup
            const result = await signInWithPopup(auth, firebaseProvider);
            const { displayName, email, photoURL } = result.user;

            if (!email) throw new Error('No email returned from provider.');

            // 2️⃣  Call our backend → find-or-create user → get JWT
            const data = await socialLoginUser(
                displayName || email.split('@')[0],
                email,
                photoURL || '',
                provider,
            );

            // 3️⃣  Persist session exactly as email login does
            const userPayload = {
                id: data._id,
                email: data.email,
                name: data.name,
                isAdmin: data.isAdmin,
                token: data.token,
            };
            localStorage.setItem('user', JSON.stringify(userPayload));

            // 4️⃣  Hard-reload so AuthContext re-hydrates from localStorage
            //     (lightweight; avoids exposing setUser outside context)
            toast.success(`Welcome, ${data.name}! 🎉`);
            window.location.href = '/';          // redirect home & reload context

        } catch (err: any) {
            // User cancelled popup → code auth/popup-closed-by-user
            if (err?.code === 'auth/popup-closed-by-user' ||
                err?.code === 'auth/cancelled-popup-request') {
                // silent — user dismissed popup intentionally
                return;
            }
            if (err?.code === 'auth/popup-blocked') {
                toast.error('Popup blocked by browser', {
                    description: 'Please allow popups for this site and try again.',
                });
                return;
            }
            toast.error(err?.message || 'Social login failed. Please try again.');
        } finally {
            loadingSetter(false);
        }
    };

    return handleProvider;
};

// ─── Component ─────────────────────────────────────────────────────────────
const SocialLoginButtons = () => {
    const [googleLoading, setGoogleLoading] = useState(false);
    const [facebookLoading, setFacebookLoading] = useState(false);
    const handleProvider = useSocialLogin();

    return (
        <div className="mt-5 space-y-4">
            {/* Divider */}
            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/60" />
                <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground whitespace-nowrap select-none">
                    Or continue with
                </span>
                <div className="flex-1 h-px bg-border/60" />
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                    type="button"
                    id="social-login-google"
                    disabled={googleLoading || facebookLoading}
                    onClick={() => handleProvider('google', setGoogleLoading)}
                    className="
                        group flex items-center justify-center gap-2.5
                        px-4 py-2.5 rounded-lg border border-border/60
                        bg-background/80 text-foreground text-sm font-medium
                        shadow-sm transition-all duration-200
                        hover:border-[#4285F4]/50
                        hover:shadow-[0_0_14px_rgba(66,133,244,0.20)]
                        hover:bg-[#4285F4]/5
                        active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4285F4]/50
                        disabled:opacity-60 disabled:cursor-not-allowed
                    "
                    aria-label="Continue with Google"
                >
                    {googleLoading ? <Spinner /> : <GoogleIcon />}
                    <span>{googleLoading ? 'Signing in…' : 'Google'}</span>
                </button>

                {/* Facebook */}
                <button
                    type="button"
                    id="social-login-facebook"
                    disabled={googleLoading || facebookLoading}
                    onClick={() => handleProvider('facebook', setFacebookLoading)}
                    className="
                        group flex items-center justify-center gap-2.5
                        px-4 py-2.5 rounded-lg border border-border/60
                        bg-background/80 text-foreground text-sm font-medium
                        shadow-sm transition-all duration-200
                        hover:border-[#1877F2]/50
                        hover:shadow-[0_0_14px_rgba(24,119,242,0.20)]
                        hover:bg-[#1877F2]/5
                        active:scale-[0.98]
                        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1877F2]/50
                        disabled:opacity-60 disabled:cursor-not-allowed
                    "
                    aria-label="Continue with Facebook"
                >
                    {facebookLoading ? <Spinner /> : <FacebookIcon />}
                    <span>{facebookLoading ? 'Signing in…' : 'Facebook'}</span>
                </button>
            </div>

            {/* Dev-mode portfolio note */}
            {import.meta.env.DEV && (
                <p className="text-center text-[10px] text-muted-foreground/40 pt-1 select-none">
                    Designed by <span className="font-semibold text-muted-foreground/60">Mathu Bala</span> – UI/UX Developer
                </p>
            )}
        </div>
    );
};

export default SocialLoginButtons;
