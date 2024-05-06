import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB42lDbIyOwJCb_05QHFDWaRvW03uHGdDY",
    authDomain: "kanban-board-next.firebaseapp.com",
    projectId: "kanban-board-next",
    storageBucket: "kanban-board-next.appspot.com",
    messagingSenderId: "803642073099",
    appId: "1:803642073099:web:b89ba29d9d95f0e4da270e",
    measurementId: "G-V3HMSMV444"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firestore and export it
export const db = getFirestore(app);