const admin = require('firebase-admin');

// Note: Replace this with the path to your actual serviceAccountKey.json 
// which you can generate from Firebase Console -> Project Settings -> Service Accounts
// Make sure NOT to commit the JSON file to public version control!
try {
  let serviceAccount;
  
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Vercel / Cloud Secure Method
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  } else {
    // Local Developer Method
    serviceAccount = require('./serviceAccountKey.json');
  }

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  console.log("Firebase Admin Initialized successfully.");
} catch (error) {
  console.warn("Firebase Admin SDK failed to initialize. Ensure FIREBASE_SERVICE_ACCOUNT_KEY environment variable is set on Vercel.", error.message);
}

const db = admin.apps.length ? admin.firestore() : null;
const auth = admin.apps.length ? admin.auth() : null;

module.exports = { admin, db, auth };
