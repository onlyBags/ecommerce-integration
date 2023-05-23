export interface SaveUserReq {
  username: string;
  apiKey: string;
  masterKey: string;
}

export interface SaveUserDatasourceReq {
  name: string;
  platform: 'Woocommerce' | 'Magento';
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
}
