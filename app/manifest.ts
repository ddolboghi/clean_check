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
        src: "/assets/cleanfreeLogoReversed.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/cleanfreeLogoReversed.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/assets/cleanfreeLogoReversed.png",
        sizes: "615x615",
        type: "image/png",
      },
    ],
  };
}
