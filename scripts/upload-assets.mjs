// Script to upload generated images to Cloudinary
// Run: node scripts/upload-assets.mjs
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import path from "path";

cloudinary.config({
  cloud_name: "dupeyfqh8",
  api_key: "191396433295353",
  api_secret: "ahFrKF2kFFwv9jDQTHLYuItUPUI",
});

const ASSETS_DIR = "C:\\Users\\rotho\\.gemini\\antigravity\\brain\\1f7561a2-5829-4bf1-84a1-be721cff82af";

const uploads = [
  { file: "hero_background_1776876359941.png", folder: "prophive/hero", name: "hero_main" },
  { file: "city_jaipur_1776876376151.png", folder: "prophive/cities", name: "jaipur" },
  { file: "city_delhi_1776876394137.png", folder: "prophive/cities", name: "delhi" },
  { file: "city_gurugram_1776876415098.png", folder: "prophive/cities", name: "gurugram" },
  { file: "category_apartment_1776876435192.png", folder: "prophive/categories", name: "apartment" },
  { file: "category_villa_1776876451607.png", folder: "prophive/categories", name: "villa" },
  { file: "category_plot_1776876472109.png", folder: "prophive/categories", name: "plot" },
  { file: "category_commercial_1776876491245.png", folder: "prophive/categories", name: "commercial" },
  { file: "category_pg_1776876507003.png", folder: "prophive/categories", name: "pg_hostel" },
  { file: "auth_background_1776876529908.png", folder: "prophive/auth", name: "auth_bg" },
  { file: "lifestyle_search_1776876543742.png", folder: "prophive/lifestyle", name: "search" },
  { file: "lifestyle_keys_1776876559329.png", folder: "prophive/lifestyle", name: "keys" },
  { file: "lifestyle_handshake_1776876579830.png", folder: "prophive/lifestyle", name: "handshake" },
];

const results = {};

for (const { file, folder, name } of uploads) {
  const filePath = path.join(ASSETS_DIR, file);
  if (!fs.existsSync(filePath)) {
    console.log(`SKIP: ${file} not found`);
    continue;
  }
  try {
    const res = await cloudinary.uploader.upload(filePath, {
      folder,
      public_id: name,
      overwrite: true,
      resource_type: "image",
      transformation: [{ quality: "auto:best", fetch_format: "auto" }],
    });
    results[name] = res.secure_url;
    console.log(`OK: ${name} → ${res.secure_url}`);
  } catch (err) {
    console.log(`FAIL: ${name} → ${err.message}`);
  }
}

console.log("\n\n=== ASSET URLS ===");
console.log(JSON.stringify(results, null, 2));
