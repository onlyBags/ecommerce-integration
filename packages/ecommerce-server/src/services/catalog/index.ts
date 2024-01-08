import { AppDataSource, Datasource } from '@dg-live/ecommerce-db';

import {
  syncCatalog,
  getAllProducts as wcGetAllProducts,
  getSettings,
} from '@dg-live/ecommerce-woocommerce';

const datasourceRepository = AppDataSource.getRepository(Datasource);

export const getAllProducts = async (datasourceId: number) => {
  const datasource = await datasourceRepository.findOne({
    where: {
      id: datasourceId,
    },
  });
  if (!datasource) throw new Error('Invalid datasourceId');
  return datasource.platform === 'woocommerce'
    ? await wcGetAllProducts({ datasourceId })
    : [];
};
