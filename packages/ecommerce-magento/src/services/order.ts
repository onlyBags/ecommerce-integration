import {
  AppDataSource,
  Billing,
  Customer,
  Datasource,
  MagentoProduct,
  Order,
  Shipping,
  User,
} from '@dg-live/ecommerce-db';
import oAuth from 'oauth-1.0a';
import { createHmac } from 'crypto';
import axios, { AxiosResponse } from 'axios';

import { magentoApi } from '../utils/index.js';
import {
  BillingReq,
  Entity,
  LineItem,
  MagentoOrder,
  MagentoOrderReq,
  OnlyBagsOrderRequest,
  ShippingReq,
  MgActions,
  RawMagentoProductItem,
  MGOrderCreated,
  OnlyBagsOrderCreatedRes,
} from '@dg-live/ecommerce-data-types';

import {
  getBagPrice,
  getCustomer,
  mapBillingWCBilling,
  mapShippingWCShipping,
  saveBilling,
  saveShipping,
} from '@dg-live/ecommerce-customer';

const userRepository = AppDataSource.getRepository(User);
const shippingRepository = AppDataSource.getRepository(Shipping);
const billingRepository = AppDataSource.getRepository(Billing);
const customerRepository = AppDataSource.getRepository(Customer);
const datasourceRepository = AppDataSource.getRepository(Datasource);
const magentoProductRepository = AppDataSource.getRepository(MagentoProduct);
const orderRepository = AppDataSource.getRepository(Order);

