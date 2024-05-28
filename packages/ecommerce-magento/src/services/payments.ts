import { magentoApi } from "../utils/index.js";
import {MgActions} from '@dg-live/ecommerce-data-types'

export const getAllPayments = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}) => {
  try {
    const res =  await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.PAYMENT_METHODS
    });
    console.log(res)
    debugger
    return res
  } catch (error) {
    
  }
};

export const createPaymentMethod = async ({
  apiKey,
  datasourceId,
  orderId,
}: {
  apiKey: string;
  datasourceId: number;
  orderId: string;
}) => {
  const paymentData = {
    method: 'bag-payment',
    title: 'Bag Payment',
    currency: 'USD',
  };

  try {
    const res = await magentoApi({
      apiKey,
      datasourceId,
      action: MgActions.PAYMENT_METHODS,
      method: 'POST',
      body: paymentData,
    });
    console.log(res);
    debugger
    return res;
  } catch (err) {
    console.log(err);
    throw err;
  }
};