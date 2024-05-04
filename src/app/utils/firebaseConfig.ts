import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.API_KEY as string,
    authDomain: process.env.AUTH_DOMAIN as string,
    projectId: process.env.PROJECT_ID as string,
    storageBucket: process.env.STORAGE_BUCKET as string,
    messagingSenderId: process.env.MESSAGING_SENDER_ID as string,
    appId: process.env.APP_ID as string,
    measurementId: process.env.MEASUREMENT_ID as string,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore and export it
export const db = getFirestore(app);