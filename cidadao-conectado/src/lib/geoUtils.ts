export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calcula a distância entre duas coordenadas em quilômetros (Fórmula de Haversine)
 */
export function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
  const R = 6371; // Raio da Terra em km
  const dLat = degreesToRadians(coord2.lat - coord1.lat);
  const dLng = degreesToRadians(coord2.lng - coord1.lng);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(coord1.lat)) * Math.cos(degreesToRadians(coord2.lat)) * 
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
}

function degreesToRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

export function formatDistance(distanceInKm: number): string {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`.replace('.', ',');
}

export function isOpenNow(openingHours: string): boolean {
  if (!openingHours || openingHours.toLowerCase().includes("agendamento")) return false;
  
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentDecimal = currentHour + currentMinutes / 60;
  
  const matches = openingHours.match(/(\d{1,2})(h|:|h\d{2})/gi);
  if (matches && matches.length >= 2) {
    const startHour = parseInt(matches[0].replace(/\D/g, ''), 10);
    const endHour = parseInt(matches[1].replace(/\D/g, ''), 10);
    
    const isWeekend = now.getDay() === 0 || now.getDay() === 6;
    if (isWeekend && !openingHours.toLowerCase().includes('sáb') && !openingHours.toLowerCase().includes('dom')) {
      return false;
    }
    
    return currentDecimal >= startHour && currentDecimal < endHour;
  }
  return true; // Se não conseguir parsear, retorna true (como fallback visual seguro)
}
