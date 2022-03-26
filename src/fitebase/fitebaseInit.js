import { initializeApp } from "firebase/app";
import { getFirestore, doc,collection, setDoc, getDocs, updateDoc, deleteDoc } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDpRuWc2r57lr16fsYeo3_XNqhKctQvbdE",
  authDomain: "invoice-3aeeb.firebaseapp.com",
  projectId: "invoice-3aeeb",
  storageBucket: "invoice-3aeeb.appspot.com",
  messagingSenderId: "307059172621",
  appId: "1:307059172621:web:176b90e55f0c0f899bbc44",
  measurementId: "G-C5RNX05N9C"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
console.log(firebaseApp);
console.log(db);
export  {db, doc, collection, setDoc, getDocs, updateDoc, deleteDoc};
