import { Router } from 'express';

const router = Router();

// Placeholder OAuth endpoints for Google
// GET /api/v1/auth/google -> Redirects to Google OAuth consent page (not implemented)
// GET /api/v1/auth/google/callback -> Handles Google callback and issues session (not implemented)

router.get('/google', (_req, res) => {
  return res.status(501).json({ success: false, message: 'Google OAuth not configured. Set GOOGLE_CLIENT_ID and implement flow.' });
});

router.get('/google/callback', (_req, res) => {
  return res.status(501).json({ success: false, message: 'Google OAuth callback not implemented.' });
});

export default router;
