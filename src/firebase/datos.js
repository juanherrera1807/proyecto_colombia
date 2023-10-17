import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCMojcJpgx2i-KOMHHZMtvwYwC8sZtqY-Y",
  authDomain: "proyecto-colombiainkjet.firebaseapp.com",
  projectId: "proyecto-colombiainkjet",
  storageBucket: "proyecto-colombiainkjet.appspot.com",
  messagingSenderId: "370376093937",
  appId: "1:370376093937:web:0426e6da12679179553950",
  measurementId: "G-H4QJWWHJW0"
};


initializeApp(firebaseConfig);
const db = getFirestore();
export default db
