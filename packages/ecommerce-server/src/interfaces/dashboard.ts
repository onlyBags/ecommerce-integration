export interface SaveUserReq {
  username: string;
  apiKey: string;
  masterKey: string;
}

export interface SaveUserDatasourceReq {
  platform: 'Woocommerce' | 'Magento';
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
}
