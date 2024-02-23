const { EnvironmentPlugin } = require('webpack');
// Add additional requirements here

// If you're using dotenv
require('dotenv').config();

// Export a configuration object
// See [Wepack's documentation](https://webpack.js.org/configuration/) for additional ideas of how to
// customize your build beyond what Angular provides.
module.exports = {
  plugins: [
    new EnvironmentPlugin([
      // Insert the keys to your environment variables here.
      'API_BASE_URL',
      'FIREBASE_API_KEY',
      'FIREBASE_DOMAIN',
      'FIREBASE_PROJECT',
      'FIREBASE_STORAGE',
      'FIREBASE_MESSAGING_SENDER',
      'FIREBASE_APP',
    ]),
  ],
};
