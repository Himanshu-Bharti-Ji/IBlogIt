// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "iblogit-a5494.firebaseapp.com",
    projectId: "iblogit-a5494",
    storageBucket: "iblogit-a5494.appspot.com",
    messagingSenderId: "168505995066",
    appId: "1:168505995066:web:40d7d9435e9e69bd84ea03"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);