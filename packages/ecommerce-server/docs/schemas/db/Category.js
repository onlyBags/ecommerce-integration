export const Category = {
  $id: 'number',
  categoryId: 'number',
  name: {
    type: 'string',
    nullable: true,
  },
  slug: {
    type: 'string',
    nullable: true,
  },
  woocommerceProduct: {
    $ref: '#/components/schemas/WoocommerceProduct',
  },
};
