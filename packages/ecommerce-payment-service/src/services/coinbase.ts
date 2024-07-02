import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import crypto from 'crypto';
import { envConfig } from '@dg-live/ecommerce-config';
import {
  CoinbasePaymentStatusData,
  EcommerceWsData,
} from '@dg-live/ecommerce-data-types';
import {
  AppDataSource,
  CoinbaseOrder,
  Customer,
  Datasource,
  Order,
} from '@dg-live/ecommerce-db';
import { notifyPurschase } from '@dg-live/ecommerce-websocket';
import { setOrderAsPayed } from '@dg-live/ecommerce-woocommerce';
import { createOrderInvoice } from '@dg-live/ecommerce-magento';

const datasourceRepository = AppDataSource.getRepository(Datasource);
const coinbaseOrderRepository = AppDataSource.getRepository(CoinbaseOrder);
const customerRepository = AppDataSource.getRepository(Customer);
const orderRepository = AppDataSource.getRepository(Order);
interface DataType {
  name: string;
  description: string;
  local_price: {
    amount: string;
    currency: string;
  };
  pricing_type: string;
  metadata: Record<string, string | boolean>;
}

let config: AxiosRequestConfig<DataType> = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `${envConfig.coinbaseApiUrl}/charges`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-CC-Api-Key': envConfig.coinbaseApiKey,
    'X-CC-Version': envConfig.coinbaseApiVersion,
  },
};

export const coinbaseCreatePaymentLink = async ({
  orderId,
  storeOrderId,
  datasourceId,
  customerWallet,
  totalPrice,
  email,
  products,
}: {
  orderId: number;
  storeOrderId: string;
  datasourceId: number;
  customerWallet: string;
  totalPrice: number;
  email: string;
  products: {
    id: string;
    name: string;
    description: string;
  }[];
}): Promise<CoinbasePaymentStatusData> => {
  try {
    config.data = {
      name: 'Ecommerce Payment',
      description: `Order ID: ${orderId}`,
      local_price: {
        amount: Number(totalPrice).toFixed(2).toString(),
        currency: 'USD',
      },
      pricing_type: 'fixed_price',
      metadata: {
        is_ecommerce: 'true',
        orderId: orderId.toString(),
        storeOrderId,
        datasourceId: datasourceId.toString(),
        customerWallet,
        email,
        products: JSON.stringify(products),
      },
    };
    const res = await axios.request<AxiosResponse<CoinbasePaymentStatusData>>(
      config
    );
    await saveCoinbaseOrder({
      coinbaseOrderLink: res.data.data,
      datasourceId,
      customerWallet,
      orderId,
    });
    return res.data.data;
  } catch (error) {
    console.error(error);
    debugger;
  }
};

