// src/firebase/config.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBCvFYqc8QDx--7USYQIikPGeQBRrShxRM",
    authDomain: "scan-aa586.firebaseapp.com",
    projectId: "scan-aa586",
    storageBucket: "scan-aa586.appspot.com",
    messagingSenderId: "114134188043",
    appId: "1:114134188043:web:e09edcdcfbf7830eab070e",
};

// Initialize Firebase only if no apps exist
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
