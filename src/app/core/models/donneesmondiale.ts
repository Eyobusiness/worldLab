export interface DonneesMondiale {
  cca2: string;
  cca3: string;
  name: { common: string; official: string };
  flags: { svg: string; png: string; alt?: string };
  capital?: string[];
  region: string;
  subregion?: string;
  population: number;
  area?: number;
  languages?: { [key: string]: string };
  currencies?: { [key: string]: { name: string; symbol: string } };
  borders?: string[];
  timezones?: string[];
  tld?: string[];

  // ← Coordonnées du centre du pays [lat, lng]
  latlng?: [number, number];

  // ← Coordonnées de la capitale
  capitalInfo?: {
    latlng?: [number, number];
  };
}
