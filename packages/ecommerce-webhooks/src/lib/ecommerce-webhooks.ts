import { Request, Response, NextFunction } from 'express';
import { envConfig } from '@dg-live/ecommerce-config';
import { validateWebhookBody } from '../utils/index.js';

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { headers } = req;
    const { body } = req;
    const { type } = body;
    const { params } = req;
    const { apiKey, datasourceId } = params;
    const source = headers['x-wc-webhook-source'];
    const whSignature =
      headers['x-wc-webhook-signature'] &&
      typeof headers['x-wc-webhook-signature'] === 'string'
        ? headers['x-wc-webhook-signature']
        : '';

    const whSource =
      headers['x-wc-webhook-source'] &&
      typeof headers['x-wc-webhook-source'] === 'string'
        ? headers['x-wc-webhook-source']
        : '';
    const whTopic =
      headers['x-wc-webhook-topic'] &&
      typeof headers['x-wc-webhook-topic'] === 'string'
        ? headers['x-wc-webhook-topic']
        : '';
    const whResource =
      headers['x-wc-webhook-resource'] &&
      typeof headers['x-wc-webhook-resource'] === 'string'
        ? headers['x-wc-webhook-resource']
        : '';
    const whEvent =
      headers['x-wc-webhook-event'] &&
      typeof headers['x-wc-webhook-event'] === 'string'
        ? headers['x-wc-webhook-event']
        : '';
    const reqIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    if (!whSignature && !whEvent && !whSource)
      return res.status(200).json({ message: `hi ${reqIp}` });
    if (!whSignature) throw new Error("Signature doesn't exist");

    if (
      !validateWebhookBody(whSignature, body)
      // !validateSource(apiKey, datasourceId)
    ) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    switch (whEvent) {
      case 'product.deleted':
        break;
      case 'product.updated':
        break;
      case 'product.created':
        break;
      default:
        break;
    }
    if (type === 'order.created') {
      return res.status(200).json({
        apiKey: apiKey,
        datasourceId: datasourceId,
        type,
        source,
        whSignature,
      });
    }
    return res.status(201).json({
      apiKey: apiKey,
      datasourceId: datasourceId,
      source,
      whSignature,
    });
  } catch (err) {
    return res.status(500).json({
      message: err.message || 'Internal Server Error',
    });
  }
};

// const validateSource = async (apiKey: string, datasourceId: number) => {

// }
