import { AppDataSource, Datasource } from '@dg-live/ecommerce-db';

import {
  syncCatalog as wcSyncCatalog,
  getAllProducts as wcGetAllProducts,
  getSettings,
  getAllSlots as wcGetAllSlots,
} from '@dg-live/ecommerce-woocommerce';

import {
  syncCatalog as mgSyncCatalog,
  getAllProducts as mgGetAllProducts,
  getAllSlots as mgGetAllSlots,
} from '@dg-live/ecommerce-magento';

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
    : await mgGetAllProducts({ datasourceId });
};

export const syncCatalog = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}) => {
  const datasource = await datasourceRepository.findOne({
    where: {
      id: datasourceId,
    },
  });
  if (!datasource) throw new Error('Invalid datasourceId');
  return datasource.platform === 'woocommerce'
    ? await wcSyncCatalog({ apiKey, datasourceId })
    : await mgSyncCatalog({ apiKey, datasourceId });
};

export const getAllSlots = async (datasourceId: number) => {
  const datasource = await datasourceRepository.findOne({
    where: {
      id: datasourceId,
    },
  });
  if (!datasource) throw new Error('Invalid datasourceId');
  return datasource.platform === 'woocommerce'
    ? await wcGetAllSlots({ datasourceId })
    : await mgGetAllSlots({ datasourceId });
};
