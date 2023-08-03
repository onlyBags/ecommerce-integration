import { createNewWoocommerceInstance } from '../util/index.js';
import { AppDataSource, User } from '@dg-live/ecommerce-db';

import { WebhookData, WCRequestOptions } from '@dg-live/ecommerce-data-types';
const userReposiotry = AppDataSource.getRepository(User);

export const createWebhooks = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions) => {
  try {
    const foundClient = await userReposiotry.findOne({
      where: {
        apiKey,
        datasource: {
          id: datasourceId,
        },
      },
      relations: ['datasource'],
    });
    if (!foundClient) throw new Error('User not found');
    const secret = foundClient.datasource[0].webhookSecret;
    const wc = await createNewWoocommerceInstance({ apiKey, datasourceId });
    if (!wc) throw new Error('Could not create woocomerce instance');

    const delivery_url = `https://ecommerce-api.dglive.org/v1/webhooks/${apiKey}/${datasourceId}`;
    const delivery_url_dev = `https://ab95-181-169-89-127.ngrok-free.app/v1/webhooks/${apiKey}/${datasourceId}`;

    const webhookTopics: string[] = [
      'product.created',
      'product.updated',
      'product.deleted',
    ];
    const data: WebhookData = {
      create: [],
    };
    for (const topic of webhookTopics) {
      data.create.push(
        {
          name: `DG-Live-Webhook-Prod-${topic}`,
          topic,
          delivery_url,
          secret,
        },
        {
          name: `DG-Live-Webhook-Dev-${topic}`,
          topic,
          delivery_url: delivery_url_dev,
          secret,
        }
      );
    }
    return await wc.post('webhooks/batch', data);
  } catch (err) {
    throw err;
  }
};
