import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";  //login register islemleri icin
import { getFirestore } from "firebase/firestore"; //veritabanı için

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.evn.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.APPID
};

//Firebase başlatıyorum
const app = initializeApp(firebaseConfig);

//servisleri dışarı açıyoruz diğer dosyalarda kullanmak için
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;