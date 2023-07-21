import { WCRequestOptions } from './index.js';

export interface ShippingLocationsReq extends WCRequestOptions {
  shippingZoneId: number;
}