export const coinbaseWebhook = async (req: Request, res: Response) => {
  res.status(200).json({
    status: 200,
    data: {
      message: 'Webhook received',
    },
  });
  const endpointSecret = envConfig.coinbaseWhSecret;
  try {
    const _sig = req.headers['x-cc-webhook-signature'];
    const body = req.body;

    const sig = typeof _sig === 'string' ? _sig : _sig[0];
    const cbEvent = verifyEventBody(body, sig, endpointSecret);
    if (!cbEvent) throw new Error('Invalid signature');
    if (cbEvent.data.metadata?.is_marketplace === 'true') return;
    const { type } = cbEvent;
    const eventData = cbEvent.data;

    // {
    //   id: "afb9a47b-9103-4d8c-8669-cb53c5e75268",
    //   code: "RGG5KFHR",
    //   name: "Ecommerce Payment",
    //   pricing: {
    //     local: {
    //       amount: "1.00",
    //       currency: "USD",
    //     },
    //     settlement: {
    //       amount: "1",
    //       currency: "USDC",
    //     },
    //   },
    //   metadata: {
    //     email: "a@s.com",
    //     orderId: "35",
    //     products: "[{\"id\":\"1\",\"name\":\"TestingPrd\",\"description\":\"No Description Provided\"}]",
    //     datasourceId: "4",
    //     is_ecommerce: "true",
    //     storeOrderId: "000000019",
    //     customerWallet: "0xcee6c68e3cec2f7d332ec15ea4dd61f21d294c45",
    //   },
    //   payments: [
    //     {
    //       value: {
    //         local: {
    //           amount: "1.00",
    //           currency: "USD",
    //         },
    //         crypto: {
    //           amount: "1",
    //           currency: "USDC",
    //         },
    //       },
    //       status: "pending",
    //       network: "polygon",
    //       payment_id: "0x8d442c0b9c8dd83dfe651bb5f56a63c3b4a2da274ae5cbb3796e8dca34f46365",
    //       detected_at: "2024-07-02T13:31:35Z",
    //       transaction_id: "0x8d442c0b9c8dd83dfe651bb5f56a63c3b4a2da274ae5cbb3796e8dca34f46365",
    //       payer_addresses: [
    //         "0xcee6c68e3cec2f7d332ec15ea4dd61f21d294c45",
    //       ],
    //     },
    //   ],
    //   timeline: [
    //     {
    //       time: "2024-07-02T13:29:51Z",
    //       status: "NEW",
    //     },
    //     {
    //       time: "2024-07-02T13:31:03Z",
    //       status: "SIGNED",
    //     },
    //     {
    //       time: "2024-07-02T13:31:40Z",
    //       status: "PENDING",
    //     },
    //   ],
    //   pwcb_only: false,
    //   redirects: {
    //     cancel_url: "",
    //     success_url: "",
    //     will_redirect_after_success: false,
    //   },
    //   web3_data: {
    //     failure_events: [
    //     ],
    //     success_events: [
    //       {
    //         sender: "0xcee6c68e3cec2f7d332ec15ea4dd61f21d294c45",
    //         tx_hsh: "0x8d442c0b9c8dd83dfe651bb5f56a63c3b4a2da274ae5cbb3796e8dca34f46365",
    //         chain_id: 137,
    //         finalized: false,
    //         recipient: "0x65562b673896b1c62e4b2429a9a91c1f010b8977",
    //         timestamp: "2024-07-02T13:31:35Z",
    //         network_fee_paid: "8556900015972880",
    //         input_token_amount: "1000622",
    //         input_token_address: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    //         network_fee_paid_local: "0.004876577319102944",
    //       },
    //     ],
    //     transfer_intent: {
    //       metadata: {
    //         sender: "0xCEe6C68e3Cec2f7D332Ec15ea4dD61f21D294C45",
    //         chain_id: 137,
    //         contract_address: "0x551c6791c2f01c3Cd48CD35291Ac4339F206430d",
    //       },
    //       call_data: {
    //         id: "0x867aa09da100419ab0ceb6edb4bc5c20",
    //         prefix: "0x4b3220496e666f726d6174696f6e616c204d6573736167653a20333220",
    //         deadline: "2024-07-04T13:29:51Z",
    //         operator: "0x8fccc78dae0a8f93b0fe6799de888d4c57e273db",
    //         recipient: "0x65562b673896B1C62e4b2429A9A91C1F010B8977",
    //         signature: "0x41179f88e0d5e7ce53dd25c5f5c5ae8b1a8e706115b3a8b0ae18d2b5773ad34b40be6e36b6a79e061d76c0579531243ed9352666e462978f5f8682396549d17a1b",
    //         fee_amount: "10000",
    //         recipient_amount: "990000",
    //         recipient_currency: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    //         refund_destination: "0xCEe6C68e3Cec2f7D332Ec15ea4dD61f21D294C45",
    //       },
    //     },
    //     contract_addresses: {
    //       "1": "0x3263bc4976C8c180bd5EB90a57ED1A2f1CFcAC67",
    //       "137": "0x551c6791c2f01c3Cd48CD35291Ac4339F206430d",
    //       "8453": "0xeF0D482Daa16fa86776Bc582Aff3dFce8d9b8396",
    //     },
    //     contract_caller_request_id: "",
    //     settlement_currency_addresses: {
    //       "1": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    //       "137": "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    //       "8453": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    //     },
    //     subsidized_payments_chain_to_tokens: {
    //       "1": {
    //         token_addresses: [
    //           "",
    //         ],
    //       },
    //       "137": {
    //         token_addresses: [
    //           "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    //         ],
    //       },
    //       "8453": {
    //         token_addresses: [
    //           "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    //         ],
    //       },
    //     },
    //   },
    //   created_at: "2024-07-02T13:29:51Z",
    //   expires_at: "2024-07-04T13:29:51Z",
    //   hosted_url: "https://commerce.coinbase.com/pay/afb9a47b-9103-4d8c-8669-cb53c5e75268",
    //   brand_color: "#006CFF",
    //   charge_kind: "WEB3",
    //   description: "Order ID: 35",
    //   pricing_type: "fixed_price",
    //   support_email: "cuentaparavtv@gmail.com",
    //   brand_logo_url: "https://res.cloudinary.com/commerce/image/upload/v1715799307/dlpuf86b6hqh9sk9h9sg.png",
    //   collected_email: true,
    //   organization_name: "Onlybags",
    //   web3_retail_payment_metadata: {
    //     fees: [
    //     ],
    //     quote_id: "",
    //     source_amount: {
    //       amount: null,
    //       currency: null,
    //     },
    //     exchange_rate_with_spread: {
    //       amount: null,
    //       currency: null,
    //     },
    //     exchange_rate_without_spread: {
    //       amount: null,
    //       currency: null,
    //     },
    //     max_retail_payment_value_usd: 10000,
    //   },
    //   web3_retail_payments_enabled: true,
    // }
    switch (type) {
      // case 'charge:created':
      //   console.log(eventData);
      //   break;

      case 'charge:pending':
        setCoinbaseOrderAsPaid(eventData);
        break;
      case 'charge:failed':
        setCoinbaseOrderAsFailed(eventData);
        break;
      default:
        console.log(`Unhandled event type ${type}`);
    }
  } catch (err) {
    console.log(err.message);
  }
};

