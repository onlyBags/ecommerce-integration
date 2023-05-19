export interface SaveUserReq {
  username: string;
  platform: 'Woocommerce' | 'Magento';
  consumerKey: string;
  consumerSecret: string;
  baseUrl: string;
  apiKey: string;
}
