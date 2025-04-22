// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDIutHUc-ujomADfztUXVeBHhG-tMBdUDw",
    authDomain: "hae-78d29.firebaseapp.com",
    projectId: "hae-78d29",
    storageBucket: "hae-78d29.firebasestorage.app",
    messagingSenderId: "135927361386",
    appId: "1:135927361386:web:de7db0121afd4fb3c4bf13",
    measurementId: "G-LX28S4JYK4",
}

// Initialize Firebase app only once
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth,db }
