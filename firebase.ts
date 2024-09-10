import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCyYiX0wSuvYN0Fcj9X0uK_c5V61GLB8eY",
  authDomain: "skin-check-2001e.firebaseapp.com",
  projectId: "skin-check-2001e",
  storageBucket: "skin-check-2001e.appspot.com",
  messagingSenderId: "664553089796",
  appId: "1:664553089796:web:27705746c0564b8f0f3e51",
  measurementId: "G-Y838JL8F9P",
};

let messaging: Messaging | undefined;
if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  const app = initializeApp(firebaseConfig);
  messaging = getMessaging(app);
}
export { messaging };
