import { AppDataSource, User, Datasource } from '@dg-live/ecommerce-db';

const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);

const createNewWoocommerceInstance = () => {};

export const getAllProducts = async ({ apiKey, datasourceId }: any) => {
  console.log('getAllProducts');
};

export const syncCatalog = async ({ apiKey, datasourceId }: any) => {
  console.log('getAllProducts');
  const foundUserDatasource = await userRepository.findOne({
    relations: ['datasource'],
    where: {
      apiKey,
      datasource: {
        id: datasourceId,
      },
    },
  });
  if (!foundUserDatasource) throw new Error('User not found');
  console.log('foundUserDatasource: ', foundUserDatasource);
};
