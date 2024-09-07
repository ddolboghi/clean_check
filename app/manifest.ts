import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skin Check",
    short_name: "SkinCheck",
    description: "This is a progressive web app from SkinCheck.",
    start_url: "/login",
    display: "standalone",
    icons: [
      {
        src: "/assets/cleanfreeLogoReversed.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/assets/cleanfreeLogoReversed.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
