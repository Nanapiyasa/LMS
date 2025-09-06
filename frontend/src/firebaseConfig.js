// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCAhPfCziEjhCqMdJReszMCVKeEJt1mh-0",
  authDomain: "nanapiyasa-dfe8b.firebaseapp.com",
  projectId: "nanapiyasa-dfe8b",
  storageBucket: "nanapiyasa-dfe8b.firebasestorage.app",
  messagingSenderId: "718157700613",
  appId: "1:718157700613:web:cecd3a3a1f335ad534066c",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
