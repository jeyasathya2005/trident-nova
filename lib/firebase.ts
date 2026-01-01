
import { initializeApp, getApps, getApp } from 'firebase/app';
// Fix: Using @firebase/firestore to ensure modular exports are found correctly by the bundler
import { getFirestore, collection } from '@firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyCI819H67VT3pF5ycoedn2k4qOvOhJR1Jo",
    authDomain: "tridentnova-c05a3.firebaseapp.com",
    projectId: "tridentnova-c05a3",
    storageBucket: "tridentnova-c05a3.firebasestorage.app",
    messagingSenderId: "932733572198",
    appId: "1:932733572198:web:61d019ec6c09be97b049a7",
    measurementId: "G-4YGV8E8LS6"
};

// Use singleton pattern to avoid multiple app initializations
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const PRODUCTS_COLLECTION = 'products';
export const ADMINS_COLLECTION = 'admins';
export const CATEGORIES_COLLECTION = 'categories';

export const productsRef = collection(db, PRODUCTS_COLLECTION);
export const adminsRef = collection(db, ADMINS_COLLECTION);
export const categoriesRef = collection(db, CATEGORIES_COLLECTION);
