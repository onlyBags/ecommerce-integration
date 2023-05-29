import { Request, Response } from 'express';
import { validateWebhookBody } from '../utils/index.js';
import { AppDataSource, User } from '@dg-live/ecommerce-db';

const userRepository = AppDataSource.getRepository(User);

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { headers } = req;
    const { body } = req;
    const { params } = req;
    const { apiKey, datasourceId } = params;

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

    const foundUser = await userRepository.findOne({
      where: { apiKey, datasource: { id: +datasourceId } },
      relations: ['datasource'],
    });

    if (!foundUser)
      return res.status(404).json({ message: 'Datasource not found' });
    if (
      !validateWebhookBody(
        whSignature,
        body,
        foundUser.datasource[0].webhookSecret
      ) ||
      !(await validateSource(foundUser, whSource))
    ) {
      return res.status(401).json({
        message: 'Unauthorized',
      });
    }

    switch (whTopic) {
      case 'product.deleted':
        break;
      case 'product.updated':
        debugger;
        break;
      case 'product.created':
        break;
      default:
        return res.status(200).json({ message: `hi ${reqIp}` });
    }
  } catch (err) {
    return res.status(500).json({
      message: err.message || 'Internal Server Error',
    });
  }
};

const validateSource = async (user: User, source: string): Promise<boolean> => {
  if (user?.datasource) {
    if (user?.datasource.length) {
      user?.datasource[0].baseUrl === source;
    }
    return false;
  }
};
