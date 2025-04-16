// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