const setCoinbaseOrderAsPaid = async (
  coinbaseOrder: CoinbasePaymentStatusData
) => {
  const foundCoinbaseOrder = await coinbaseOrderRepository.findOne({
    where: {
      code: coinbaseOrder.code,
    },
    relations: {
      datasource: true,
      customer: true,
      order: true,
    },
  });
  if (!foundCoinbaseOrder) {
    throw new Error('Coinbase Order not found');
  }
  const platform = foundCoinbaseOrder.datasource.platform;
  const foundOrder = await orderRepository.findOne({
    where: {
      id: foundCoinbaseOrder.order.id,
    },
    relations: {
      datasource: true,
    },
  });
  if (!foundOrder) {
    throw new Error('Order not found');
  }
  foundCoinbaseOrder.status = 'PAID';
  await coinbaseOrderRepository.save(foundCoinbaseOrder);

  foundOrder.status = 'completed';
  await orderRepository.save(foundOrder);

  platform === 'woocommerce'
    ? await setOrderAsPayed(foundOrder)
    : await createOrderInvoice(foundOrder);
  const notifyData: EcommerceWsData = {
    type: 'ecommerce',
    datasource: foundCoinbaseOrder.datasource.id,
    wallet: foundCoinbaseOrder.customer.wallet,
    status: 'success',
    orderId: foundOrder.id,
    orderKey:
      platform === 'woocommerce' ? foundOrder.orderKey : foundOrder.orderKey,
  };
  notifyPurschase(notifyData);
};

