/**
 * security.ts — Client-side security layer.
 *
 * Provides:
 *  • RateLimiter  – localStorage-backed sliding-window rate limiter
 *  • Pre-configured limiters for login, contact form, and uploads
 *  • Input validation & sanitization for all user-supplied data
 *  • File validation for image uploads
 *
 * NOTE: This is the UX-layer defence.  The authoritative enforcement lives
 * in Firestore security rules, which run server-side and cannot be bypassed
 * by a client.
 */

// ── Rate Limiter ──────────────────────────────────────────────────────────────

interface RateLimitEntry {
  count: number;
  windowStart: number;
  blockedUntil?: number;
}

export class RateLimiter {
  private storageKey: string;
  private maxRequests: number;
  private windowMs: number;
  private blockDurationMs: number;

  /**
   * @param id             Unique identifier (stored in localStorage as `rl_<id>`)
   * @param maxRequests    Maximum requests allowed per window
   * @param windowMs       Sliding-window size in milliseconds
   * @param blockDurationMs  Hard-block duration after limit is hit (0 = no hard block)
   */
  constructor(
    id: string,
    maxRequests: number,
    windowMs: number,
    blockDurationMs = 0
  ) {
    this.storageKey = `rl_${id}`;
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.blockDurationMs = blockDurationMs;
  }

  /** Returns whether the action is allowed and how long to wait if not. */
  check(): { allowed: boolean; retryAfterMs?: number } {
    try {
      const now = Date.now();
      const raw = localStorage.getItem(this.storageKey);
      const entry: RateLimitEntry = raw
        ? JSON.parse(raw)
        : { count: 0, windowStart: now };

      // Still in hard-block period?
      if (entry.blockedUntil && now < entry.blockedUntil) {
        return { allowed: false, retryAfterMs: entry.blockedUntil - now };
      }

      // Window expired — reset
      if (now - entry.windowStart > this.windowMs) {
        entry.count = 0;
        entry.windowStart = now;
        delete entry.blockedUntil;
      }

      if (entry.count >= this.maxRequests) {
        if (this.blockDurationMs > 0) {
          entry.blockedUntil = now + this.blockDurationMs;
          localStorage.setItem(this.storageKey, JSON.stringify(entry));
          return { allowed: false, retryAfterMs: this.blockDurationMs };
        }
        const retryAfterMs = this.windowMs - (now - entry.windowStart);
        return { allowed: false, retryAfterMs: Math.max(retryAfterMs, 0) };
      }

      entry.count += 1;
      localStorage.setItem(this.storageKey, JSON.stringify(entry));
      return { allowed: true };
    } catch {
      // If localStorage is unavailable, fail open (allow) but log it
      console.warn('[RateLimiter] localStorage unavailable');
      return { allowed: true };
    }
  }

  /** Reset the limit (e.g. after a successful authenticated action). */
  reset(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch {
      /* ignore */
    }
  }
}

// ── Pre-configured limiters ───────────────────────────────────────────────────

/** Admin login: 5 attempts per 15 min, then 30-min hard block */
export const loginRateLimiter = new RateLimiter(
  'admin_login',
  5,
  15 * 60 * 1000,
  30 * 60 * 1000
);

/** Contact form: 3 submissions per hour */
export const contactFormRateLimiter = new RateLimiter(
  'contact_form',
  3,
  60 * 60 * 1000
);

/** File uploads: 20 per hour */
export const uploadRateLimiter = new RateLimiter(
  'file_upload',
  20,
  60 * 60 * 1000
);

// ── Input Sanitization ────────────────────────────────────────────────────────

/**
 * Strips leading/trailing whitespace, removes < and > characters,
 * and truncates to maxLength.
 */
export function sanitizeString(value: unknown, maxLength: number): string {
  if (typeof value !== 'string') return '';
  return value
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, maxLength);
}

