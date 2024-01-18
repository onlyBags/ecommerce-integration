import {
  RawMagentoCategoryLink,
  RawMagentoConfigurableProductOption,
} from './index.js';

export interface RawMagentoExtensionAttributes {
  website_ids: number[];
  category_links: RawMagentoCategoryLink[];
  configurable_product_options?: RawMagentoConfigurableProductOption[];
  configurable_product_links?: number[];
  // Add other extension attributes as needed
}
