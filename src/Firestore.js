import {initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB-SK07iPhPpJ7w8Nbt9yQRxFUzVi7h1k4",
  authDomain: "polish-scheduler.firebaseapp.com",
  projectId: "polish-scheduler",
  storageBucket: "polish-scheduler.appspot.com",
  messagingSenderId: "504785691352",
  appId: "1:504785691352:web:ec5b9cf433ea7d1aaeadad"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
