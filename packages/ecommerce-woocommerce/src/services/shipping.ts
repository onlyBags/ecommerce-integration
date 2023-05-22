import { createNewWoocommerceInstance } from '../util/index.js';

export const getShippingZones = async ({
  apiKey,
  datasourceId,
}: any): Promise<any> => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    const shippingZones = await wc.get('shipping/zones');
    if (shippingZones?.data?.length) return shippingZones.data as any;
    return [];
  } catch (err) {
    throw err;
  }
};
