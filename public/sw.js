self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: "/assets/cleanfreeLogoReversed.png",
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});
