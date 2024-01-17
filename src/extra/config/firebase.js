import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBIgCvhy-w3Nmx3g9gAdltV6MwXAfGaAek",
  authDomain: "remoteworker-f45af.firebaseapp.com",
  projectId: "remoteworker-f45af",
  storageBucket: "remoteworker-f45af.appspot.com",
  messagingSenderId: "509919911129",
  appId: "1:509919911129:web:747c70e1e830cf6bc2b2c8",
  measurementId: "G-RCPW47LZS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();

export const db = getFirestore(app);