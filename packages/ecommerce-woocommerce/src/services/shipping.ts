import {
  ShippingLocationsReq,
  WCRequestOptions,
  WoocommerceShippingZone,
} from '@dg-live/ecommerce-data-types';
import { createNewWoocommerceInstance } from '../util/index.js';

export const getShippingZones = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions): Promise<WoocommerceShippingZone[]> => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    const shippingZonesRes = await wc.get('shipping/zones');
    const shippingZones = shippingZonesRes?.data as WoocommerceShippingZone[];

    if (shippingZones?.length) {
      return shippingZones;
    }
    return [];
  } catch (err) {
    throw err;
  }
};

export const shippingLocations = async ({
  apiKey,
  datasourceId,
  shippingZoneId,
}: ShippingLocationsReq): Promise<WoocommerceShippingZone[]> => {
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey,
      datasourceId,
    });
    const shippingLocationsRes = await wc.get(
      `shipping/zones/${shippingZoneId}/locations`
    );
    const shippingLocations =
      shippingLocationsRes?.data as WoocommerceShippingZone[];

    if (shippingLocations?.length) {
      return shippingLocations;
    }
    return [];
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const shippingMethods = async ({
  apiKey,
  datasourceId,
  shippingZoneId,
}: ShippingLocationsReq) => {
  const wc = await createNewWoocommerceInstance({
    apiKey,
    datasourceId,
  });
  try {
    const methodsRes = await wc.get(`shipping/zones/${shippingZoneId}/methods`);
    return methodsRes.data;
  } catch (error) {
    console.log(error);
    debugger;
    throw error;
  }
};
