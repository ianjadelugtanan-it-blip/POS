// API Configuration
// Use environment variable if provided. 
<<<<<<< HEAD
// Otherwise, in development fallback to the absolute localhost URL (which now uses secure CORS).
// In production, fallback to relative '/api' so it works on any domain without CORS issues.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost/api' : '/api');
=======
// Otherwise, in development fallback to the dynamic hostname (allows local network mobile demos).
// In production, fallback to relative '/POS/backend' so it works on any domain without CORS issues.
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? `http://${window.location.hostname}/POS/backend` : '/POS/backend');
>>>>>>> 7227ed72a474956bb3eaca7a2ed309bc1ba5c6e0
