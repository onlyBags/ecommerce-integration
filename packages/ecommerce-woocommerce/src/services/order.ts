import { createNewWoocommerceInstance } from '../util/index.js';
import {
  WoocommerceOrderReq,
  WCOrderCreated,
  BillingReq,
  ShippingReq,
  WCValidateOrderData,
  OnlyBagsOrderRequest,
  OnlyBagsOrderCreatedRes,
} from '@dg-live/ecommerce-data-types';

import { AxiosResponse } from 'axios';
import {
  AppDataSource,
  Billing,
  Shipping,
  Order,
  Customer,
  User,
  Datasource,
} from '@dg-live/ecommerce-db';

import {
  getBagPrice,
  getCustomer,
  mapBillingWCBilling,
  mapShippingWCShipping,
  saveBilling,
  saveShipping,
} from '@dg-live/ecommerce-customer';

const orderRepository = AppDataSource.getRepository(Order);
const customerRepository = AppDataSource.getRepository(Customer);
const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);
const shippingRepository = AppDataSource.getRepository(Shipping);
const billingRepository = AppDataSource.getRepository(Billing);

export const saveOrder = async (
  order: WCOrderCreated,
  customer: Customer,
  datasourceId: number,
  paymentMethod: string
) => {
  const mockData = {
    id: 131,
    parent_id: 0,
    status: 'processing',
    currency: 'USD',
    version: '7.8.1',
    prices_include_tax: false,
    date_created: '2023-07-20T15:20:23',
    date_modified: '2023-07-20T15:20:23',
    discount_total: '0.00',
    discount_tax: '0.00',
    shipping_total: '10.00',
    shipping_tax: '0.00',
    cart_tax: '0.00',
    total: '15148.00',
    total_tax: '0.00',
    customer_id: 0,
    order_key: 'wc_order_PKMfHz2cMUUPv',
    payment_method: 'bacs',
    payment_method_title: 'Direct Bank Transfer',
    transaction_id: '',
    customer_ip_address: '',
    customer_user_agent: '',
    created_via: 'rest-api',
    customer_note: '',
    date_completed: null,
    date_paid: '2023-07-20T15:20:23',
    cart_hash: '',
    number: '131',
    payment_url:
      'https://demostore.unversed.org/checkout/order-pay/131/?pay_for_order=true&key=wc_order_PKMfHz2cMUUPv',
    is_editable: false,
    needs_payment: false,
    needs_processing: true,
    date_created_gmt: '2023-07-20T15:20:23',
    date_modified_gmt: '2023-07-20T15:20:23',
    date_completed_gmt: null,
    date_paid_gmt: '2023-07-20T15:20:23',
    currency_symbol: '$',
  };
  const datasource = await datasourceRepository.findOneBy({
    id: datasourceId,
  });
  if (!datasource) throw new Error('Datasource not found');
  try {
    const orderToSave = new Order();
    const bagPrice = await getBagPrice();
    orderToSave.storeOrderId = order.id.toString();
    orderToSave.paymentMethod = paymentMethod;
    orderToSave.orderKey = order.order_key;
    orderToSave.status = order.status;
    orderToSave.customer = customer;
    orderToSave.total = +order.total;
    orderToSave.currency = order.currency;
    orderToSave.datasource = datasource;
    // orderToSave.totalIce = +order.total / icePrice.data.quote.USD.price;
    orderToSave.totalIce = 0;
    orderToSave.iceValue = bagPrice.data.quote.USD.price;
    orderToSave.iceValueTimestamp = new Date(bagPrice.data.last_updated);
    const savedOrder = await orderRepository.save(orderToSave);
    return savedOrder;
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const createOrder = async (
  datasourceId: number,
  order: OnlyBagsOrderRequest
): Promise<OnlyBagsOrderCreatedRes> => {
  let wcShipping: ShippingReq;
  let wcBilling: BillingReq;
  const foundUser = await userRepository.findOne({
    relations: {
      datasource: true,
    },
    where: {
      datasource: {
        id: datasourceId,
      },
    },
  });
  if (!foundUser?.datasource?.length) throw new Error('Datasource not found');
  const customer = await getCustomer(order.wallet, order.email);
  if (order.shippingId || order.billingId) {
    const shippingWhere = order.shippingId
      ? { id: order.shippingId }
      : undefined;
    const billingWhere = order.billingId ? { id: order.billingId } : undefined;
    const foundShipping = await shippingRepository.findOne({
      where: shippingWhere,
    });
    const foundBilling = await billingRepository.findOne({
      where: billingWhere,
    });
    const foundCustomer = await customerRepository.findOne({
      where: {
        wallet: customer.wallet,
      },
    });
    if (!foundCustomer) {
      throw new Error(`Customer with wallet ${order.wallet} not found`);
    }
    if (foundShipping) {
      wcShipping = mapShippingWCShipping(foundShipping);
    } else if (order.saveShipping) {
      const savedShipping = await saveShipping({
        customer,
        shippingData: order.shipping,
      });
      wcShipping = mapShippingWCShipping(savedShipping);
    }
    if (foundBilling) {
      wcBilling = mapBillingWCBilling(foundBilling);
    } else if (order.saveBilling) {
      const savedBilling = await saveBilling({
        customer,
        billingData: order.billing,
      });
      wcBilling = mapBillingWCBilling(savedBilling);
    }
  } else {
    if (order.saveShipping) {
      const savedShipping = await saveShipping({
        customer,
        shippingData: order.shipping,
      });
      wcShipping = mapShippingWCShipping(savedShipping);
    } else {
      wcShipping = mapShippingWCShipping(order.shipping);
    }
    if (order.saveBilling) {
      const savedBilling = await saveBilling({
        customer,
        billingData: order.billing,
      });
      wcBilling = mapBillingWCBilling(savedBilling);
    } else {
      wcBilling = mapBillingWCBilling(order.billing);
    }
  }

  const orderReq: WoocommerceOrderReq = {
    payment_method: order.paymentMethod,
    payment_method_title: order.paymentMethod,
    set_paid: false,
    billing: wcBilling,
    shipping: wcShipping,
    line_items: order.lineItems.map((lineItem) => ({
      product_id: lineItem.productId,
      quantity: lineItem.quantity,
      variation_id: lineItem.variationId || undefined,
    })),
    shipping_lines: order.shippingLines.map((shippingLine) => ({
      method_id: shippingLine.methodId,
      method_title: shippingLine.methodTitle,
      total: shippingLine.total,
    })),
    meta_data: [
      {
        key: 'datasourceId',
        value: datasourceId,
      },
      {
        key: 'generated_by',
        value: 'DG-Live',
      },
      {
        key: 'customer_wallet',
        value: customer.wallet,
      },
    ],
  };
  try {
    const wc = await createNewWoocommerceInstance({
      apiKey: foundUser.apiKey,
      datasourceId,
    });
    const res = (await wc.post(
      'orders',
      orderReq
    )) as AxiosResponse<WCOrderCreated>;
    const savedOrder = await saveOrder(
      res.data,
      customer,
      datasourceId,
      order.paymentMethod
    );
    return {
      dgLiveOrder: savedOrder,
      raw: res.data,
    };
    // --contrato:
    //  orderId*
    //  amount *
    //  beneficiaryWallet (wallet del store donde mandar la plata) - Agregar campo wallet en datasource
    // call pay(orderId, amount, beneficiaryWallet)
    // contract emits "paymentProcceed" event
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const getOrderById = async ({
  orderId,
  datasourceId,
}: WCValidateOrderData) => {
  const foundUser = await userRepository.find({
    where: {
      datasource: {
        id: datasourceId,
      },
    },
    relations: {
      datasource: true,
    },
  });
  if (!foundUser || foundUser.length > 1)
    throw new Error(
      'User not found | or more than one user found with the same datasource'
    );
  const wc = await createNewWoocommerceInstance({
    apiKey: foundUser[0].apiKey,
    datasourceId,
  });
  try {
    const order = (await wc.get(
      `orders/${orderId}`
    )) as AxiosResponse<WCOrderCreated>;
    return order.data;
  } catch (error) {
    throw new Error('Failed to validate order stock');
  }
};

export const validateOrderStock = async (order: Order) => {
  try {
    console.log(order);
    debugger;
  } catch (error) {
    throw new Error('Failed to validate order stock');
  }
};

export const setOrderAsPayed = async (order: Order) => {
  try {
    const orderData = await orderRepository.findOne({
      relations: {
        datasource: {
          user: true,
        },
        orderLog: true,
      },
      where: {
        id: order.id,
      },
    });
    const wc = await createNewWoocommerceInstance({
      apiKey: orderData.datasource.user.apiKey,
      datasourceId: orderData.datasource.id,
    });

    const data = {
      status: 'processing',
    };

    const res = await wc.put(`orders/${order.storeOrderId}`, data);
    return res.data;
  } catch (error) {
    throw new Error('Failed to set order as payed');
  }
};
