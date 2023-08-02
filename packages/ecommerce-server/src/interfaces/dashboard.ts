export interface SaveUserReq {
  username: string;
  apiKey: string;
  masterKey: string;
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
