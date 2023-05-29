import { WCRequestOptions } from '../interfaces/index.js';
import { createNewWoocommerceInstance } from '../util/index.js';
import { envConfig } from '@dg-live/ecommerce-config';
import { AppDataSource, User } from '@dg-live/ecommerce-db';

import { WebhookData } from '../interfaces/index.js';
const userReposiotry = AppDataSource.getRepository(User);

export const createWebhooks = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions) => {
  try {
    const foundUser = await userReposiotry.findOne({
      where: {
        apiKey,
        datasource: {
          id: datasourceId,
        },
      },
      relations: ['datasources'],
    });
    if (!foundUser) throw new Error('User not found');
    const secret = foundUser.datasource[0].webhookSecret;
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
    // https://ab95-181-169-89-127.ngrok-free.app
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
    // for (const topic of webhookTopics) {
    //   const webhookData = {
    //     name: `DG-Live-Webhook-Prod-${topic}`,
    //     topic,
    //     delivery_url: `https://ecommerce-api.dglive.org/v1/webhooks/${apiKey}/${datasourceId}`,
    //     secret: envConfig.webhookSecret,
    //   };
    //   const savedWh = await wc.post('webhooks', webhookData);
    //   console.log('savedWh: ', savedWh);
    //   const webhookDataDev = {
    //     name: `DG-Live-Webhook-Dev-${topic}`,
    //     topic,
    //     delivery_url: `https://4384-179-27-110-110.ngrok-free.app/v1/webhooks/${apiKey}/${datasourceId}`,
    //     secret: envConfig.webhookSecret,
    //   };
    //   await wc.post('webhooks', webhookDataDev);
    // }
  } catch (err) {
    console.log(err);
    debugger;
    throw err;
  }
};
