import { initializeApp } from "firebase/app";
import { getMessaging, Messaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FCM_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FCM_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FCM_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FCM_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FCM_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FCM_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FCM_MEASUREMENT_ID,
};

export const app = initializeApp(firebaseConfig);
// let messaging: Messaging | undefined;
// if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
//   messaging = getMessaging(app);
// }
// export { messaging };
