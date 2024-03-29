export const environment = {
  production: true,
  apiBaseUrl: 'http://localhost:8000',
  firebaseConfig: {
    apiKey: process.env['FIREBASE_API_KEY'],
    authDomain: process.env['FIREBASE_DOMAIN'],
    projectId: process.env['FIREBASE_PROJECT'],
    storageBucket: process.env['FIREBASE_STORAGE'],
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER'],
    appId: process.env['FIREBASE_APP'],
  },
};
