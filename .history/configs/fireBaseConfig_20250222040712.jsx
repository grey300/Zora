// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: PROCESS.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "zora-22481.firebaseapp.com",
  projectId: "zora-22481",
  storageBucket: "zora-22481.firebasestorage.app",
  messagingSenderId: "985273226756",
  appId: "1:985273226756:web:65a8d70abf198762ed0751",
  measurementId: "G-PKTVZ4Q1H1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage();
