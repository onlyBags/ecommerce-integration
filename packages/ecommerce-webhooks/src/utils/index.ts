import { createHmac } from 'crypto';

export const validateWebhookBody = (
  encodedSignature: string,
  payload: string,
  webhookSecret: string
) => {
  try {
    const hmac = createHmac('sha256', webhookSecret);
    const hash = hmac.update(Buffer.from(payload, 'utf8')).digest('base64');
    return hash === encodedSignature;
  } catch (error) {
    console.log(error);
    throw new Error('Could not validate webhook body');
  }
};
