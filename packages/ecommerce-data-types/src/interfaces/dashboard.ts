export interface DGLResponse<T> {
  data: T;
  status: number;
  message: string;
}

export interface SaveUserReq {
  username: string;
  apiKey: string;
  masterKey: string;
}
export interface NewSlotReq {
  name: string;
  enabled?: boolean;
  posX: number;
  posY: number;
  posZ: number;
  sizeX: number;
  sizeY: number;
  sizeZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
}

export interface UpdateSlotReq {
  name?: string;
  enabled?: boolean;
  posX?: number;
  posY?: number;
  posZ?: number;
  sizeX?: number;
  sizeY?: number;
  sizeZ?: number;
  rotX?: number;
  rotY?: number;
  rotZ?: number;
  productId?: number;
}
export interface SaveUserDatasourceReq {
  name: string;
  wallet: string;
  platform: 'woocommerce' | 'magento';
  consumerKey: string;
  consumerSecret: string;
  accessToken?: string;
  accessTokenSecret?: string;
  baseUrl: string;
}

export interface CountriesData {
  name: string;
  code: string;
}

export interface DatasourceShippingCost {
  code: string;
  price: number;
}

export interface DatasourceShippingCostUpdate {
  price: number;
  isActive?: boolean;
}
