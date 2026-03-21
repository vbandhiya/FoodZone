import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// NOTE: Replace these with actual Firebase config from your Firebase project settings
const firebaseConfig = {
  apiKey: "AIzaSyD7wJZ2repTheGTx4iozPP60QmmHgf1dUo",
  authDomain: "foodzone-19e8c.firebaseapp.com",
  projectId: "foodzone-19e8c",
  storageBucket: "foodzone-19e8c.firebasestorage.app",
  messagingSenderId: "501660077759",
  appId: "1:501660077759:web:a1af78bde58ae40bf5400a"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
