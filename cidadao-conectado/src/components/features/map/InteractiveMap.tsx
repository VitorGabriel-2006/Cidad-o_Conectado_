"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { PhysicalUnit } from "@/data/mockUnits";
import { Coordinates } from "@/lib/geoUtils";
import { Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

// Fix Leaflet marker icons in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface InteractiveMapProps {
  units: PhysicalUnit[];
  userLocation: Coordinates | null;
  selectedUnitId: string | null;
}

// Controls the map center/zoom dynamically
function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

export default function InteractiveMap({ units, userLocation, selectedUnitId }: InteractiveMapProps) {
  const defaultCenter: [number, number] = [-15.8016, -47.8865]; // Brasília
  
  const mapCenter: [number, number] = userLocation 
    ? [userLocation.lat, userLocation.lng] 
    : defaultCenter;

  let activeCenter = mapCenter;
  let activeZoom = userLocation ? 13 : 4;

  if (selectedUnitId) {
    const unit = units.find(u => u.id === selectedUnitId);
    if (unit) {
      activeCenter = [unit.lat, unit.lng];
      activeZoom = 15;
    }
  }

  const handleRouteClick = (unit: PhysicalUnit) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${unit.lat},${unit.lng}`;
    window.open(url, '_blank');
  };

  return (
    <MapContainer 
      center={activeCenter} 
      zoom={activeZoom} 
      style={{ height: "100%", width: "100%", zIndex: 10 }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
      />
      
      <MapController center={activeCenter} zoom={activeZoom} />

      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]}>
          <Popup>
            <div className="font-semibold text-sm">Sua Localização Atual</div>
          </Popup>
        </Marker>
      )}

      {units.map((unit) => (
        <Marker key={unit.id} position={[unit.lat, unit.lng]}>
          <Popup className="custom-popup">
            <div className="p-1 min-w-[200px]">
              <h3 className="font-bold text-base mb-1">{unit.name}</h3>
              <p className="text-sm text-muted-foreground mb-1">{unit.type}</p>
              <p className="text-xs mb-1"><strong>Horário:</strong> {unit.openingHours}</p>
              <p className="text-xs mb-3 truncate">{unit.address}</p>
              <Button 
                size="sm" 
                className="w-full text-xs h-8"
                onClick={() => handleRouteClick(unit)}
              >
                <Navigation className="w-3 h-3 mr-2" />
                Traçar Rota
              </Button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
