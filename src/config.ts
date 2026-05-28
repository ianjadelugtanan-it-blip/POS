// API Configuration
// Use environment variable if provided. 
// Otherwise, in development fallback to the dynamic hostname (allows local network mobile demos).
// In production, fallback to relative '/POS/backend' so it works on any domain without CORS issues.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? `http://${window.location.hostname}/POS/backend` : '/POS/backend');
