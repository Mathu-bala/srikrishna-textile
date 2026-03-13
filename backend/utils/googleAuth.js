const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * Verifies a Google ID Token (Credential)
 * @param {string} token - The credential from Google Login
 * @returns {Promise<Object>} - User info (email, name, picture)
 */
async function verifyGoogleToken(token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        return {
            email: payload.email,
            name: payload.name,
            picture: payload.picture,
            sub: payload.sub
        };
    } catch (error) {
        console.error('Google token verification failed:', error.message);
        throw new Error('Invalid Google token');
    }
}

module.exports = { verifyGoogleToken };
