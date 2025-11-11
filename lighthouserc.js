// Load environment variables
require('dotenv').config();

module.exports = {
  ci: {
    collect: {
      url: [
        'https://compareclash.netlify.app/',
        'https://compareclash.netlify.app/blog',
      ],
      numberOfRuns: 3,
      // Configure Chrome executable path for Brave browser
      chromeFlags: '--no-sandbox --disable-dev-shm-usage',
      // Try common Brave/Chrome installation paths on Windows
      chromePath: [
        'C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
        'C:\\Program Files (x86)\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
        'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\BraveSoftware\\Brave-Browser\\Application\\brave.exe',
        // Fallback to standard Chrome paths
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Users\\' + process.env.USERNAME + '\\AppData\\Local\\Google\\Chrome\\Application\\chrome.exe',
      ].find(path => {
        try {
          require('fs').accessSync(path, require('fs').constants.F_OK);
          return true;
        } catch (e) {
          return false;
        }
      }),
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.95 }],
        'categories:accessibility': ['warn', { minScore: 0.98 }],
        'categories:best-practices': ['warn', { minScore: 0.96 }],
        'categories:seo': ['warn', { minScore: 1.0 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
