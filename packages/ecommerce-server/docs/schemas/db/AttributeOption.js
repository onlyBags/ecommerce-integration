export const AttributeOption = {
  $id: 'number',
  value: {
    type: 'array',
    items: {
      type: 'string',
    },
    nullable: false,
  },
  attribute: {
    $ref: '#/components/schemas/Attribute',
  },
};
