// API Configuration
// Use environment variable if provided. 
// Otherwise, in development fallback to the absolute localhost URL (which now uses secure CORS).
// In production, fallback to relative '/api' so it works on any domain without CORS issues.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost/api' : '/api');
