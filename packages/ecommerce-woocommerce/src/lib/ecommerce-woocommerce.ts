import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const WooCommerce = new WooCommerceRestApi({
  url: 'https://tonicabsas.ar/',
  consumerKey: 'ck_c339fb7a2fce297327145b983dbed8b8414755a8',
  consumerSecret: 'cs_d14f4b9599c3ed573e70c66141bc5011d8a44ecb',
  version: 'wc/v3',
});
export * from '../services/index.js';

export { WooCommerce };
