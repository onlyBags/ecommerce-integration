import { createHmac, createDecipheriv } from 'crypto';

import { envConfig } from '@dg-live/ecommerce-config';

const { webhookSecret } = envConfig;

export const validateWebhookBody = (
  encodedSignature: string,
  payload: string
) => {
  try {
    const hmac = createHmac('sha256', webhookSecret);
    const hash = hmac.update(Buffer.from(payload, 'utf8')).digest('base64');
    debugger;
    return hash === encodedSignature;
  } catch (error) {
    console.log(error);
    debugger;
    throw new Error('Could not validate webhook body');
  }
};
