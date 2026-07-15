/**
 * Vercel Speed Insights Integration
 * Initializes Speed Insights for performance monitoring
 * 
 * This script imports from the CDN for production use or node_modules for local development.
 */

(async function() {
  try {
    // Import from CDN (works in production) or fallback to local module
    const { injectSpeedInsights } = await import('https://cdn.jsdelivr.net/npm/@vercel/speed-insights@2/+esm');
    
    // Initialize Speed Insights
    injectSpeedInsights({
      // Enable debug mode in development
      debug: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
      
      // Sample rate (1 = 100% of events)
      sampleRate: 1,
      
      // Framework identifier for vanilla JS
      framework: 'vanilla'
    });
    
    console.log('Vercel Speed Insights initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Vercel Speed Insights:', error);
  }
})();
