export const SaveUserReq = {
  username: 'string',
  apiKey: 'string',
  masterKey: 'string',
};

export const NewSlotReq = {
  name: 'string',
  enabled: 'boolean',
  $posX: 'number',
  $posY: 'number',
  posZ: 'number',
  sizeX: 'number',
  sizeY: 'number',
  sizeZ: 'number',
  rotX: 'number',
  rotY: 'number',
  rotZ: 'number',
};

export const SaveUserDatasourceReq = {
  name: 'Datasource-name',
  wallet: '0x123',
  platform: 'woocommerce | magento',
  consumerKey: 'string',
  consumerSecret: 'string',
  accessToken: 'string',
  accessTokenSecret: 'string',
  baseUrl: 'string',
};

export const UpdateSlotReq = {
  name: 'string',
  enabled: 'boolean',
  posX: 'number',
  posY: 'number',
  posZ: 'number',
  sizeX: 'number',
  sizeY: 'number',
  sizeZ: 'number',
  rotX: 'number',
  rotY: 'number',
  rotZ: 'number',
  productId: 'number',
};

export const DGLResponse_Slot = {
  data: {
    $ref: '#/components/schemas/Slot',
  },
  status: 0,
  message: 'string',
};

export const DGLResponse_Slots = {
  data: [
    {
      $ref: '#/components/schemas/Slot',
    },
  ],
  status: 0,
  message: 'string',
};

export const DGLResponse_User = {
  data: {
    $ref: '#/components/schemas/User',
  },
  status: 0,
  message: 'string',
};

export const DGLResponse_Datasource = {
  data: {
    $ref: '#/components/schemas/Datasource',
  },
  status: 0,
  message: 'string',
};

export const DGLResponse_Datasources = {
  data: [
    {
      $ref: '#/components/schemas/Datasource',
    },
  ],
  status: 0,
  message: 'string',
};
