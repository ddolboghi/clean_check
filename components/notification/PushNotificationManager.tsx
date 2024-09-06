"use client";

import urlBase64ToUint8Array from "@/lib/urlBase64ToUint8Array";
import { useEffect, useState } from "react";

export default function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
      ),
    });
    setSubscription(sub);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/notification-subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId: "testMemberId",
            pushSubscription: sub,
          }),
        }
      );

      if (!res.ok) throw new Error("Insert pushSubscription failed.");
    } catch (error) {
      console.error(error);
    }
  }

  async function unsubscribeFromPush() {
    try {
      // const registration = await navigator.serviceWorker.ready;
      // const subscription = await registration.pushManager.getSubscription();
      await subscription?.unsubscribe();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/notification-unsubscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            memberId: "testMemberId",
          }),
        }
      );

      if (!res.ok) throw new Error("Delete pushSubscription failed.");
      else {
        setSubscription(null);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async function sendTestNotification() {
    if (subscription) {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/send-notification`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              memberId: "testMemberId",
            }),
          }
        );

        if (!res.ok) throw new Error("send notification failed.");
        else {
          setMessage("");
        }
      } catch (error) {
        console.error(error);
      }
    }
  }

  if (!isSupported) {
    return <p>브라우저에서는 푸시 알림이 지원되지 않습니다.</p>;
  }

  return (
    <div>
      <h3>Push Notifications</h3>
      {subscription ? (
        <>
          <p>You are subscribed to push notifications.</p>
          <button onClick={unsubscribeFromPush}>Unsubscribe</button>
          <input
            type="text"
            placeholder="Enter notification message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendTestNotification}>Send Test</button>
        </>
      ) : (
        <>
          <p>You are not subscribed to push notifications.</p>
          <button onClick={subscribeToPush}>Subscribe</button>
        </>
      )}
    </div>
  );
}
