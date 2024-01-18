export interface RawMagentoConfigurableProductOption {
  id: number;
  attribute_id: string;
  label: string;
  position: number;
  values: { value_index: number }[];
  product_id: number;
}
