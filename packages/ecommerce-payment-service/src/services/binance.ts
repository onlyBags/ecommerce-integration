import {
  IBinanceLink,
  IBinanceQueryOrder,
} from '@dg-live/ecommerce-data-types';
import crypto from 'crypto';
import { envConfig } from '@dg-live/ecommerce-config';
import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';

import {
  AppDataSource,
  BinanceOrder,
  Customer,
  Datasource,
  Order,
} from '@dg-live/ecommerce-db';
const binanceOrderRepository = AppDataSource.getRepository(BinanceOrder);
const datasourceRepository = AppDataSource.getRepository(Datasource);
const orderRepository = AppDataSource.getRepository(Order);
const customerRepository = AppDataSource.getRepository(Customer);
export const binanceWebhook = async (req: Request, res: Response) => {
  try {
    res.status(200).json({ returnCode: 'SUCCESS', returnMessage: null });
    const body = JSON.parse(req.body);
    const data = JSON.parse(JSON.parse(req.body).data);
    const { merchantTradeNo } = data;

    try {
      const headers = req.headers;
      const timestamp = headers['binancepay-timestamp'] as string;
      const nonce = headers['binancepay-nonce'] as string;
      const signature = headers['binancepay-signature'] as string;
      const certificateSN = headers['binancepay-certificate-sn'] as string;
      console.log('====================================');
      console.log('certificateSN', certificateSN);
      console.log('====================================');

      const payload = `${timestamp}\n${nonce}\n${JSON.stringify(body)}\n`;
      const decodedSignature = Buffer.from(signature, 'base64');
      let pubKey = '';
      let pubKey2 = '';
      try {
        pubKey = await fetchPublicKey();
      } catch (error) {
        console.log(error);
      }
      try {
        pubKey2 = await fetchPublicKeyNew({
          nonce,
          timestamp,
          body,
        });
      } catch (error) {
        console.log(error);
      }
      try {
        const isValid = verifySignature(payload, decodedSignature, pubKey);
        console.log('====================================');
        console.log(isValid);
        console.log('====================================');
      } catch (error) {
        console.log(error);
      }

      try {
        const isValid2 = verifySignature2(payload, signature, pubKey);
        console.log('====================================');
        console.log(isValid2);
        console.log('====================================');
      } catch (error) {
        console.log(error);
      }
      try {
        if (body.bizIdStr) {
          body.bizId = body.bizIdStr;
        }
        const payload: string = `${timestamp}\n${nonce}\n${JSON.stringify(
          body
        )}\n`.replace(/"bizId":"([^"]*)"/g, '"bizId":$1');
        const isValid3 = verifySignature2(payload, signature, pubKey);
        console.log('====================================');
        console.log(isValid3);
        console.log('====================================');
      } catch (error) {
        console.log(error);
      }
      if (pubKey2) {
        try {
          const isValid = verifySignature(payload, decodedSignature, pubKey2);
          console.log('====================================');
          console.log(isValid);
          console.log('====================================');
        } catch (error) {
          console.log(error);
        }

        try {
          const isValid2 = verifySignature2(payload, signature, pubKey2);
          console.log('====================================');
          console.log(isValid2);
          console.log('====================================');
        } catch (error) {
          console.log(error);
        }
        try {
          if (body.bizIdStr) {
            body.bizId = body.bizIdStr;
          }
          const payload: string = `${timestamp}\n${nonce}\n${JSON.stringify(
            body
          )}\n`.replace(/"bizId":"([^"]*)"/g, '"bizId":$1');
          const isValid3 = verifySignature2(payload, signature, pubKey2);
          console.log('====================================');
          console.log(isValid3);
          console.log('====================================');
        } catch (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }

    if (body.bizType !== 'PAY_REFUND') {
      await queryOrder(merchantTradeNo);
    }
  } catch (err) {
    console.error(`[Binance binanceWebhook] Error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
};

export const createPaymentLink = async ({
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
}): Promise<IBinanceLink> => {
  try {
    if (
      !envConfig.binanceApiKey ||
      !envConfig.binanceApiSecret ||
      !envConfig.baseUrl ||
      !envConfig.binanceApiUrl
    ) {
      throw new Error(
        'Binance API Key, Binance API Secret or Base URL not found'
      );
    }
    const timestamp = new Date().getTime();
    const nonce = randomString();

    const formattedPrice = Number(totalPrice).toFixed(2);
    const merchantTradeNo = new Date().getTime().toString();
    // https://developers.binance.com/docs/binance-pay/api-order-create-v3
    const body = {
      env: {
        terminalType: 'APP',
      },
      merchantTradeNo,
      orderAmount: formattedPrice,
      currency: 'USDT',
      fiatAmount: formattedPrice,
      webhookUrl: `https://fe41-181-169-153-185.ngrok-free.app/v1/binance/webhook`,
      // webhookUrl: `${envConfig.baseUrl}/binance/webhook`,
      description: 'Onlybags - Marketplace',
      goodsDetails: products.map((product) => ({
        goodsType: '02',
        goodsCategory: 'Z000',
        referenceGoodsId: `${product.id}`,
        goodsName: product.name,
        goodsDetail: product?.description || 'No description',
      })),
    };

    const payload =
      timestamp + '\n' + nonce + '\n' + JSON.stringify(body) + '\n';
    const signature = hashSignature(
      payload,
      envConfig.binanceApiSecret
    ).toUpperCase();
    const headers = {
      'Content-Type': 'application/json',
      'BinancePay-Timestamp': timestamp,
      'BinancePay-Nonce': nonce,
      'BinancePay-Certificate-SN': envConfig.binanceApiKey,
      'BinancePay-Signature': signature,
    };
    const binanceLinkRes: any = await axios.post(
      `${envConfig.binanceApiUrl}/binancepay/openapi/v3/order`,
      body,
      {
        headers,
      }
    );
    if (binanceLinkRes.data.status === 'SUCCESS') {
      const res: IBinanceLink = binanceLinkRes.data.data;
      await saveBinanceOrder({
        binanceOrderLink: res,
        datasourceId,
        customerWallet,
        orderId,
      });
      return res;
    } else throw new Error('Error generating payment link');
  } catch (error) {
    let errMsg = error;
    if (error.message) errMsg += `\n Error Message: ${error.message}`;
    if (error?.response?.data?.errorMessag)
      errMsg += `\n Response Error Message: ${error.response.data.errorMessage}`;
    if (error?.response?.data?.errorMessage)
      throw new Error(error?.response?.data?.errorMessage);
    throw error;
  }
};

