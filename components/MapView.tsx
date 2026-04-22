"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "lucide-react";

export type MapProperty = {
  id: string;
  title: string;
  price: number;
  mode: string;
  lat: number;
  lng: number;
};

type MapViewProps = {
  properties: MapProperty[];
  city?: string;
  singlePin?: { lat: number; lng: number; title: string };
  onNearbyResults?: (props: MapProperty[]) => void;
};

const CITY_CENTERS: Record<string, [number, number]> = {
  Jaipur: [26.9124, 75.7873],
  Delhi: [28.6139, 77.209],
  Gurugram: [28.4595, 77.0266],
};

export default function MapView({ properties, city, singlePin, onNearbyResults }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const [locating, setLocating] = useState(false);

  const initialCenter: [number, number] =
    city && CITY_CENTERS[city]
      ? CITY_CENTERS[city]
      : singlePin
      ? [singlePin.lat, singlePin.lng]
      : CITY_CENTERS["Delhi"];

  useEffect(() => {
    if (!mapContainer.current) return;

    // Destroy any existing map instance before creating a new one
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markersRef.current = [];
    }

    let destroyed = false;

    import("leaflet").then((mod) => {
      if (destroyed || !mapContainer.current) return;

      const L = mod.default;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapContainer.current, {
        center: initialCenter,
        zoom: singlePin ? 14 : city ? 11 : 10,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      addMarkers(L, map);
    });

    return () => {
      destroyed = true;
      mapRef.current?.remove();
      mapRef.current = null;
      markersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addMarkers(L: typeof import("leaflet"), map: import("leaflet").Map) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    if (singlePin) {
      const marker = L.marker([singlePin.lat, singlePin.lng])
        .addTo(map)
        .bindPopup(`<strong>${singlePin.title}</strong>`);
      markersRef.current.push(marker);
      return;
    }

    properties.forEach((prop) => {
      if (!prop.lat || !prop.lng) return;

      const formattedPrice =
        prop.mode === "RENT"
          ? `₹${prop.price.toLocaleString("en-IN")}/mo`
          : `₹${(prop.price / 100000).toFixed(1)}L`;

      const icon = L.divIcon({
        html: `<div style="background:#ea580c;color:white;font-size:11px;font-weight:700;padding:4px 8px;border-radius:9999px;box-shadow:0 2px 8px rgba(0,0,0,0.3);white-space:nowrap;">${formattedPrice}</div>`,
        className: "",
        iconAnchor: [0, 0],
      });

      const popup = `<div style="min-width:140px"><p style="font-weight:600;font-size:13px;margin:0 0 2px">${prop.title}</p><p style="color:#ea580c;font-weight:700;margin:0 0 4px">${formattedPrice}</p><a href="/property/${prop.id}" style="font-size:11px;color:#2563eb">View details →</a></div>`;

      const marker = L.marker([prop.lat, prop.lng], { icon })
        .addTo(map)
        .bindPopup(popup);

      markersRef.current.push(marker);
    });

    if (properties.length > 1) {
      const valid = properties.filter((p) => p.lat && p.lng);
      if (valid.length > 0) {
        const bounds = L.latLngBounds(valid.map((p) => [p.lat, p.lng]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    }
  }

  // Re-add markers when properties change (after initial load)
  useEffect(() => {
    if (!mapRef.current) return;
    import("leaflet").then((mod) => {
      addMarkers(mod.default, mapRef.current!);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [properties, singlePin]);

  function handleNearMe() {
    if (!navigator.geolocation || !mapRef.current) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        const { latitude: lat, longitude: lng } = pos.coords;
        const map = mapRef.current;
        if (!map) return;

        import("leaflet").then((mod) => {
          const L = mod.default;
          map.flyTo([lat, lng], 12);

          const userIcon = L.divIcon({
            html: `<div style="width:16px;height:16px;background:#3b82f6;border-radius:50%;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
            className: "",
            iconAnchor: [8, 8],
          });
          L.marker([lat, lng], { icon: userIcon }).addTo(map).bindPopup("You are here");

          if (onNearbyResults) {
            fetch(`/api/properties/nearby?lat=${lat}&lng=${lng}`)
              .then((r) => r.json())
              .then((data) => {
                if (data.properties) onNearbyResults(data.properties as MapProperty[]);
              })
              .catch(() => {});
          }
        });
      },
      () => setLocating(false)
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      />
      <div ref={mapContainer} className="h-[400px] w-full bg-gray-100 dark:bg-gray-800" />
      {!singlePin && (
        <Button
          size="sm"
          onClick={handleNearMe}
          disabled={locating}
          className="absolute bottom-4 left-4 z-[1000] bg-white text-gray-800 shadow-md hover:bg-gray-50 border border-gray-200"
        >
          <Navigation className="h-4 w-4 mr-1.5" />
          {locating ? "Locating..." : "Near Me"}
        </Button>
      )}
    </div>
  );
}
