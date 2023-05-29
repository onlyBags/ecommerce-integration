import {
  WCRequestOptions,
  WoocomerceShippingZone,
} from '../interfaces/index.js';
import { createNewWoocommerceInstance } from '../util/index.js';

export const getShippingZones = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions): Promise<WoocomerceShippingZone[]> => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    const shippingZonesRes = await wc.get('shipping/zones');
    const shippingZones = shippingZonesRes?.data as WoocomerceShippingZone[];

    if (shippingZones?.length) {
      return shippingZones;
    }
    return [];
  } catch (err) {
    throw err;
  }
};
