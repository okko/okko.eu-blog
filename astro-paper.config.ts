import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://okko.eu/",
    title: "Okko.eu",
    description: "Personal blog of Oskari Okko Ojala",
    author: "Oskari Okko Ojala",
    profile: "https://okko.eu",
    ogImage: "default-og.jpg",
    lang: "en",
    timezone: "Europe/Helsinki",
    dir: "ltr",
  },
  posts: {
    perPage: 4,
    perIndex: 4,
    scheduledPostMargin: 15 * 60 * 1000,
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: true,
    showBackButton: true,
    editPost: {
      enabled: false
    },
  },
  socials: [],
  shareLinks: [  ],
});