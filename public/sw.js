self.addEventListener("push", async function (event) {
  const data = await event.data.json();
  const options = {
    body: data.body,
    // icon: "/assets/cleanfreeLogoReversed.png",
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});