const mockPayload3: MagentoOrderReq = {
  entity: {
    base_currency_code: 'USD',
    base_discount_amount: 0,
    base_grand_total: 1050,
    base_discount_tax_compensation_amount: 0,
    base_shipping_amount: 50,
    base_shipping_discount_amount: 0,
    base_shipping_discount_tax_compensation_amnt: 0,
    base_shipping_incl_tax: 50,
    base_shipping_tax_amount: 0,
    base_subtotal: 1000,
    base_subtotal_incl_tax: 1000,
    base_tax_amount: 0,
    base_total_due: 1050,
    base_to_global_rate: 1,
    base_to_order_rate: 1,
    created_at: '2024-04-11 19:11:21',
    customer_email: 'cuentaparavtv@gmail.com',
    customer_firstname: 'my name',
    customer_group_id: 0,
    customer_is_guest: 1,
    customer_lastname: 'my last name',
    customer_note_notify: 1,
    discount_amount: 0,
    global_currency_code: 'USD',
    grand_total: 1050,
    discount_tax_compensation_amount: 0,
    is_virtual: 0,
    order_currency_code: 'USD',
    quote_id: 2,
    shipping_amount: 50,
    shipping_description: 'Flat Rate - Fixed',
    shipping_discount_amount: 0,
    shipping_discount_tax_compensation_amount: 0,
    shipping_incl_tax: 50,
    shipping_tax_amount: 0,
    state: 'new',
    status: 'pending',
    store_currency_code: 'USD',
    store_id: 1,
    store_name: 'Main Website\nMain Website Store\nDefault Store View',
    store_to_base_rate: 0,
    store_to_order_rate: 0,
    subtotal: 1000,
    subtotal_incl_tax: 1000,
    tax_amount: 0,
    total_due: 1050,
    total_item_count: 1,
    total_qty_ordered: 10,
    updated_at: '2024-04-11 19:11:23',
    weight: 8000,
    items: [
      {
        amount_refunded: 0,
        base_amount_refunded: 0,
        base_discount_amount: 0,
        base_discount_invoiced: 0,
        base_discount_tax_compensation_amount: 0,
        base_original_price: 100,
        base_price: 100,
        base_price_incl_tax: 100,
        base_row_invoiced: 0,
        base_row_total: 1000,
        base_row_total_incl_tax: 1000,
        base_tax_amount: 0,
        base_tax_invoiced: 0,
        created_at: '2024-04-11 19:11:21',
        discount_amount: 0,
        discount_invoiced: 0,
        discount_percent: 0,
        free_shipping: 0,
        discount_tax_compensation_amount: 0,
        is_qty_decimal: 0,
        is_virtual: 0,
        item_id: 6,
        name: 'Test prd 1',
        no_discount: 0,
        order_id: 7,
        original_price: 100,
        price: 100,
        price_incl_tax: 100,
        product_id: 1,
        product_type: 'simple',
        qty_canceled: 0,
        qty_invoiced: 0,
        qty_ordered: 10,
        qty_refunded: 0,
        qty_shipped: 0,
        quote_item_id: 2,
        row_invoiced: 0,
        row_total: 1000,
        row_total_incl_tax: 1000,
        row_weight: 8000,
        sku: 'Test prd 1',
        store_id: 1,
        tax_amount: 0,
        tax_invoiced: 0,
        tax_percent: 0,
        updated_at: '2024-04-11 19:11:21',
        weight: 800,
      },
    ],
    billing_address: {
      address_type: 'billing',
      city: 'Alaska',
      company: 'my company',
      country_id: 'USA',
      email: 'cuentaparavtv@gmail.com',
      entity_id: 9,
      firstname: 'my name',
      lastname: 'my last name',
      parent_id: 7,
      postcode: '12342',
      region: 'Alaska',
      region_code: 'AK',
      region_id: 2,
      street: ['my street', 'my second streer'],
      telephone: '+447788996655',
    },
    payment: {
      account_status: null,
      additional_information: ['Check / Money order'],
      amount_ordered: 1050,
      base_amount_ordered: 1050,
      base_shipping_amount: 50,
      cc_exp_year: '0',
      cc_last4: null,
      cc_ss_start_month: '0',
      cc_ss_start_year: '0',
      entity_id: 6,
      method: 'checkmo',
      parent_id: 7,
      shipping_amount: 50,
    },
    status_histories: [
      {
        comment: 'gjmgkghkhg',
        created_at: '2024-04-11 19:12:57',
        entity_id: 1,
        entity_name: 'order',
        is_customer_notified: 1,
        is_visible_on_front: 0,
        parent_id: 7,
        status: 'pending',
      },
    ],
    extension_attributes: {
      shipping_assignments: [
        {
          shipping: {
            address: {
              address_type: 'shipping',
              city: 'Alaska',
              company: 'my company',
              country_id: 'USA',
              email: 'cuentaparavtv@gmail.com',
              entity_id: 8,
              firstname: 'my name',
              lastname: 'my last name',
              parent_id: 7,
              postcode: '12342',
              region: 'Alaska',
              region_code: 'AK',
              region_id: 2,
              street: ['my street', 'my second streer'],
              telephone: '+447788996655',
            },
            method: 'flatrate_flatrate',
            total: {
              base_shipping_amount: 50,
              base_shipping_discount_amount: 0,
              base_shipping_discount_tax_compensation_amnt: 0,
              base_shipping_incl_tax: 50,
              base_shipping_tax_amount: 0,
              shipping_amount: 50,
              shipping_discount_amount: 0,
              shipping_discount_tax_compensation_amount: 0,
              shipping_incl_tax: 50,
              shipping_tax_amount: 0,
            },
          },
          items: [
            {
              amount_refunded: 0,
              base_amount_refunded: 0,
              base_discount_amount: 0,
              base_discount_invoiced: 0,
              base_discount_tax_compensation_amount: 0,
              base_original_price: 100,
              base_price: 100,
              base_price_incl_tax: 100,
              base_row_invoiced: 0,
              base_row_total: 1000,
              base_row_total_incl_tax: 1000,
              base_tax_amount: 0,
              base_tax_invoiced: 0,
              created_at: '2024-04-11 19:11:21',
              discount_amount: 0,
              discount_invoiced: 0,
              discount_percent: 0,
              free_shipping: 0,
              discount_tax_compensation_amount: 0,
              is_qty_decimal: 0,
              is_virtual: 0,
              item_id: 6,
              name: 'Test prd 1',
              no_discount: 0,
              order_id: 7,
              original_price: 100,
              price: 100,
              price_incl_tax: 100,
              product_id: 1,
              product_type: 'simple',
              qty_canceled: 0,
              qty_invoiced: 0,
              qty_ordered: 10,
              qty_refunded: 0,
              qty_shipped: 0,
              quote_item_id: 2,
              row_invoiced: 0,
              row_total: 1000,
              row_total_incl_tax: 1000,
              row_weight: 8000,
              sku: 'Test prd 1',
              store_id: 1,
              tax_amount: 0,
              tax_invoiced: 0,
              tax_percent: 0,
              updated_at: '2024-04-11 19:11:21',
              weight: 800,
            },
          ],
        },
      ],
      payment_additional_info: [
        {
          key: 'method_title',
          value: 'Check / Money order',
        },
      ],
      applied_taxes: [],
      item_applied_taxes: [],
    },
  },
};

