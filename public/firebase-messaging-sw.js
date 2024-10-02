importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.2/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyCyYiX0wSuvYN0Fcj9X0uK_c5V61GLB8eY",
  authDomain: "skin-check-2001e.firebaseapp.com",
  projectId: "skin-check-2001e",
  storageBucket: "skin-check-2001e.appspot.com",
  messagingSenderId: "664553089796",
  appId: "1:664553089796:web:27705746c0564b8f0f3e51",
  measurementId: "G-Y838JL8F9P",
});

const messaging = firebase.messaging();

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json().data;
    const options = {
      body: data.body,
      icon: "/assets/beauing-32x32.png",
      badge: "/assets/beauing-32x32.png",
    };

    const notificationData = {
      title: data.title,
      options: options,
      path: data.path,
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options, notificationData)
    );
  } else {
    console.log("This push event has no data.");
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  const path = event.notification.data.path;
  const host =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL;
  event.waitUntil(clients.openWindow(`${host}${path}`));
});
