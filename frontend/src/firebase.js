import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDqKGsraeoUUnABLj2epLkSu5AyhwA5sGI",
  authDomain: "magnetic-be10a.firebaseapp.com",
  projectId: "magnetic-be10a",
  storageBucket: "magnetic-be10a.appspot.com",
  messagingSenderId: "105743648552",
  appId: "1:105743648552:web:9c969bf7f35942161f321d",
  databaseURL: "https://magnetic-be10a-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Initialize Realtime Database and get a reference to the service
export const database = getDatabase(app);
//Initialize the storage
export const storage = getStorage();