const queryOrder = async (merchantTradeNo: string): Promise<any> => {
  const timestamp = new Date().getTime();
  const nonce = randomString();
  const payloadToSign =
    timestamp +
    '\n' +
    nonce +
    '\n' +
    JSON.stringify({ merchantTradeNo }) +
    '\n';
  const signature = hashSignature(
    payloadToSign,
    envConfig.binanceApiSecret
  ).toUpperCase();
  const headers = {
    'Content-Type': 'application/json',
    'BinancePay-Timestamp': timestamp,
    'BinancePay-Nonce': nonce,
    'BinancePay-Certificate-SN': envConfig.binanceApiKey,
    'BinancePay-Signature': signature,
  };
  let errorData: IBinanceQueryOrder;
  try {
    const { data: binanceLinkRes }: AxiosResponse<IBinanceQueryOrder> =
      await axios.post(
        `${envConfig.binanceApiUrl}/binancepay/openapi/v2/queryOrder`,
        { merchantTradeNo },
        {
          headers,
        }
      );
    return binanceLinkRes;
  } catch (error) {
    console.log(error);
    throw new Error('Error querying order');
  }
};

const saveBinanceOrder = async ({
  binanceOrderLink,
  datasourceId,
  customerWallet,
  orderId,
}: {
  binanceOrderLink: IBinanceLink;
  datasourceId: number;
  customerWallet: string;
  orderId: number;
}) => {
  try {
    const binanceOrderToSave = new BinanceOrder();

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

    binanceOrderToSave.checkoutUrl = binanceOrderLink.checkoutUrl;
    binanceOrderToSave.currency = binanceOrderLink?.currency || 'USDT';
    binanceOrderToSave.datasource = foundDatasource;
    binanceOrderToSave.customer = foundCustomer;
    binanceOrderToSave.order = foundOrder;
    binanceOrderToSave.expireTime = binanceOrderLink.expireTime.toString();
    binanceOrderToSave.qrcodeLink = binanceOrderLink.qrcodeLink;
    binanceOrderToSave.prepayId = binanceOrderLink.prepayId;
    binanceOrderToSave.status = 'CREATED';
    await binanceOrderRepository.save(binanceOrderToSave);
  } catch (err) {
    throw err;
  }
};

