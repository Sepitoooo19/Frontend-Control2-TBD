export function latLngToWKT(lat: number, lng: number): string {
  return `POINT(${lng} ${lat})`;
}

export function wktToLatLng(wkt: string): { lat: number; lng: number } | null {
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    return { lat, lng };
  }
  return null;
}

export function wktToLatLngArray(wkt: string): Array<{ lat: number; lng: number }> | null {
  const match = wkt.match(/POINT\(([^ ]+) ([^ ]+)\)/);
  if (match) {
    const lng = parseFloat(match[1]);
    const lat = parseFloat(match[2]);
    return [{ lat, lng }];
  }
  return null;
}
export function wktToLatLngArrayMulti(wkt: string): Array<{ lat: number; lng: number }> | null {
  const match = wkt.match(/MULTIPOINT\(([^)]+)\)/);
  if (match) {
    const points = match[1].split(',').map(point => {
      const coords = point.trim().split(' ');
      return { lat: parseFloat(coords[1]), lng: parseFloat(coords[0]) };
    });
    return points;
  }
  return null;
}

export function latLngArrayToWKT(points: Array<{ lat: number; lng: number }>): string {
  const wktPoints = points.map(point => `${point.lng} ${point.lat}`).join(', ');
  return `MULTIPOINT(${wktPoints})`;
}
