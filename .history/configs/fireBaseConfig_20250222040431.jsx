// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9i3SMp-ZsCKDroo2TId-NPH3G4jP3z2A",
  authDomain: "zora-22481.firebaseapp.com",
  projectId: "zora-22481",
  storageBucket: "zora-22481.firebasestorage.app",
  messagingSenderId: "985273226756",
  appId: "1:985273226756:web:65a8d70abf198762ed0751",
  measurementId: "G-PKTVZ4Q1H1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
