import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Skin Check",
    short_name: "SkinCheck",
    description: "This is a progressive web app from SkinCheck.",
    start_url: "/login",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    icons: [
      {
        src: "/../assets/cleanfreeLogo2.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/../assets/cleanfreeLogo2.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
