"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { PhysicalUnit, mockUnits } from "@/data/mockUnits";
import { Coordinates, calculateDistance, formatDistance, isOpenNow } from "@/lib/geoUtils";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Crosshair, Phone } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// Carregamento dinâmico para evitar erros SSR com o objeto window no Leaflet
const DynamicMap = dynamic(() => import("./InteractiveMap"), { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse text-muted-foreground">Carregando Mapa...</div> });

export function FacilitiesMapView() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Ordena por distância se tiver localização
  const sortedUnits = useMemo(() => {
    if (!userLocation) return mockUnits;
    
    return [...mockUnits].sort((a, b) => {
      const distA = calculateDistance(userLocation, { lat: a.lat, lng: a.lng });
      const distB = calculateDistance(userLocation, { lat: b.lat, lng: b.lng });
      return distA - distB;
    });
  }, [userLocation]);

  const requestLocation = () => {
    setIsAlertOpen(true);
  };

  const confirmLocationPermission = () => {
    setIsAlertOpen(false);
    setIsLoadingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error("Erro de geolocalização:", error);
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setIsLoadingLocation(false);
    }
  };

  const handleRouteClick = (unit: PhysicalUnit, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `https://www.google.com/maps/dir/?api=1&destination=${unit.lat},${unit.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-12 h-full w-full relative">
      
      {/* Alerta de Privacidade de Localização */}
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Permissão de Localização
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              Precisamos da sua localização atual <strong>apenas</strong> para encontrar o CRAS ou posto de atendimento mais próximo de você.
              <br /><br />
              Nenhum dado de rastreamento será salvo nos nossos servidores.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsAlertOpen(false)}>Cancelar</Button>
            <Button onClick={confirmLocationPermission}>Aceitar e Encontrar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Visão de Lista (Cards) - Lado Esquerdo Desktop, Base Mobile */}
      <div className="order-2 md:order-1 col-span-1 md:col-span-4 lg:col-span-3 h-[50vh] md:h-full bg-background border-r border-border flex flex-col z-10 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] md:shadow-none">
        
        <div className="p-4 border-b border-border/50 sticky top-0 bg-background/95 backdrop-blur z-10 flex flex-col gap-3">
          <h1 className="text-xl font-bold tracking-tight">Unidades de Atendimento</h1>
          <p className="text-sm text-muted-foreground">Encontre postos físicos próximos para resolver suas pendências.</p>
          
          <Button 
            onClick={requestLocation} 
            disabled={isLoadingLocation || !!userLocation}
            variant={userLocation ? "secondary" : "default"}
            className="w-full justify-start gap-2 mt-1 shadow-sm"
          >
            <Crosshair className={`w-4 h-4 ${isLoadingLocation ? 'animate-spin' : ''}`} />
            {isLoadingLocation ? 'Obtendo localização...' : userLocation ? 'Localização Ativa' : 'Usar minha localização'}
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {sortedUnits.map(unit => {
            const distance = userLocation ? calculateDistance(userLocation, { lat: unit.lat, lng: unit.lng }) : null;
            const open = isOpenNow(unit.openingHours);
            
            return (
              <div 
                key={unit.id}
                onClick={() => setSelectedUnitId(unit.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer bg-card/50 hover:bg-card hover:shadow-md ${selectedUnitId === unit.id ? 'border-primary shadow-sm bg-primary/5' : 'border-border'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-base line-clamp-1 flex-1 pr-2">{unit.name}</h3>
                  <div className="flex flex-col items-end shrink-0">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm ${open ? 'bg-green-500/15 text-green-700 dark:text-green-400' : 'bg-muted text-muted-foreground'}`}>
                      {open ? 'Aberto' : 'Fechado'}
                    </span>
                    {distance !== null && (
                      <span className="text-xs font-medium text-muted-foreground mt-1">
                        a {formatDistance(distance)}
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{unit.address}</p>
                
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border/50">
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Phone className="w-3 h-3 mr-1.5" />
                    {unit.phone}
                  </div>
                  
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 px-2 text-primary hover:text-primary hover:bg-primary/10"
                    onClick={(e) => handleRouteClick(unit, e)}
                  >
                    <Navigation className="w-4 h-4 mr-1.5" />
                    Traçar Rota
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visão do Mapa - Lado Direito Desktop, Topo Mobile */}
      <div className="order-1 md:order-2 col-span-1 md:col-span-8 lg:col-span-9 h-[50vh] md:h-full bg-muted relative">
        <DynamicMap 
          units={mockUnits} 
          userLocation={userLocation} 
          selectedUnitId={selectedUnitId} 
        />
      </div>

    </div>
  );
}
