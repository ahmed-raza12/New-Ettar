// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAuhzILUGNjDkLknvrPBxZ7xMHNg89GSiA",
  authDomain: "udinfragrance.firebaseapp.com",
  projectId: "udinfragrance",
  storageBucket: "udinfragrance.firebasestorage.app",
  messagingSenderId: "794039995234",
  appId: "1:794039995234:web:91eddf229771f37745ba3b",
  measurementId: "G-ZN4LMSHH6X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);