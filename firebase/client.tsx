import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ5Qu08j6Uv4YtBUsTF4cPwu0EI1Jn9CQ",
  authDomain: "prepwise-8db31.firebaseapp.com",
  projectId: "prepwise-8db31",
  storageBucket: "prepwise-8db31.firebasestorage.app",
  messagingSenderId: "273579448080",
  appId: "1:273579448080:web:34e64768745b7a9d4a3795",
  measurementId: "G-3GP9EJMWZ7",
};

// Initialize Firebase
const app = !getApps.length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
