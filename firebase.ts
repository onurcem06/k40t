import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyC2SOD9wR1lT435TG2eX2wTHQFwbNxyzwyY",
  authDomain: "k40t-02.firebaseapp.com",
  // BU SATIR OLMAZSA SİSTEM ASLA ÇALIŞMAZ:
  databaseURL: "https://k40t-02-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "k40t-02",
  storageBucket: "k40t-02.firebasestorage.app",
  messagingSenderId: "666420827742",
  appId: "1:666420827742:web:28db38f1748f766abb46cf"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);