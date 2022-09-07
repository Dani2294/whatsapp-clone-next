import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: "AIzaSyAGdBLw1ufTqPPYaxpLKi3Fxk5AlkYoiLs",
	authDomain: "whatsapp-next-4775d.firebaseapp.com",
	projectId: "whatsapp-next-4775d",
	storageBucket: "whatsapp-next-4775d.appspot.com",
	messagingSenderId: "1049885195670",
	appId: "1:1049885195670:web:2eadf43ebda67e8c2431b7",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Database
export const db = getFirestore(app);

// Authentication
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
