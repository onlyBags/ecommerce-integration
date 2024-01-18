import { RawMagentoCustomAttribute } from './RawMagentoCustomAttribute.js';

export interface RawMagentoCategory {
  id: number;
  parent_id: number;
  name: string;
  is_active: boolean;
  position: number;
  level: number;
  children: string;
  created_at: string;
  updated_at: string;
  path: string;
  include_in_menu: boolean;
  custom_attributes: RawMagentoCustomAttribute[];
}
