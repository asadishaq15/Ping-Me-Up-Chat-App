import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyD1TjcW0nCN2biC80b3cETlwsvqmSBViuo",
  authDomain: "chat-app-97318.firebaseapp.com",
  databaseURL: "https://chat-app-97318-default-rtdb.firebaseio.com",
  projectId: "chat-app-97318",
  storageBucket: "chat-app-97318.appspot.com",
  messagingSenderId: "979449531040",
  appId: "1:979449531040:web:b521b8f5d54cc80fd617c5",
  measurementId: "G-K1ZZDG0ZBR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth =getAuth()
export const storage = getStorage()
export const db = getFirestore();