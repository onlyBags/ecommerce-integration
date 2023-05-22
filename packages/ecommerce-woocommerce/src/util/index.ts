import { AppDataSource, User } from '@dg-live/ecommerce-db';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

const WooCommerceRest = WooCommerceRestApi.default;
const userRepository = AppDataSource.getRepository(User);

export const createNewWoocommerceInstance = async ({
  apiKey,
  datasourceId,
}): Promise<InstanceType<typeof WooCommerceRest> | null> => {
  const foundUserDatasource = await userRepository.findOne({
    relations: ['datasource'],
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
      },
    },
  });
  if (!foundUserDatasource) return null;
  const { baseUrl, consumerKey, consumerSecret } =
    foundUserDatasource.datasource[0];

  const WooCommerceApi = new WooCommerceRest({
    url: baseUrl,
    consumerKey,
    consumerSecret,
    version: 'wc/v3',
  });
  return WooCommerceApi;
};