const randomString = (): string =>
  crypto.randomBytes(32).toString('hex').substring(0, 32);

const hashSignature = (queryString: string, secret: string): string => {
  return crypto.createHmac('sha512', secret).update(queryString).digest('hex');
};

async function fetchPublicKey() {
  try {
    const timestamp = Date.now().toString();
    const nonce = randomString();

    const payloadToSign =
      timestamp + '\n' + nonce + '\n' + JSON.stringify({}) + '\n';
    const signature = hashSignature(
      payloadToSign,
      envConfig.binanceApiSecret
    ).toUpperCase();

    const res = await axios.post(
      `${envConfig.binanceApiUrl}/binancepay/openapi/certificates`,
      JSON.stringify({}),
      {
        headers: {
          'Content-Type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': envConfig.binanceApiKey,
          'BinancePay-Signature': signature,
        },
      }
    );

    let pubKey = '';
    res.data.data.forEach((cert: any) => {
      console.log(`certSerial: ${cert.certSerial}`);
      pubKey = cert.certPublic;
      console.log(`certPublic: ${cert.certPublic}`);
    });

    return pubKey;
  } catch (err) {
    throw new Error(`Failed to fetch public key: ${err.message}`);
  }
}

async function fetchPublicKeyNew({
  nonce,
  timestamp,
  body,
}: {
  nonce: string;
  timestamp: string;
  body: Object;
}) {
  try {
    const payloadToSign =
      timestamp + '\n' + nonce + '\n' + JSON.stringify(body) + '\n';
    const signature = hashSignature(
      payloadToSign,
      envConfig.binanceApiSecret
    ).toUpperCase();

    const res = await axios.post(
      `${envConfig.binanceApiUrl}/binancepay/openapi/certificates`,
      body,
      {
        headers: {
          'Content-Type': 'application/json',
          'BinancePay-Timestamp': timestamp,
          'BinancePay-Nonce': nonce,
          'BinancePay-Certificate-SN': envConfig.binanceApiKey,
          'BinancePay-Signature': signature,
        },
      }
    );

    let pubKey = '';
    res.data.data.forEach((cert: any) => {
      console.log(`certSerial: ${cert.certSerial}`);
      pubKey = cert.certPublic;
      console.log(`certPublic: ${cert.certPublic}`);
    });

    return pubKey;
  } catch (err) {
    throw new Error(`Failed to fetch public key: ${err.message}`);
  }
}

function verifySignature(
  payload: string,
  decodedSignature: Buffer,
  publicKey: string
): boolean {
  const verifier = crypto.createVerify('SHA256');
  verifier.update(Buffer.from(payload));
  verifier.end();

  return verifier.verify(publicKey, decodedSignature);
}

const verifySignature2 = (
  payload: string,
  decodedSignature: string,
  publicKey: string
) => {
  const data: Buffer = Buffer.from(payload);
  const signature: Buffer = Buffer.from(decodedSignature);
  return crypto.verify(
    'sha256',
    data,
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_PADDING,
    },
    signature
  );
};
