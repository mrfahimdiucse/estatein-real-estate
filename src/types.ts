export interface Property {
  id: number | string;
  title: string;
  description: string;
  price: number;
  location: string;
  type: string;
  beds: number;
  baths: number;
  area: string;
  image: string;
  gallery?: string[];
  amenities?: string[];
  yearBuilt?: number;
  tagline?: string;
  featured?: boolean;
}
