import { WCRequestOptions } from '@dg-live/ecommerce-data-types';
import { createNewWoocommerceInstance } from '../util/index.js';

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
    debugger;
    return res.data;
  } catch (err) {
    throw new Error(err.message);
  }
};
