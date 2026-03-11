/**
 * Firebase Configuration
 * ─────────────────────────────────────────────────────────
 * HOW TO GET YOUR KEYS:
 * 1. Go to https://console.firebase.google.com/
 * 2. Create / open your project → Project Settings → Your Apps
 * 3. Add a Web App and copy the firebaseConfig values below
 * 4. Enable Google & Facebook providers under Authentication → Sign-in method
 *
 * For Facebook:
 * - Create an app at https://developers.facebook.com/
 * - Copy App ID & App Secret → Firebase Console → Facebook provider
 * ─────────────────────────────────────────────────────────
 */

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
};

/**
 * Detect whether Firebase is properly configured with real keys.
 * - apiKey must start with "AIza" and be at least 20 characters long
 *   (real Firebase API keys are ~39 chars; the placeholder "AIza..." is only 7)
 * - authDomain must contain a dot (real domain: xxx.firebaseapp.com)
 */
const isRealApiKey = (key: string) =>
    key.startsWith('AIza') && key.length >= 20;

const isConfigured =
    isRealApiKey(firebaseConfig.apiKey) &&
    firebaseConfig.authDomain.includes('.');

// Console warning when keys are missing or still placeholder
if (!isConfigured) {
    console.warn(
        '[SriKrishna Shop] 🔧 Firebase not configured yet.\n' +
        'Social login (Google / Facebook) is disabled.\n' +
        'To enable:\n' +
        '  1. Open frontend/.env\n' +
        '  2. Fill in your VITE_FIREBASE_* keys from console.firebase.google.com\n' +
        '  3. Restart the dev server (Ctrl+C → npm run dev)'
    );
}

// Initialise Firebase only when real keys are present
const app = isConfigured ? initializeApp(firebaseConfig) : null;
const auth = isConfigured ? getAuth(app!) : null;

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

// Request profile + email scopes
googleProvider.addScope('profile');
googleProvider.addScope('email');
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export { auth, googleProvider, facebookProvider, isConfigured };
