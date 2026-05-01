const express = require('express');
const crypto = require('crypto');
const router = express.Router();

/**
 * In-memory token store. Token -> { role, expires }
 * Exported so calculate.js can validate tokens and purge expired ones.
 */
const activeTokens = new Map();

// Credentials stored server-side only — never exposed to frontend
const CREDENTIALS = {
  admin: { password: 'portex2025', role: 'admin' },
  guest: { password: 'portex123', role: 'user' }
};

/**
 * POST /api/auth/login
 * Body: { username, password }
 * Returns: { success, role, token } or { success:false, error }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, error: 'Missing credentials' });
  }

  const cred = CREDENTIALS[username.toLowerCase()];
  if (!cred || cred.password !== password) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = crypto.randomUUID();
  activeTokens.set(token, { role: cred.role, expires: Date.now() + 86400000 });

  return res.json({ success: true, role: cred.role, token });
});

/**
 * POST /api/auth/logout
 * Body: { token }
 */
router.post('/logout', (req, res) => {
  const { token } = req.body;
  if (token) activeTokens.delete(token);
  return res.json({ success: true });
});

/**
 * Helper: resolve role from Authorization header.
 * Also purges expired tokens.
 * @param {string|undefined} authHeader - "Bearer <token>"
 * @returns {'admin'|'user'|null}
 */
function resolveRole(authHeader) {
  // Purge expired tokens on every auth check
  const now = Date.now();
  for (const [tok, data] of activeTokens.entries()) {
    if (data.expires < now) activeTokens.delete(tok);
  }

  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const entry = activeTokens.get(token);
  if (!entry || entry.expires < now) return null;
  return entry.role;
}

module.exports = { router, activeTokens, resolveRole };
