self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/assets/cleanfreeLogoReversed.png",
      badge: "/assets/fillCheckbox.svg",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});
