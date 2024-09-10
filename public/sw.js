self.addEventListener("push", function (event) {
  if (event.data) {
    console.log("push event operating", event);
    const data = event.data.json();
    const options = {
      body: data.body,
      // icon: "/assets/cleanfreeLogoReversed.png",
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  } else {
    console.log("This push event has no data.");
  }
});

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://skin-check-dev.vercel.app/checklist")
  );
});
