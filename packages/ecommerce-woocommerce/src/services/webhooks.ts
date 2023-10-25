import { createNewWoocommerceInstance } from '../util/index.js';
import { AppDataSource, User } from '@dg-live/ecommerce-db';

import {
  WebhookData,
  WCRequestOptions,
  WoocommerceWebhookResponse,
} from '@dg-live/ecommerce-data-types';
const userReposiotry = AppDataSource.getRepository(User);

const webhookTopics: string[] = [
  'product.created',
  'product.updated',
  'product.deleted',
];
const createWebhooksData = async ({
  apiKey,
  datasourceId,
  secret,
}: {
  apiKey: string;
  datasourceId: number;
  secret: string;
}): Promise<WebhookData> => {
  const delivery_url = `https://ecommerce-api.dglive.org/v1/webhooks/${apiKey}/${datasourceId}`;
  const delivery_url_dev = `http://7968-190-231-87-21.ngrok-free.app/v1/webhooks/${apiKey}/${datasourceId}`;
  const data: WebhookData = {
    create: [],
  };
  const currentWebhooks = await getWebhooks({ apiKey, datasourceId });
  const topicsToCreate = webhookTopics.filter((x) => {
    const found = currentWebhooks.find((y) => y.topic === x);
    if (!found) return true;
    return false;
  });
  for (const topic of topicsToCreate) {
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
  return data;
};

export const getWebhooks = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions): Promise<WoocommerceWebhookResponse[]> => {
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
  const wc = await createNewWoocommerceInstance({ apiKey, datasourceId });
  if (!wc) throw new Error('Could not create woocomerce instance');
  try {
    const { data } = await wc.get('webhooks');
    return data as WoocommerceWebhookResponse[];
  } catch (error) {
    throw error;
  }
};

export const createWebhooks = async ({
  apiKey,
  datasourceId,
}: WCRequestOptions): Promise<WoocommerceWebhookResponse[]> => {
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
    const wc = await createNewWoocommerceInstance({ apiKey, datasourceId });
    if (!wc) throw new Error('Could not create woocomerce instance');
    const secret = foundClient.datasource[0].webhookSecret;
    const data = await createWebhooksData({
      apiKey,
      datasourceId,
      secret,
    });

    const wcRes = await wc.post('webhooks/batch', data);
    return wcRes.data as WoocommerceWebhookResponse[];
  } catch (err) {
    console.log(err);
    debugger;
    throw err;
  }
};
