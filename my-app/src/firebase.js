// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries
// import { getStorage } from "firebase/storage";

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// // Your web app's Firebase configuration
// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyC2YE09rv4IGn9UGqKJtwjoUrKR6Il-C2o",
//   authDomain: "projblog-3b8b0.firebaseapp.com",
//   projectId: "projblog-3b8b0",
//   storageBucket: "projblog-3b8b0.appspot.com",
//   messagingSenderId: "164036988793",
//   appId: "1:164036988793:web:d3a82cb7a5db17ce5c29a8",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const storage = getStorage(app);
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD81sNNDyKbG7mmV8ru9BVUkBHSDugAV5Y",
  authDomain: "private-cloud-bb41d.firebaseapp.com",
  projectId: "private-cloud-bb41d",
  storageBucket: "private-cloud-bb41d.appspot.com",
  messagingSenderId: "163697095794",
  appId: "1:163697095794:web:e794655aaeeef4f376feeb",
  measurementId: "G-3DT0TZ89ZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
