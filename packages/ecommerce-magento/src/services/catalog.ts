import { createMagentoOauthInstance } from '../utils/index.js';

export const getAllProducts = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}): Promise<any> => {
  try {
    return await createMagentoOauthInstance({
      apiKey,
      datasourceId,
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
};
