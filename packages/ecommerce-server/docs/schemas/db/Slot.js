export const Slot = {
  $id: 'number',
  $name: 'string',
  $datasource: {
    $ref: '#/components/schemas/Datasource',
  },
  $enabled: 'boolean',
  $woocommerceProduct: {
    $ref: '#/components/schemas/WoocommerceProduct',
  },
  $posX: 'number',
  $posY: 'number',
  $posZ: 'number',
  $sizeX: 'number',
  $sizeY: 'number',
  $sizeZ: 'number',
  $rotX: 'number',
  $rotY: 'number',
  $rotZ: 'number',
};
