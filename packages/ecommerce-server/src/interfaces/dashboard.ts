export interface SaveUserReq {
  username: string;
  platform: 'Woocommerce' | 'Magento';
  clientKey: string;
  clientSecret: string;
}
