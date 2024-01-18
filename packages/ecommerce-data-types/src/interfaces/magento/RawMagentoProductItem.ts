import {
  RawMagentoExtensionAttributes,
  RawMagentoMediaGalleryEntry,
} from './index.js';

export interface RawMagentoProductItem {
  id: number;
  sku: string;
  name: string;
  attribute_set_id: number;
  price: number;
  status: number;
  visibility: number;
  type_id: string;
  created_at: string;
  updated_at: string;
  weight: number;
  extension_attributes: RawMagentoExtensionAttributes;
  product_links: any[]; // Replace 'any' with a specific type if you have a defined structure for product links
  options: any[]; // Replace 'any' with a specific type if you have a defined structure for options
  media_gallery_entries: RawMagentoMediaGalleryEntry[];
  tier_prices: any[]; // Replace 'any' with a specific type if you have a defined structure for tier prices
  custom_attributes: RawMagentoExtensionAttributes[];
}
