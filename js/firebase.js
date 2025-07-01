import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBjB7wPQvynFxpHQcjOnY2TyURM-ceKmGo",
  authDomain: "hsdiet-54647.firebaseapp.com",
  projectId: "hsdiet-54647",
  storageBucket: "hsdiet-54647.appspot.com",
  messagingSenderId: "559448029366",
  appId: "1:559448029366:web:d19b13ba83a5f3e537ce17",
  measurementId: "G-PCKG5NPT4V"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