const setCoinbaseOrderAsFailed = async (
  coinbaseOrder: CoinbasePaymentStatusData
) => {
  const foundCoinbaseOrder = await coinbaseOrderRepository.findOne({
    where: {
      code: coinbaseOrder.code,
    },
    relations: {
      datasource: true,
      customer: true,
      order: true,
    },
  });
  if (!foundCoinbaseOrder) {
    throw new Error('Coinbase Order not found');
  }
  const platform = foundCoinbaseOrder.datasource.platform;
  const foundOrder = await orderRepository.findOne({
    where: {
      id: foundCoinbaseOrder.order.id,
    },
    relations: {
      datasource: true,
    },
  });
  if (!foundOrder) {
    throw new Error('Order not found');
  }
  foundCoinbaseOrder.status = 'FAILED';
  await coinbaseOrderRepository.save(foundCoinbaseOrder);

  foundOrder.status = 'completed';
  await orderRepository.save(foundOrder);

  platform === 'woocommerce'
    ? await setOrderAsPayed(foundOrder)
    : await createOrderInvoice(foundOrder);
  const notifyData: EcommerceWsData = {
    type: 'ecommerce',
    datasource: foundCoinbaseOrder.datasource.id,
    wallet: foundCoinbaseOrder.customer.wallet,
    status: 'fail',
    orderId: foundOrder.id,
    orderKey:
      platform === 'woocommerce' ? foundOrder.orderKey : foundOrder.orderKey,
  };
  notifyPurschase(notifyData);
};

const saveCoinbaseOrder = async ({
  coinbaseOrderLink,
  datasourceId,
  customerWallet,
  orderId,
}: {
  coinbaseOrderLink: CoinbasePaymentStatusData;
  datasourceId: number;
  customerWallet: string;
  orderId: number;
}) => {
  const coinbaseOrderToSave = new CoinbaseOrder();
  const foundDatasource = await datasourceRepository.findOne({
    where: {
      id: datasourceId,
    },
  });
  if (!foundDatasource) {
    throw new Error('Datasource not found');
  }
  const foundCustomer = await customerRepository.findOne({
    where: {
      wallet: customerWallet,
    },
  });

  if (!foundCustomer) {
    throw new Error('Customer not found');
  }

  const foundOrder = await orderRepository.findOne({
    where: {
      id: orderId,
    },
  });

  if (!foundOrder) {
    throw new Error('Order not found');
  }

  coinbaseOrderToSave.checkoutUrl = coinbaseOrderLink.hosted_url;
  coinbaseOrderToSave.currency =
    coinbaseOrderLink?.pricing?.settlement?.currency || 'USDC';
  coinbaseOrderToSave.datasource = foundDatasource;
  coinbaseOrderToSave.customer = foundCustomer;
  coinbaseOrderToSave.order = foundOrder;
  coinbaseOrderToSave.coinbaseId = coinbaseOrderLink.id;
  if (coinbaseOrderLink?.expires_at)
    coinbaseOrderToSave.expireTime = new Date(coinbaseOrderLink?.expires_at)
      .getTime()
      .toString();
  coinbaseOrderToSave.code = coinbaseOrderLink.code;
  coinbaseOrderToSave.status = 'CREATED';
  await coinbaseOrderRepository.save(coinbaseOrderToSave);
};

const compare = (a: string, b: string) => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;

  let mismatch = a.length === b.length ? 0 : 1;
  if (mismatch) {
    b = a;
  }

  for (let i = 0, il = a.length; i < il; ++i) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return mismatch === 0;
};

const computeSignature = (payload: string, secret: string) => {
  return crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
};

const verifySigHeader = (
  payload: string,
  sigHeader: string,
  secret: string
) => {
  const computedSignature = computeSignature(payload, secret);

  if (!compare(computedSignature, sigHeader)) {
    const message =
      'No signatures found matching the expected signature ' +
      sigHeader +
      ' for payload ' +
      payload;
    throw new Error(message);
  }

  return true;
};

const verifyEventBody = (
  payload: string,
  sigHeader: string,
  secret: string
) => {
  let data;

  try {
    data = JSON.parse(payload);
  } catch (error) {
    throw new Error(
      'Invalid payload provided. No JSON object could be decoded' + payload
    );
  }

  if (!(data && data.event)) {
    throw new Error('Invalid payload provided.' + payload);
  }

  verifySigHeader(payload, sigHeader, secret);

  return data.event;
};
