export const Image = {
  $id: 'number',
  imageId: 'number',
  dateCreated: 'string',
  dateCreatedGmt: 'string',
  dateModified: 'string',
  dateModifiedGmt: 'string',
  src: {
    type: 'string',
    nullable: true,
  },
  name: {
    type: 'string',
    nullable: true,
  },
  alt: {
    type: 'string',
    nullable: true,
  },
  woocommerceProduct: {
    $ref: '#/components/schemas/WoocommerceProduct',
  },
};
