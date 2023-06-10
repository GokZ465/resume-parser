// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAWLJUKX7HHlLrexcdlFdLOUomvZUTGc60",
  authDomain: "anime-tracker-1ff2f.firebaseapp.com",
  projectId: "anime-tracker-1ff2f",
  storageBucket: "anime-tracker-1ff2f.appspot.com",
  messagingSenderId: "82654145859",
  appId: "1:82654145859:web:17858fa7cd6787f928d3f6",
  measurementId: "G-CNBLG7NVWE",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