const getCurrentFormattedDate = () => {
  const now = new Date();
  const padZero = (num) => (num < 10 ? `0${num}` : num);

  const year = now.getFullYear();
  const month = padZero(now.getMonth() + 1);
  const day = padZero(now.getDate());
  const hours = padZero(now.getHours());
  const minutes = padZero(now.getMinutes());
  const seconds = padZero(now.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const orderCreatedOnWebPage = {
  entity: {
    base_currency_code: 'USD',
    base_discount_amount: 0,
    base_grand_total: 105,
    base_discount_tax_compensation_amount: 0,
    base_shipping_amount: 5,
    base_shipping_discount_amount: 0,
    base_shipping_discount_tax_compensation_amnt: 0,
    base_shipping_incl_tax: 5,
    base_shipping_tax_amount: 0,
    base_subtotal: 100,
    base_subtotal_incl_tax: 100,
    base_tax_amount: 0,
    base_total_due: 105,
    base_to_global_rate: 1,
    base_to_order_rate: 1,
    billing_address_id: 11,
    created_at: '2024-05-27 20:55:00',
    customer_email: 'cuentaparavtv@gmail.com',
    customer_firstname: 'maiki',
    customer_group_id: 0,
    customer_is_guest: 1,
    customer_lastname: 'billing',
    customer_note_notify: 1,
    discount_amount: 0,
    entity_id: 12,
    global_currency_code: 'USD',
    grand_total: 105,
    discount_tax_compensation_amount: 0,
    increment_id: '000000012',
    is_virtual: 0,
    order_currency_code: 'USD',
    protect_code: 'ab262efd03588e6435baad3968931008',
    quote_id: 3,
    remote_ip: '127.0.0.1',
    shipping_amount: 5,
    shipping_description: 'Flat Rate - Fixed',
    shipping_discount_amount: 0,
    shipping_discount_tax_compensation_amount: 0,
    shipping_incl_tax: 5,
    shipping_tax_amount: 0,
    state: 'new',
    status: 'pending',
    store_currency_code: 'USD',
    store_id: 1,
    store_name: 'Main Website\nMain Website Store\nDefault Store View',
    store_to_base_rate: 0,
    store_to_order_rate: 0,
    subtotal: 100,
    subtotal_incl_tax: 100,
    tax_amount: 0,
    total_due: 105,
    total_item_count: 1,
    total_qty_ordered: 1,
    updated_at: '2024-05-27 20:55:02',
    weight: 800,
    items: [
      {
        amount_refunded: 0,
        base_amount_refunded: 0,
        base_discount_amount: 0,
        base_discount_invoiced: 0,
        base_discount_tax_compensation_amount: 0,
        base_original_price: 100,
        base_price: 100,
        base_price_incl_tax: 100,
        base_row_invoiced: 0,
        base_row_total: 100,
        base_row_total_incl_tax: 100,
        base_tax_amount: 0,
        base_tax_invoiced: 0,
        created_at: '2024-05-27 20:55:00',
        discount_amount: 0,
        discount_invoiced: 0,
        discount_percent: 0,
        free_shipping: 0,
        discount_tax_compensation_amount: 0,
        is_qty_decimal: 0,
        is_virtual: 0,
        item_id: 7,
        name: 'Test prd 1',
        no_discount: 0,
        order_id: 12,
        original_price: 100,
        price: 100,
        price_incl_tax: 100,
        product_id: 1,
        product_type: 'simple',
        qty_canceled: 0,
        qty_invoiced: 0,
        qty_ordered: 1,
        qty_refunded: 0,
        qty_shipped: 0,
        quote_item_id: 3,
        row_invoiced: 0,
        row_total: 100,
        row_total_incl_tax: 100,
        row_weight: 800,
        sku: 'Test prd 1',
        store_id: 1,
        tax_amount: 0,
        tax_invoiced: 0,
        tax_percent: 0,
        updated_at: '2024-05-27 20:55:00',
        weight: 800,
      },
    ],
    billing_address: {
      address_type: 'billing',
      city: 'una ciudad',
      company: 'my company2',
      country_id: 'USA',
      email: 'cuentaparavtv@gmail.com',
      entity_id: 11,
      firstname: 'maiki',
      lastname: 'billing',
      parent_id: 12,
      postcode: '54321',
      region: 'una provincai q ni idea',
      region_code: 'una provincai q ni idea',
      street: ['my street 2', 'linea 2 de mystreet 2'],
      telephone: '44441111221121212',
    },
    payment: {
      account_status: null,
      additional_information: ['Check / Money order'],
      amount_ordered: 105,
      base_amount_ordered: 105,
      base_shipping_amount: 5,
      cc_exp_year: '0',
      cc_last4: null,
      cc_ss_start_month: '0',
      cc_ss_start_year: '0',
      entity_id: 7,
      method: 'checkmo',
      parent_id: 12,
      shipping_amount: 5,
    },
    status_histories: [],
    extension_attributes: {
      shipping_assignments: [
        {
          shipping: {
            address: {
              address_type: 'shipping',
              city: 'arkansas',
              company: 'my company',
              country_id: 'USA',
              email: 'cuentaparavtv@gmail.com',
              entity_id: 10,
              firstname: 'maiki',
              lastname: 'last name',
              parent_id: 12,
              postcode: '12345',
              region: 'Alabama',
              region_code: 'AL',
              region_id: 1,
              street: ['my street', 'linea 2'],
              telephone: '3133334444',
            },
            method: 'flatrate_flatrate',
            total: {
              base_shipping_amount: 5,
              base_shipping_discount_amount: 0,
              base_shipping_discount_tax_compensation_amnt: 0,
              base_shipping_incl_tax: 5,
              base_shipping_tax_amount: 0,
              shipping_amount: 5,
              shipping_discount_amount: 0,
              shipping_discount_tax_compensation_amount: 0,
              shipping_incl_tax: 5,
              shipping_tax_amount: 0,
            },
          },
          items: [
            {
              amount_refunded: 0,
              base_amount_refunded: 0,
              base_discount_amount: 0,
              base_discount_invoiced: 0,
              base_discount_tax_compensation_amount: 0,
              base_original_price: 100,
              base_price: 100,
              base_price_incl_tax: 100,
              base_row_invoiced: 0,
              base_row_total: 100,
              base_row_total_incl_tax: 100,
              base_tax_amount: 0,
              base_tax_invoiced: 0,
              created_at: '2024-05-27 20:55:00',
              discount_amount: 0,
              discount_invoiced: 0,
              discount_percent: 0,
              free_shipping: 0,
              discount_tax_compensation_amount: 0,
              is_qty_decimal: 0,
              is_virtual: 0,
              item_id: 7,
              name: 'Test prd 1',
              no_discount: 0,
              order_id: 12,
              original_price: 100,
              price: 100,
              price_incl_tax: 100,
              product_id: 1,
              product_type: 'simple',
              qty_canceled: 0,
              qty_invoiced: 0,
              qty_ordered: 1,
              qty_refunded: 0,
              qty_shipped: 0,
              quote_item_id: 3,
              row_invoiced: 0,
              row_total: 100,
              row_total_incl_tax: 100,
              row_weight: 800,
              sku: 'Test prd 1',
              store_id: 1,
              tax_amount: 0,
              tax_invoiced: 0,
              tax_percent: 0,
              updated_at: '2024-05-27 20:55:00',
              weight: 800,
            },
          ],
        },
      ],
      payment_additional_info: [
        {
          key: 'method_title',
          value: 'Check / Money order',
        },
      ],
      applied_taxes: [],
      item_applied_taxes: [],
    },
  },
};
const modOrderCreatedOnWebPage = {
  entity: {
    base_currency_code: 'USD',
    base_discount_amount: 0,
    base_grand_total: 105,
    base_discount_tax_compensation_amount: 0,
    base_shipping_amount: 5,
    base_shipping_discount_amount: 0,
    base_shipping_discount_tax_compensation_amnt: 0,
    base_shipping_incl_tax: 5,
    base_shipping_tax_amount: 0,
    base_subtotal: 100,
    base_subtotal_incl_tax: 100,
    base_tax_amount: 0,
    base_total_due: 105,
    base_to_global_rate: 1,
    base_to_order_rate: 1,
    billing_address_id: 11,
    created_at: '2024-05-27 20:55:00',
    customer_email: 'cuentaparavtv@gmail.com',
    customer_firstname: 'maiki',
    customer_group_id: 0,
    customer_is_guest: 1,
    customer_lastname: 'billing',
    customer_note_notify: 1,
    discount_amount: 0,
    global_currency_code: 'USD',
    grand_total: 105,
    discount_tax_compensation_amount: 0,
    is_virtual: 0,
    order_currency_code: 'USD',
    protect_code: 'ab262efd03588e6435baad3968931008',
    quote_id: 3,
    remote_ip: '127.0.0.1',
    shipping_amount: 5,
    shipping_description: 'Flat Rate - Fixed',
    shipping_discount_amount: 0,
    shipping_discount_tax_compensation_amount: 0,
    shipping_incl_tax: 5,
    shipping_tax_amount: 0,
    state: 'new',
    status: 'pending',
    store_currency_code: 'USD',
    store_id: 1,
    store_name: 'Main Website\nMain Website Store\nDefault Store View',
    store_to_base_rate: 0,
    store_to_order_rate: 0,
    subtotal: 100,
    subtotal_incl_tax: 100,
    tax_amount: 0,
    total_due: 105,
    total_item_count: 1,
    total_qty_ordered: 1,
    updated_at: '2024-05-27 20:55:02',
    weight: 800,
    items: [
      {
        amount_refunded: 0,
        base_amount_refunded: 0,
        base_discount_amount: 0,
        base_discount_invoiced: 0,
        base_discount_tax_compensation_amount: 0,
        base_original_price: 100,
        base_price: 100,
        base_price_incl_tax: 100,
        base_row_invoiced: 0,
        base_row_total: 100,
        base_row_total_incl_tax: 100,
        base_tax_amount: 0,
        base_tax_invoiced: 0,
        created_at: '2024-05-27 20:55:00',
        discount_amount: 0,
        discount_invoiced: 0,
        discount_percent: 0,
        free_shipping: 0,
        discount_tax_compensation_amount: 0,
        is_qty_decimal: 0,
        is_virtual: 0,
        item_id: 7,
        name: 'Test prd 1',
        no_discount: 0,
        original_price: 100,
        price: 100,
        price_incl_tax: 100,
        product_id: 1,
        product_type: 'simple',
        qty_canceled: 0,
        qty_invoiced: 0,
        qty_ordered: 1,
        qty_refunded: 0,
        qty_shipped: 0,
        quote_item_id: 3,
        row_invoiced: 0,
        row_total: 100,
        row_total_incl_tax: 100,
        row_weight: 800,
        sku: 'Test prd 1',
        store_id: 1,
        tax_amount: 0,
        tax_invoiced: 0,
        tax_percent: 0,
        updated_at: '2024-05-27 20:55:00',
        weight: 800,
      },
    ],
    billing_address: {
      address_type: 'billing',
      city: 'una ciudad',
      company: 'my company2',
      country_id: 'USA',
      email: 'cuentaparavtv@gmail.com',
      firstname: 'maiki',
      lastname: 'billing',
      postcode: '54321',
      region: 'una provincai q ni idea',
      region_code: 'una provincai q ni idea',
      street: ['my street 2', 'linea 2 de mystreet 2'],
      telephone: '44441111221121212',
    },
    payment: {
      account_status: null,
      additional_information: ['Check / Money order'],
      amount_ordered: 105,
      base_amount_ordered: 105,
      base_shipping_amount: 5,
      cc_exp_year: '0',
      cc_last4: null,
      cc_ss_start_month: '0',
      cc_ss_start_year: '0',
      method: 'checkmo',
      shipping_amount: 5,
    },
    status_histories: [],
    extension_attributes: {
      shipping_assignments: [
        {
          shipping: {
            address: {
              address_type: 'shipping',
              city: 'arkansas',
              company: 'my company',
              country_id: 'USA',
              email: 'cuentaparavtv@gmail.com',
              firstname: 'maiki',
              lastname: 'last name',
              postcode: '12345',
              region: 'Alabama',
              region_code: 'AL',
              region_id: 1,
              street: ['my street', 'linea 2'],
              telephone: '3133334444',
            },
            method: 'flatrate_flatrate',
            total: {
              base_shipping_amount: 5,
              base_shipping_discount_amount: 0,
              base_shipping_discount_tax_compensation_amnt: 0,
              base_shipping_incl_tax: 5,
              base_shipping_tax_amount: 0,
              shipping_amount: 5,
              shipping_discount_amount: 0,
              shipping_discount_tax_compensation_amount: 0,
              shipping_incl_tax: 5,
              shipping_tax_amount: 0,
            },
          },
          items: [
            {
              amount_refunded: 0,
              base_amount_refunded: 0,
              base_discount_amount: 0,
              base_discount_invoiced: 0,
              base_discount_tax_compensation_amount: 0,
              base_original_price: 100,
              base_price: 100,
              base_price_incl_tax: 100,
              base_row_invoiced: 0,
              base_row_total: 100,
              base_row_total_incl_tax: 100,
              base_tax_amount: 0,
              base_tax_invoiced: 0,
              created_at: '2024-05-27 20:55:00',
              discount_amount: 0,
              discount_invoiced: 0,
              discount_percent: 0,
              free_shipping: 0,
              discount_tax_compensation_amount: 0,
              is_qty_decimal: 0,
              is_virtual: 0,
              item_id: 7,
              name: 'Test prd 1',
              no_discount: 0,
              original_price: 100,
              price: 100,
              price_incl_tax: 100,
              product_id: 1,
              product_type: 'simple',
              qty_canceled: 0,
              qty_invoiced: 0,
              qty_ordered: 1,
              qty_refunded: 0,
              qty_shipped: 0,
              quote_item_id: 3,
              row_invoiced: 0,
              row_total: 100,
              row_total_incl_tax: 100,
              row_weight: 800,
              sku: 'Test prd 1',
              store_id: 1,
              tax_amount: 0,
              tax_invoiced: 0,
              tax_percent: 0,
              updated_at: '2024-05-27 20:55:00',
              weight: 800,
            },
          ],
        },
      ],
      payment_additional_info: [
        {
          key: 'method_title',
          value: 'Check / Money order',
        },
      ],
      applied_taxes: [],
      item_applied_taxes: [],
    },
  },
};

const validateProductsPrice = async (
  apiKey: string,
  datasourceId: number,
  lineItems: LineItem[]
): Promise<MagentoProduct[]> => {
  const productDataArr: MagentoProduct[] = [];
  try {
    for (const lineItem of lineItems) {
      const foundProduct = await magentoProductRepository.findOne({
        relations: {
          datasource: true,
        },
        where: {
          datasource: {
            id: datasourceId,
          },
          productId: lineItem.productId,
        },
      });
      if (!foundProduct) {
        throw new Error(`Product with id ${lineItem.productId} not found`);
      }
      const sku = foundProduct.sku;
      const { data: productData }: { data: RawMagentoProductItem } =
        await magentoApi({
          apiKey,
          datasourceId,
          action: MgActions.GET_PRODUCT_DETAIL,
          pathData: sku.toString(),
        });
      if (foundProduct.price !== productData.price) {
        throw new Error(
          `Product with id ${lineItem.productId} price is not the same`
        );
      }
      productDataArr.push(foundProduct);
    }
    return productDataArr;
  } catch (err) {
    throw new Error(err);
  }
};

const mapToMagentoOrderReq = async (
  apiKey: string,
  datasourceId: number,
  order: OnlyBagsOrderRequest
): Promise<MagentoOrderReq> => {
  // Need to fetch product price from store.
  const productsData = await validateProductsPrice(
    apiKey,
    datasourceId,
    order.lineItems
  );
  const grandTotal = productsData.reduce((acc, curr) => (acc += curr.price), 0);
  const entity: Entity = {
    base_currency_code: 'USD',
    base_discount_amount: 0,
    base_grand_total: grandTotal,
    base_discount_tax_compensation_amount: 0,
    base_shipping_amount: 0,
    base_shipping_discount_amount: 0,
    base_shipping_discount_tax_compensation_amnt: 0,
    base_shipping_incl_tax: 10,
    base_shipping_tax_amount: 0,
    base_subtotal: grandTotal,
    base_subtotal_incl_tax: grandTotal,
    base_tax_amount: 0,
    base_total_due: 0,
    base_to_global_rate: 1,
    base_to_order_rate: 1,
    created_at: new Date().toISOString(),
    customer_email: 'cuentaparavtv@gmail.com',
    customer_firstname: order.billing.firstName,
    customer_group_id: 0,
    customer_is_guest: 1,
    customer_lastname: order.billing.lastName,
    customer_note_notify: 1,
    discount_amount: 0,
    global_currency_code: 'USD',
    grand_total: grandTotal,
    discount_tax_compensation_amount: 0,
    is_virtual: 0,
    order_currency_code: 'USD',
    quote_id: 0,
    shipping_amount: 0, // parseFloat(order.shippingLines[0].total || '0'),
    shipping_description: 'Onlybags Shipping config', //order.shippingLines[0].methodTitle,
    shipping_discount_amount: 0,
    shipping_discount_tax_compensation_amount: 0,
    shipping_incl_tax: 0, // parseFloat(order.shippingLines[0].total || '0'),
    shipping_tax_amount: 0,
    state: 'new',
    status: 'pending',
    store_currency_code: 'USD',
    store_id: 1,
    store_name: 'Main Website\nMain Website Store\nDefault Store View',
    store_to_base_rate: 1,
    store_to_order_rate: 1,
    subtotal: 0,
    subtotal_incl_tax: 0,
    tax_amount: 0,
    total_due: 0,
    total_item_count: order.lineItems.length,
    total_qty_ordered: order.lineItems.reduce(
      (total, item) => total + item.quantity,
      0
    ),
    updated_at: new Date().toISOString(),
    weight: 0,
    items: productsData.map((item, index) => {
      const prdQty: number =
        order.lineItems.find((x) => x.productId === item.productId)?.quantity ||
        0;
      return {
        amount_refunded: 0,
        base_amount_refunded: 0,
        base_discount_amount: 0,
        base_discount_invoiced: 0,
        base_discount_tax_compensation_amount: 0,
        base_original_price: item.price,
        base_price: item.price,
        base_price_incl_tax: item.price,
        base_row_invoiced: item.price * prdQty,
        base_row_total: item.price * prdQty,
        base_row_total_incl_tax: item.price * prdQty,
        base_tax_amount: 0,
        base_tax_invoiced: 0,
        created_at: new Date().toISOString(),
        discount_amount: 0,
        discount_invoiced: 0,
        discount_percent: 0,
        free_shipping: 0,
        discount_tax_compensation_amount: 0,
        is_qty_decimal: 0,
        is_virtual: 0,
        item_id: index,
        name: item.name,
        no_discount: 0,
        order_id: 0,
        original_price: item.price,
        price: item.price,
        price_incl_tax: item.price,
        product_id: item.productId,
        product_type: 'simple',
        qty_canceled: 0,
        qty_invoiced: 0,
        qty_ordered: prdQty,
        qty_refunded: 0,
        qty_shipped: 0,
        quote_item_id: 0,
        row_invoiced: 0,
        row_total: item.price * prdQty,
        row_total_incl_tax: item.price,
        row_weight: 0,
        sku: item.sku,
        store_id: 1,
        tax_amount: 0,
        tax_invoiced: 0,
        tax_percent: 0,
        updated_at: new Date().toISOString(),
        weight: item.weight,
      };
    }),
    billing_address: {
      address_type: 'billing',
      city: order.billing.city,
      company: '', // Adjust as needed
      country_id: 'USA', // order.billing.country,
      email: 'cuentaparavtv@gmail.com',
      entity_id: 0,
      firstname: order.billing.firstName,
      lastname: order.billing.lastName,
      parent_id: 0,
      postcode: order.billing.postcode,
      region: order.billing.state,
      region_code: order.billing.state,
      region_id: 0,
      street: [order.billing.address1, order.billing.address2 || ''],
      telephone: order.billing.phone || '',
    },
    payment: {
      account_status: null,
      additional_information: [order.paymentMethod],
      amount_ordered: 0,
      base_amount_ordered: 0,
      base_shipping_amount: 0,
      cc_exp_year: '0',
      cc_last4: null,
      cc_ss_start_month: '0',
      cc_ss_start_year: '0',
      entity_id: 0,
      method: order.paymentMethod,
      parent_id: 0,
      shipping_amount: 0,
    },
    status_histories: [],
    extension_attributes: {
      shipping_assignments: [
        {
          shipping: {
            address: {
              address_type: 'shipping',
              city: order.shipping.city,
              company: '', // Adjust as needed
              country_id: 'USA', //order.shipping.country,
              email: 'cuentaparavtv@gmail.com',
              entity_id: 0,
              firstname: order.shipping.firstName,
              lastname: order.shipping.lastName,
              parent_id: 0,
              postcode: order.shipping.postcode,
              region: order.shipping.state,
              region_code: order.shipping.state,
              region_id: 0,
              street: [order.shipping.address1, order.shipping.address2 || ''],
              telephone: order.billing.phone || '',
            },
            method: 'Testing shipping', //order.shippingLines[0].methodId,
            total: {
              base_shipping_amount: 0, // parseFloat( order.shippingLines[0].total || '0'),
              base_shipping_discount_amount: 0,
              base_shipping_discount_tax_compensation_amnt: 0,
              base_shipping_incl_tax: 0, //parseFloat(order.shippingLines[0].total || '0'),
              base_shipping_tax_amount: 0,
              shipping_amount: 0, // parseFloat(order.shippingLines[0].total || '0'),
              shipping_discount_amount: 0,
              shipping_discount_tax_compensation_amount: 0,
              shipping_incl_tax: 0, // parseFloat(order.shippingLines[0].total || '0'),
              shipping_tax_amount: 0,
            },
          },
          items: [],
          // order.lineItems.map((item, index) => ({
          //   amount_refunded: 0,
          //   base_amount_refunded: 0,
          //   base_discount_amount: 0,
          //   base_discount_invoiced: 0,
          //   base_discount_tax_compensation_amount: 0,
          //   base_original_price: 0,
          //   base_price: 0,
          //   base_price_incl_tax: 0,
          //   base_row_invoiced: 0,
          //   base_row_total: 0,
          //   base_row_total_incl_tax: 0,
          //   base_tax_amount: 0,
          //   base_tax_invoiced: 0,
          //   created_at: new Date().toISOString(),
          //   discount_amount: 0,
          //   discount_invoiced: 0,
          //   discount_percent: 0,
          //   free_shipping: 0,
          //   discount_tax_compensation_amount: 0,
          //   is_qty_decimal: 0,
          //   is_virtual: 0,
          //   item_id: index,
          //   name: '', // Adjust as needed
          //   no_discount: 0,
          //   order_id: 0,
          //   original_price: 0,
          //   price: 0,
          //   price_incl_tax: 0,
          //   product_id: item.productId,
          //   product_type: 'simple',
          //   qty_canceled: 0,
          //   qty_invoiced: 0,
          //   qty_ordered: item.quantity,
          //   qty_refunded: 0,
          //   qty_shipped: 0,
          //   quote_item_id: 0,
          //   row_invoiced: 0,
          //   row_total: 0,
          //   row_total_incl_tax: 0,
          //   row_weight: 0,
          //   sku: '', // Adjust as needed
          //   store_id: 1,
          //   tax_amount: 0,
          //   tax_invoiced: 0,
          //   tax_percent: 0,
          //   updated_at: new Date().toISOString(),
          //   weight: 0,
          // }))
        },
      ],
      payment_additional_info: [
        {
          key: 'method_title',
          value: order.paymentMethod,
        },
      ],
      applied_taxes: [],
      item_applied_taxes: [],
    },
  };

  return { entity };
};

export const createOrder = async (
  datasourceId: number,
  order: OnlyBagsOrderRequest
): Promise<OnlyBagsOrderCreatedRes> => {
  let wcShipping: ShippingReq;
  let wcBilling: BillingReq;
  const foundUserDatasource = await userRepository.findOne({
    where: { datasource: { id: datasourceId } },
    relations: {
      datasource: true,
    },
  });
  if (!foundUserDatasource) throw new Error("User's datasource not found");
  const apiKey = foundUserDatasource.apiKey;
  const {
    baseUrl,
    consumerKey,
    consumerSecret,
    accessToken,
    accessTokenSecret,
  } = foundUserDatasource.datasource[0];
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

  const simpleTryData = {
    url: `${baseUrl}/rest/V1/orders`,
    method: 'POST',
  };
  const simpleTryAccess = new oAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
      return createHmac('sha256', key)
        .update(base_string)
        .digest('base64')
        .toString();
    },
  });

  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };
  const simpleTryAuthHeader = simpleTryAccess.toHeader(
    simpleTryAccess.authorize(simpleTryData, token)
  );
  const orderReq: MagentoOrderReq = await mapToMagentoOrderReq(
    apiKey,
    datasourceId,
    order
  );
  try {
    const res: AxiosResponse<MGOrderCreated> = await axios.post(
      simpleTryData.url,
      orderReq,
      {
        headers: {
          ...simpleTryAuthHeader,
        },
      }
    );
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
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const saveOrder = async (
  order: MGOrderCreated,
  customer: Customer,
  datasourceId: number,
  paymentMethod: string
) => {
  const datasource = await datasourceRepository.findOneBy({
    id: datasourceId,
  });
  if (!datasource) throw new Error('Datasource not found');
  try {
    const orderToSave = new Order();
    const bagPrice = await getBagPrice();
    orderToSave.storeOrderId = order.entity_id.toString();
    orderToSave.paymentMethod = paymentMethod;
    orderToSave.orderKey = order.increment_id;
    orderToSave.status = order.status;
    orderToSave.customer = customer;
    orderToSave.total = +order.base_grand_total;
    orderToSave.currency = order.base_currency_code;
    orderToSave.datasource = datasource;
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

export const magentoGetOrder = async ({
  apiKey,
  datasourceId,
  orderId,
}: {
  apiKey: string;
  datasourceId: number;
  orderId: string;
}) => {
  const foundUserDatasource = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUserDatasource) throw new Error("User's datasource not found");
  const {
    baseUrl,
    consumerKey,
    consumerSecret,
    accessToken,
    accessTokenSecret,
  } = foundUserDatasource.datasource[0];

  const simpleTryData = {
    url: `${baseUrl}rest/V1/orders/${orderId}`,
    method: 'GET',
  };
  const simpleTryAccess = new oAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
      return createHmac('sha256', key)
        .update(base_string)
        .digest('base64')
        .toString();
    },
  });

  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };
  const simpleTryAuthHeader = simpleTryAccess.toHeader(
    simpleTryAccess.authorize(simpleTryData, token)
  );
  try {
    const res = await axios.get(simpleTryData.url, {
      headers: {
        ...simpleTryAuthHeader,
      },
    });
    if (res.data) return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// export const setOrderAsPayed = async (order: Order) => {
//   try {
//     let orderData: any;
//     const foundDatasource = await datasourceRepository.findOne({
//       where: {
//         id: order.datasource.id,
//       },
//       relations: {
//         user: true,
//       },
//     });
//     if (!foundDatasource) throw new Error('Datasource not found');

//     const {
//       baseUrl,
//       consumerKey,
//       consumerSecret,
//       accessToken,
//       accessTokenSecret,
//     } = foundDatasource;

//     const mgGetData = {
//       url: `${baseUrl}/rest/V1/orders/${order.orderKey}`,
//       method: 'GET',
//     };
//     const mgDataAccess = new oAuth({
//       consumer: {
//         key: consumerKey,
//         secret: consumerSecret,
//       },
//       signature_method: 'HMAC-SHA256',
//       hash_function(base_string, key) {
//         return createHmac('sha256', key)
//           .update(base_string)
//           .digest('base64')
//           .toString();
//       },
//     });

//     const token = {
//       key: accessToken,
//       secret: accessTokenSecret,
//     };

//     const mgDataAuthHeader = mgDataAccess.toHeader(
//       mgDataAccess.authorize(mgGetData, token)
//     );
//     try {
//       const res = await axios.get(mgGetData.url, {
//         headers: {
//           ...mgDataAuthHeader,
//         },
//       });
//       if (res.data) {
//         const mgPutData = {
//           url: `${baseUrl}/rest/V1/orders/create`,
//           method: 'PUT',
//         };
//         const putDataAuthHeader = mgDataAccess.toHeader(
//           mgDataAccess.authorize(mgPutData, token)
//         );

//         const putRes: AxiosResponse<MGOrderCreated> = await axios.put(
//           mgPutData.url,
//           { entity: { ...res.data, status: 'APPROVED' } },
//           {
//             headers: {
//               ...putDataAuthHeader,
//             },
//           }
//         );
//         console.log(putRes);
//         debugger;
//       }
//     } catch (err) {
//       console.log(err);
//       throw err;
//     }
//   } catch (error) {
//     throw new Error('Failed to set order as payed');
//   }
// };

export const createOrderInvoice = async (order: Order) => {
  const foundDatasource = await datasourceRepository.findOne({
    where: {
      id: order.datasource.id,
    },
    relations: {
      user: true,
    },
  });
  if (!foundDatasource) throw new Error('Datasource not found');
  const {
    baseUrl,
    consumerKey,
    consumerSecret,
    accessToken,
    accessTokenSecret,
  } = foundDatasource;
  const mgGetData = {
    url: `${baseUrl}/rest/V1/order/${order.orderKey}/invoice`,
    method: 'POST',
  };
  const mgDataAccess = new oAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
      return createHmac('sha256', key)
        .update(base_string)
        .digest('base64')
        .toString();
    },
  });

  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };

  const mgDataAuthHeader = mgDataAccess.toHeader(
    mgDataAccess.authorize(mgGetData, token)
  );
  try {
    const res = await axios.post(
      mgGetData.url,
      {
        capture: true,
        notify: true,
      },
      {
        headers: {
          ...mgDataAuthHeader,
        },
      }
    );
    console.log(res);
  } catch (err) {
    console.log(err);
  }
};
