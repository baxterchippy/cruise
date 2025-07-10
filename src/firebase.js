// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA2xay46GlPEvOnxbF6QdkHwarkjbz58B4",
  authDomain: "czechowiczcruise.firebaseapp.com",
  projectId: "czechowiczcruise",
  storageBucket: "czechowiczcruise.firebasestorage.app",
  messagingSenderId: "1095939303167",
  appId: "1:1095939303167:web:5719374afe50494c2f4eca",
  measurementId: "G-HCL38VFVSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

export { db };
export default app;
