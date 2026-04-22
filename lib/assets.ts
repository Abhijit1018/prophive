// Central asset registry — all Cloudinary image URLs
// Import from here instead of hardcoding URLs in components

const CLOUD = "https://res.cloudinary.com/dupeyfqh8/image/upload";

export const assets = {
  hero: {
    main: `${CLOUD}/v1776876622/prophive/hero/hero_main.jpg`,
  },
  cities: {
    jaipur: `${CLOUD}/v1776876623/prophive/cities/jaipur.jpg`,
    delhi: `${CLOUD}/v1776876625/prophive/cities/delhi.jpg`,
    gurugram: `${CLOUD}/v1776876627/prophive/cities/gurugram.jpg`,
  },
  categories: {
    apartment: `${CLOUD}/v1776876629/prophive/categories/apartment.jpg`,
    villa: `${CLOUD}/v1776876630/prophive/categories/villa.jpg`,
    plot: `${CLOUD}/v1776876631/prophive/categories/plot.jpg`,
    commercial: `${CLOUD}/v1776876633/prophive/categories/commercial.jpg`,
    pg_hostel: `${CLOUD}/v1776876635/prophive/categories/pg_hostel.jpg`,
  },
  auth: {
    background: `${CLOUD}/v1776876637/prophive/auth/auth_bg.jpg`,
  },
  lifestyle: {
    search: `${CLOUD}/v1776876638/prophive/lifestyle/search.jpg`,
    keys: `${CLOUD}/v1776876639/prophive/lifestyle/keys.jpg`,
    handshake: `${CLOUD}/v1776876641/prophive/lifestyle/handshake.jpg`,
  },
  // Video — using Cloudinary's sample video as placeholder
  // Replace with your own uploaded video later
  video: {
    promo: `${CLOUD}/video/upload/v1776876622/prophive/video/promo.mp4`,
  },
} as const;

// Cloudinary optimized URL helper — adds auto quality + format
export function optimizedUrl(url: string, width?: number): string {
  // Insert transformations after /upload/
  const transforms = ["q_auto", "f_auto"];
  if (width) transforms.push(`w_${width}`);
  return url.replace("/upload/", `/upload/${transforms.join(",")}/`);
}
