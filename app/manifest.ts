import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "스킨체크",
    short_name: "스킨체크",
    description: "스킨체크 웹앱입니다.",
    start_url: "/login",
    display: "standalone",
    theme_color: "#ffffff",
    background_color: "#ffffff",
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
