// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC2dHnfpx5IW4_StHZq_J2Qf1CKvj6Z2YY",
  authDomain: "almala-fragrance.firebaseapp.com",
  databaseURL: "https://almala-fragrance-default-rtdb.firebaseio.com",
  projectId: "almala-fragrance",
  storageBucket: "almala-fragrance.firebasestorage.app",
  messagingSenderId: "289286208273",
  appId: "1:289286208273:web:70e8a31786c7d2666caab0",
  measurementId: "G-737Y7DH729"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);