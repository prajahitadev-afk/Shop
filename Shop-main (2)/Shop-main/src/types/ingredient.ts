export interface Ingredient {
  id: string;

  name: string;

  scientificName: string;

  origin: string;

  image: string;

  color: string;

  benefits: string[];

  skinTypes: string[];

  description: string;

  historicalUse: string;

  keyProperty: string;

  image_url?: string;

  created_at?: string;
}
