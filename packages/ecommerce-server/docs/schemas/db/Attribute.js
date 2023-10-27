export const Attribute = {
  $id: 'number',
  $attributeId: 'number',
  $name: 'string',
  position: {
    type: 'integer',
    nullable: true,
  },
  visible: {
    type: 'boolean',
    nullable: true,
  },
  variation: {
    type: 'boolean',
    nullable: true,
  },
  options: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/AttributeOption',
    },
  },
  woocommerceProduct: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/WoocommerceProduct',
    },
  },
};
