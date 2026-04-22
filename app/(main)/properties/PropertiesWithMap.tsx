"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import type { MapProperty } from "@/components/MapView";

const MapView = dynamic(() => import("@/components/MapView"), { ssr: false });

type Props = {
  initialMapProps: MapProperty[];
  city?: string;
  children: React.ReactNode;
};

export default function PropertiesWithMap({ initialMapProps, city, children }: Props) {
  const [mapProps, setMapProps] = useState(initialMapProps);

  if (initialMapProps.length === 0) return <>{children}</>;

  return (
    <>
      <div className="mb-6">
        <MapView
          properties={mapProps}
          city={city}
          onNearbyResults={(nearby) => setMapProps(nearby)}
        />
      </div>
      {children}
    </>
  );
}
