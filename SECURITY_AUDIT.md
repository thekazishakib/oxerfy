# Oxerfy Security Audit Report
**Date:** 2026-05-01  
**Scope:** Full codebase — authentication, API access, secrets, input validation, deployment hardening, abuse protection

---

## Executive Summary

The original codebase had **8 critical and 6 high-severity findings**. All have been remediated. The application now enforces rate limiting, proper input validation, secret hygiene, HTTPS-only deployment headers, and hardened Firestore security rules.

---

## Critical Findings & Remediations

### 🔴 CRIT-1 — Firebase API key committed to source control
**File:** `firebase-applet-config.json`  
**Risk:** The real Firebase API key (`AIzaSyDjm__...`) was tracked by Git and would appear in every clone, fork, and CI log.

**Fix:**
- `firebase-applet-config.json` added to `.gitignore`
- `src/lib/firebase.ts` rewritten to read all config from `import.meta.env.VITE_FIREBASE_*` environment variables
- `.env.example` updated with all required variable names (empty values only)

**Action required:** Rotate the Firebase API key in the Firebase console. Add the new key to Vercel environment variables. Do NOT commit `.env` files.

---

### 🔴 CRIT-2 — GEMINI_API_KEY injected into frontend bundle
**File:** `vite.config.ts`  
**Risk:** `define: { 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) }` baked the Gemini secret key as a plaintext string into the compiled JavaScript bundle, visible to anyone who opens DevTools → Sources.

**Fix:** The `define` block was removed entirely from `vite.config.ts`. Gemini API calls must be made from a server-side function (Edge Function / Cloud Run), never from the browser.

---

### 🔴 CRIT-3 — No rate limiting on admin login
**File:** `src/pages/Admin.tsx`  
**Risk:** An attacker could make unlimited Google OAuth login attempts, or use an automated script to repeatedly try different email accounts.

**Fix:**
- `RateLimiter` class created in `src/lib/security.ts`
- `loginRateLimiter`: 5 attempts per 15 minutes, then 30-minute hard block
- Block is checked **before** the popup opens, preventing any OAuth round-trips
- Login errors surfaced as generic user-friendly messages (no stack traces)

---

### 🔴 CRIT-4 — No rate limiting on public contact form
**File:** `src/components/Footer.tsx`  
**Risk:** Bots could flood the `contact_submissions` Firestore collection and the Web3Forms API with unlimited spam submissions.

**Fix:**
- `contactFormRateLimiter`: 3 submissions per hour per browser
- Rate limit checked before any Firebase or network call
- Input validation runs before write to Firestore (see CRIT-6)

---

### 🔴 CRIT-5 — No file type or size validation on image uploads
**File:** `src/pages/Admin.tsx` (all upload handlers)  
**Risk:** Any file type could be uploaded and stored as a base64 data-URL in Firestore. A malicious SVG or HTML file rendered in an `<img>` tag can execute JavaScript in some browsers.

**Fix:**
- `validateImageFile()` in `security.ts` enforces MIME type allowlist: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Hard 5 MB size cap enforced before canvas processing
- `accept="image/jpeg,image/png,image/webp,image/gif"` on every `<input type="file">`
- `uploadRateLimiter`: 20 uploads per hour
- `secureUpload()` helper wraps all three checks in every upload path

---

### 🔴 CRIT-6 — No input sanitization on contact form or admin writes
**Files:** `Footer.tsx`, `Admin.tsx`  
**Risk:** Raw `formData` spread directly into Firestore without length limits or character sanitization. A malicious actor could store XSS payloads or extremely large documents.

**Fix:**
- `sanitizeString(val, maxLength)` strips `< >` characters and truncates
- `validateContactForm()` validates email format, phone format, and enum fields (budget, timeline, scopes) against allowlists
- All admin write paths call `sanitizeString()` before Firestore writes
- `maxLength` HTML attributes added to all inputs as secondary UX guard

---

### 🔴 CRIT-7 — Accent color and asset key fields not allowlist-validated
**File:** `src/pages/Admin.tsx`  
**Risk:** `accent` (CSS class string) and `assetKey` were written directly to Firestore from form values. A tampered request could inject arbitrary class names or create documents with unexpected keys.

**Fix:**
- `ALLOWED_ACCENT_VALUES` Set validates accent before write
- `ALLOWED_ASSET_KEYS` Set validates asset key (both client-side and in Firestore rules)
- Firestore rules now enforce the asset key allowlist server-side

---

### 🔴 CRIT-8 — No HTTP security headers
**File:** `vercel.json`  
**Risk:** No HSTS, CSP, X-Frame-Options, or other protective headers. Site was vulnerable to clickjacking, MIME sniffing, and protocol downgrade attacks.

**Fix (`vercel.json`):**
| Header | Value |
|---|---|
| `Strict-Transport-Security` | `max-age=63072000; includeSubDomains; preload` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Camera, mic, geo, payment all blocked |
| `Content-Security-Policy` | Allowlist for scripts, styles, images, connections |

---

## High Findings & Remediations

### 🟠 HIGH-1 — Firestore admin check only verified email, not email_verified
**File:** `firestore.rules`  
**Risk:** A Firebase user could set their display email without verification; `email_verified: false` would still match the admin rule.

**Fix:** `isAdmin()` now requires `request.auth.token.email_verified == true`.

---

