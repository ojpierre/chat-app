import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCk3hZx2eOjPoQNocAmWcNkOe07qUu3wCY",
  authDomain: "chat-661f3.firebaseapp.com",
  projectId: "chat-661f3",
  storageBucket: "chat-661f3.appspot.com",
  messagingSenderId: "838425428494",
  appId: "1:838425428494:web:c1b9ee90424c43539af25f",
  measurementId: "G-CD2EJ1QBMK",
};

export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
