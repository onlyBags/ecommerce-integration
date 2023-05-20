export interface SaveUserReq {
  username: string;
  apiKey: string;
  masterKey: string;
}

export interface SaveUserKeysReq {
  id: string;
  platform: 'Woocommerce' | 'Magento';
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
  apiKey: string;
}
