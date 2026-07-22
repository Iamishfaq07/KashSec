/**
 * Vercel Web Analytics Integration
 * Initializes Web Analytics for tracking page views and user interactions
 * 
 * This script imports from the CDN for production use or node_modules for local development.
 */

(async function() {
  try {
    // Import from CDN (works in production) or fallback to local module
    const { inject } = await import('https://cdn.jsdelivr.net/npm/@vercel/analytics@1/+esm');
    
    // Initialize Web Analytics
    inject({
      // Enable debug mode in development
      debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      
      // Mode based on environment
      mode: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' ? 'development' : 'production'
    });
    
    console.log('Vercel Web Analytics initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Vercel Web Analytics:', error);
  }
})();
