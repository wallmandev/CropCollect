export interface GeoData {
    user_id: string;
    latitude: number;
    longitude: number;
    businessAddress: string;
    geohash?: string;
    geoJson?: {
      type: string;
      coordinates: [number, number];
    };
  }
  