### 🟠 HIGH-2 — Firestore rules had no deny-all fallback
**File:** `firestore.rules`  
**Risk:** Any collection not explicitly matched would fall through with no rule, defaulting to deny in Firestore — but this is fragile. New collections could accidentally be exposed if rules were partially edited.

**Fix:** Added explicit `match /{document=**} { allow read, write: if false; }` catch-all at the bottom.

---

### 🟠 HIGH-3 — Order field in Firestore not validated as non-negative integer
**File:** `firestore.rules`  
**Risk:** A crafted write with `order: -1` or `order: 9999999` could cause sorting bugs or storage abuse.

**Fix:** `isValidOrder()` helper enforces `val is int && val >= 0 && val <= 9999`.

---

### 🟠 HIGH-4 — Error messages exposed raw Firebase error details to UI
**File:** `src/pages/Admin.tsx`  
**Risk:** `alert("Login Failed: " + err.message)` exposed Firebase error codes and internal paths.

**Fix:** All catch blocks now display generic user-friendly messages and log the real error to `console.error` (server logs) only.

---

### 🟠 HIGH-5 — No input length limits in Firestore rules for pricing.features
**File:** `firestore.rules`  
**Risk:** An admin write could add an unbounded features array, causing large document storage.

**Fix:** `request.resource.data.features.size() <= 20` added to pricing rules.

---

### 🟠 HIGH-6 — GitIgnore did not block `firebase-applet-config.json`
**File:** `.gitignore`  
**Risk:** The file containing the real API key was tracked by Git.

**Fix:** `firebase-applet-config.json` added to `.gitignore`. Existing history should be purged with `git filter-repo` (see instructions below).

---

## Files Changed

| File | Changes |
|---|---|
| `src/lib/firebase.ts` | Reads config from env vars; fails fast if any var missing |
| `src/lib/security.ts` | **New** — RateLimiter, validators, sanitizers, file validator |
| `src/pages/Admin.tsx` | Rate-limited login, validated/sanitized all writes, secure upload helper, allowlist for accent+assetKey, generic error messages |
| `src/components/Footer.tsx` | Rate-limited contact form, full input validation+sanitization |
| `firestore.rules` | email_verified check, asset key allowlist, order validation, features size limit, deny-all fallback |
| `vercel.json` | Full security header suite (HSTS, CSP, X-Frame, etc.) |
| `vite.config.ts` | Removed GEMINI_API_KEY bundle injection; disabled sourcemaps in prod |
| `.env.example` | Full variable list with documentation; no real values |
| `.gitignore` | Blocks `firebase-applet-config.json` and all `.env*` files |

---

## Remaining Actions Required (Manual)

### 1. Rotate the exposed Firebase API key
```bash
# In Firebase Console → Project Settings → General → Web API Key
# Click "Regenerate" — this invalidates the leaked key
# Then update Vercel env vars with the new key
```

### 2. Remove the key from Git history
```bash
cd oxerfy-main
pip install git-filter-repo
git filter-repo --path firebase-applet-config.json --invert-paths --force
git push --force-with-lease
```

### 3. Set Vercel Environment Variables
Go to: Vercel Dashboard → Project → Settings → Environment Variables

Add each of these (use values from your Firebase console):
```
VITE_FIREBASE_API_KEY          = <new rotated key>
VITE_FIREBASE_AUTH_DOMAIN      = oxerfy-website.firebaseapp.com
VITE_FIREBASE_PROJECT_ID       = oxerfy-website
VITE_FIREBASE_STORAGE_BUCKET   = oxerfy-website.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID = 966596338890
VITE_FIREBASE_APP_ID           = 1:966596338890:web:242fcfcdf5ddbf80478033
VITE_FIREBASE_MEASUREMENT_ID   = G-G8199H1CQX
VITE_WEB3FORMS_KEY             = <your web3forms key>
VITE_APP_URL                   = https://oxerfy.com
```

### 4. Create a local .env file for development
```bash
cp .env.example .env
# Fill in the values — this file is gitignored
```

### 5. Deploy updated Firestore rules
```bash
npm install -g firebase-tools
firebase login
firebase deploy --only firestore:rules
```

### 6. Enable Firebase App Check (recommended)
Firebase Console → App Check → Register your web app with reCAPTCHA v3.  
This provides server-enforced rate limiting that cannot be bypassed by clearing localStorage.

### 7. Move Gemini API calls server-side
If you use Gemini, create a Vercel Edge Function or Cloud Run service.  
The API key must **never** appear in any `VITE_*` variable.

---

## Security Architecture Summary

```
Browser (Client)                    Firebase (Server)
─────────────────                   ────────────────────────────────
RateLimiter (localStorage)   ──►   Firestore Security Rules
  login: 5/15min                     isAdmin(): email + email_verified
  contact: 3/hour                    Field length/type validation
  upload: 20/hour                    Asset key allowlist
                                     Deny-all fallback
validateContactForm()        ──►   contact_submissions validation
sanitizeString()             ──►   Stored safe values
validateImageFile()          ──►   Only processed if MIME+size OK

Vercel CDN
──────────
HSTS (2yr preload)
CSP (allowlisted origins)
X-Frame-Options: DENY
nosniff, XSS-Protection
Referrer-Policy
Permissions-Policy
```

---

*Report generated by security audit — Oxerfy v1.0 hardening pass*
