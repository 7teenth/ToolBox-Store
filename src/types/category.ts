import { Subcategory } from './subcategory';

export interface Category {
  id: string;
  name: string;
  image_url: string;
  slug?: string;
  subcategories?: Subcategory[];
}