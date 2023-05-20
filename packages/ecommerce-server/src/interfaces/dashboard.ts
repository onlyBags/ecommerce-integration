export interface SaveUserReq {
  username: string;
  apiKey: string;
  masterKey: string;
}

export interface SaveUserDatasourceReq {
  id: string;
  platform: 'Woocommerce' | 'Magento';
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
}
