import { ECRequestOptions } from '../interfaces/index.js';
import { createNewWoocommerceInstance } from '../util/index.js';
import { envConfig } from '@dg-live/ecommerce-config';

export const createWebhooks = async ({
  apiKey,
  datasourceId,
}: ECRequestOptions) => {
  try {
    const wc = await createNewWoocommerceInstance({ apiKey, datasourceId });
    if (!wc) throw new Error('Could not create woocomerce instance');
    const webhookTopics: string[] = [
      'product.created',
      'product.updated',
      'product.deleted',
    ];
    for (const topic of webhookTopics) {
      const webhookData = {
        name: `DG-Live-Webhook-Prod-${topic}`,
        topic,
        delivery_url: `https://ecommerce-api.dglive.org/v1/webhooks/${apiKey}/${datasourceId}`,
        secret: envConfig.webhookSecret,
      };
      const savedWh = await wc.post('webhooks', webhookData);
      console.log('savedWh: ', savedWh);
      const webhookDataDev = {
        name: `DG-Live-Webhook-Dev-${topic}`,
        topic,
        delivery_url: `https://4384-179-27-110-110.ngrok-free.app/v1/webhooks/${apiKey}/${datasourceId}`,
        secret: envConfig.webhookSecret,
      };
      await wc.post('webhooks', webhookDataDev);
    }
  } catch (err) {
    console.log(err);
    debugger;
    throw err;
  }
};
