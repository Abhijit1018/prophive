export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export const ACTIVE_CITIES = ["Jaipur", "Delhi", "Gurugram"] as const;
export type ActiveCity = (typeof ACTIVE_CITIES)[number];

export const COMING_SOON_CITIES = [
  "Mumbai",
  "Pune",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
] as const;

export const CITY_CENTERS: Record<string, [number, number]> = {
  Jaipur: [75.7873, 26.9124],
  Delhi: [77.209, 28.6139],
  Gurugram: [77.0266, 28.4595],
};

export function isComingSoonCity(city: string): boolean {
  return (COMING_SOON_CITIES as readonly string[]).includes(city);
}
