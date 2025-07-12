// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnFBHzhi0DXow1idaEbGe_PYx1kwrznFE",
  authDomain: "authentication-2c8bf.firebaseapp.com",
  projectId: "authentication-2c8bf",
  storageBucket: "authentication-2c8bf.firebasestorage.app",
  messagingSenderId: "345631964282",
  appId: "1:345631964282:web:0841f36b81b6641c3c4fc3",
  measurementId: "G-GW3F3TYEYJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider, signInWithPopup, signOut };
