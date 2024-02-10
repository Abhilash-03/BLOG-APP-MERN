import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mern-blog-4e18f.firebaseapp.com",
  projectId: "mern-blog-4e18f",
  storageBucket: "mern-blog-4e18f.appspot.com",
  messagingSenderId: "381715295145",
  appId: "1:381715295145:web:2c2a913fb8819c41fa32b8"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);