import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "beauing",
    short_name: "beauing",
    description: "beauing 웹앱입니다.",
    start_url: "/login",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    orientation: "portrait",
    icons: [
      {
        src: "/assets/beauing-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/beauing-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
