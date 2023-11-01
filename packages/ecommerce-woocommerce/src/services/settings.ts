import { WCRequestOptions } from '@dg-live/ecommerce-data-types';
import { createNewWoocommerceInstance } from '../util/index.js';

// interface WooCommerceCurrencySettings {
//   id: string;
//   label: string;
//   description: string;
//   type: string;
//   default: string;
//   options: Record<string, string>;
//   tip: string;
//   value: string;
//   _links: {
//     self: { href: string[] };
//     collection: { href: string[] };
//   };
// }

// interface WooCommerceAllowedCountriesSettings {
//   id: string;
//   label: string;
//   description: string;
//   type: string;
//   default: string;
//   options: {
//     all: string;
//     all_except: string;
//     specific: string;
//   };
//   tip: string;
//   value: string;
//   _links: {
//     self: { href: string[] };
//     collection: { href: string[] };
//   };
// }

export const getSettings = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions) => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    const res = await wc.get('settings/general');
    return res.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