/** Escapes HTML for any context where the string will be rendered as HTML. */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ── Field Validators ──────────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // RFC 5322 simplified — catches the overwhelming majority of real addresses
  return /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  // Allow digits, spaces, hyphens, parentheses. Require 7-15 digit core.
  const digits = phone.replace(/[\s\-()+]/g, '');
  return /^\d{7,15}$/.test(digits);
}

export function isValidHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' || u.protocol === 'http:';
  } catch {
    return false;
  }
}

// ── File Validation ───────────────────────────────────────────────────────────

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]);

/** 5 MB hard cap before WebP conversion */
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_MIME_TYPES.has(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.',
    };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File is too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum allowed size is 5 MB.`,
    };
  }
  return { valid: true };
}

// ── Contact Form Validation ───────────────────────────────────────────────────

export interface ContactFormFields {
  name: string;
  email: string;
  phone: string;
  budget: string;
  timeline: string;
  message: string;
  scopes: string[];
  countryCode: string;
}

export interface FormValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactFormFields, string>>;
}

// Allowlists for enum fields — prevents injection of unexpected values
const ALLOWED_BUDGETS = new Set([
  'Under $500',
  '$500 - $1,000',
  '$1,000 - $2,500',
  '$2,500 - $5,000',
  '$5,000+',
  "Let's discuss",
]);

const ALLOWED_TIMELINES = new Set([
  'ASAP',
  '1-2 weeks',
  '1 month',
  '2-3 months',
  '3+ months',
  'Flexible',
]);

const ALLOWED_SCOPES = new Set([
  'Meta Marketing',
  'Marketing Designer',
  'Brand Designer',
  'Social Media Management',
  'SME Digitalize',
  'Wordpress Web Dev',
  'Ai Web',
  'Ai Automation',
]);

export function validateContactForm(
  data: ContactFormFields
): FormValidationResult {
  const errors: FormValidationResult['errors'] = {};

  const name = sanitizeString(data.name, 200);
  if (!name || name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!isValidEmail(data.email ?? '')) {
    errors.email = 'Please enter a valid email address.';
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = 'Please enter a valid phone number (digits only, 7–15 digits).';
  }

  // budget and timeline are optional but must be from the allowlist if provided
  if (data.budget && !ALLOWED_BUDGETS.has(data.budget)) {
    errors.budget = 'Please select a valid budget option.';
  }

  if (data.timeline && !ALLOWED_TIMELINES.has(data.timeline)) {
    errors.timeline = 'Please select a valid timeline option.';
  }

  const message = sanitizeString(data.message, 5000);
  if (!message || message.length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  if (data.scopes.some((s) => !ALLOWED_SCOPES.has(s))) {
    errors.scopes = 'One or more selected scopes are invalid.';
  }

  return { valid: Object.keys(errors).length === 0, errors };
}

// ── Admin Field Validation ────────────────────────────────────────────────────

export interface AdminProjectFields {
  title: string;
  type: string;
  link?: string;
  description: string;
}

export function validateProjectFields(
  fields: AdminProjectFields
): FormValidationResult {
  const errors: FormValidationResult['errors'] = {};
  if (!sanitizeString(fields.title, 200)) errors.name = 'Title is required.';
  if (!sanitizeString(fields.type, 100)) errors.name = 'Category is required.';
  if (
    fields.link &&
    fields.link.trim() &&
    !isValidHttpsUrl(fields.link.trim())
  ) {
    errors.name = 'Project link must be a valid URL.';
  }
  if (!sanitizeString(fields.description, 2000))
    errors.message = 'Description is required.';
  return { valid: Object.keys(errors).length === 0, errors };
}

/** Format milliseconds into a human-readable "X min" / "X sec" string. */
export function formatRetryAfter(ms: number): string {
  if (ms >= 60_000) return `${Math.ceil(ms / 60_000)} minute(s)`;
  return `${Math.ceil(ms / 1_000)} second(s)`;
}
