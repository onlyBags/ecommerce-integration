import {
  AppDataSource,
  User,
  Datasource,
  Slot,
  WoocommerceProduct,
  ShippingCost,
  MagentoProduct,
} from '@dg-live/ecommerce-db';
import {
  DatasourceShippingCost,
  DatasourceShippingCostUpdate,
  JoystickBaseData,
  JoystickSlotData,
  NewSlotReq,
  SaveUserDatasourceReq,
  SaveUserReq,
  UpdateSlotReq,
  UpdateUserDatasourceReq,
} from '@dg-live/ecommerce-data-types';

import { getPassword } from '../../util/index.js';
import { getSettings } from '@dg-live/ecommerce-woocommerce';
import axios from 'axios';
import { envConfig } from '@dg-live/ecommerce-config';
import { countries } from '../../data/countries.js';

const { nodeEnv } = envConfig;
interface WooCommerceCurrencySettings {
  id: string;
  label: string;
  description: string;
  type: string;
  default: string;
  options: Record<string, string>;
  tip: string;
  value: string;
  _links: {
    self: { href: string[] };
    collection: { href: string[] };
  };
}

const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);
const slotRepository = AppDataSource.getRepository(Slot);
const woocommerceProductRepository =
  AppDataSource.getRepository(WoocommerceProduct);
const magentoProductRepository = AppDataSource.getRepository(MagentoProduct);
const shippingCostRepository = AppDataSource.getRepository(ShippingCost);

const dashboardConfig = {
  baseURL: 'https://business.dglive.org/api',
};
const dashboardApi = axios.create(dashboardConfig);

const proccesImage = async (imageUrl: string): Promise<string> => {
  // const response = await axios.post('http://localhost:5000/process-image', {
  const url =
    nodeEnv === 'production'
      ? 'http://python-service:5000/process-image'
      : 'http://localhost:5000/process-image';
  const response = await axios.post(url, {
    url: imageUrl,
  });
  return response.data.url;
};

export const saveClient = async (clientReq: SaveUserReq): Promise<User> => {
  const user = new User();
  user.username = clientReq.username;
  user.apiKey = clientReq.apiKey;
  user.isActive = true;
  return await userRepository.save(user);
};

export const saveUserDatasource = async (
  apiKey: string,
  clientReq: SaveUserDatasourceReq
): Promise<Datasource> => {
  const user = await userRepository.findOneBy({
    apiKey,
    isActive: true,
  });

  if (!user) throw new Error('User not found');

  const datasource = new Datasource();
  datasource.user = user;
  datasource.name = clientReq.name;
  datasource.wallet = clientReq.wallet;
  datasource.platform = clientReq.platform;
  datasource.consumerKey = clientReq.consumerKey;
  datasource.consumerSecret = clientReq.consumerSecret;
  datasource.accessToken = clientReq.accessToken;
  datasource.accessTokenSecret = clientReq.accessTokenSecret;
  datasource.baseUrl = clientReq.baseUrl.replace(/\/$/, '');
  datasource.dollarRatio = clientReq.dollarRatio;
  datasource.webhookSecret = getPassword();
  datasource.isActive = true;
  try {
    const savedDatasource = await datasourceRepository.save(datasource);
    let storeSettings = [];
    try {
      if (datasource.platform === 'woocommerce') {
        storeSettings = await getSettings({
          apiKey,
          datasourceId: savedDatasource.id,
        });

        const foundCurrencySetting: WooCommerceCurrencySettings[] =
          storeSettings.filter((x) => x.id === 'woocommerce_currency');
        if (foundCurrencySetting.length) {
          const currencySettings = foundCurrencySetting[0];
          savedDatasource.currencyCode = currencySettings.value;
          await datasourceRepository.save(savedDatasource);
        }
      }
    } catch (error) {
      console.error(`Error getting store settings: ${error}`);
    }
    return savedDatasource;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateUserDatasource = async (
  apiKey: string,
  clientReq: UpdateUserDatasourceReq
): Promise<Datasource> => {
  const user = await userRepository.findOne({
    where: { apiKey },
  });

  if (!user) throw new Error('User not found');

  const datasource = await datasourceRepository.findOne({
    where: { id: clientReq.datasourceId, user: { id: user.id } },
  });

  if (!datasource) throw new Error('Datasource not found');
  datasource.name = clientReq.name || datasource.name;
  datasource.wallet = clientReq.wallet || datasource.wallet;
  datasource.consumerKey = clientReq.consumerKey || datasource.consumerKey;
  datasource.consumerSecret =
    clientReq.consumerSecret || datasource.consumerSecret;
  datasource.accessToken = clientReq.accessToken || datasource.accessToken;
  datasource.accessTokenSecret =
    clientReq.accessTokenSecret || datasource.accessTokenSecret;
  datasource.baseUrl = clientReq.baseUrl
    ? clientReq.baseUrl.replace(/\/$/, '')
    : datasource.baseUrl;
  datasource.dollarRatio = clientReq.dollarRatio || datasource.dollarRatio;
  datasource.isActive =
    clientReq.active !== undefined ? clientReq.active : datasource.isActive;

  try {
    const updatedDatasource = await datasourceRepository.save(datasource);
    let storeSettings = [];

    if (datasource.platform === 'woocommerce') {
      storeSettings = await getSettings({
        apiKey,
        datasourceId: updatedDatasource.id,
      });

      const foundCurrencySetting = storeSettings.find(
        (x) => x.id === 'woocommerce_currency'
      );
      if (foundCurrencySetting) {
        updatedDatasource.currencyCode = foundCurrencySetting.value;
        await datasourceRepository.save(updatedDatasource);
      }
    }

    return updatedDatasource;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteUserDatasource = async (
  apiKey: string,
  datasourceId: number
): Promise<void> => {
  const user = await userRepository.findOne({
    where: { apiKey },
  });

  if (!user) throw new Error('User not found');

  const datasource = await datasourceRepository.findOne({
    where: { id: datasourceId, user: { id: user.id } },
  });

  if (!datasource) throw new Error('Datasource not found');

  datasource.isActive = false;
  await datasourceRepository.save(datasource);
};

export const getUserDatasources = async (
  apiKey: string
): Promise<Datasource[]> => {
  try {
    const foundUser = await userRepository.findOne({
      where: { apiKey },
      relations: ['datasource'],
    });
    return foundUser?.datasource || [];
  } catch (err) {
    throw err;
  }
};

export const getUserDatasource = async (
  apiKey: string,
  datasourceId: number
): Promise<Datasource | []> => {
  const foundUser = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUser) throw new Error('User not found');
  if (foundUser?.datasource) {
    if (foundUser?.datasource.length) return foundUser.datasource[0];
    return [];
  }
};

export const saveSlot = async (
  apiKey: string,
  datasourceId: number,
  slotReq: NewSlotReq
): Promise<Slot> => {
  const {
    name,
    enabled,
    posX,
    posY,
    posZ,
    sizeX,
    sizeY,
    sizeZ,
    rotX,
    rotY,
    rotZ,
  } = slotReq;

  const foundUser = await getUserAndCheckDatasource(apiKey, datasourceId);

  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');

  const datasource = foundUser.datasource[0];

  const slot = new Slot();
  slot.name = name;
  slot.enabled = enabled;
  slot.posX = posX;
  slot.posY = posY;
  slot.posZ = posZ;
  slot.sizeX = sizeX;
  slot.sizeY = sizeY;
  slot.sizeZ = sizeZ;
  slot.rotX = rotX;
  slot.rotY = rotY;
  slot.rotZ = rotZ;

  if (!foundUser.datasource) {
    throw new Error('Datasource not found');
  }
  slot.datasource = datasource;

  try {
    const savedSlot = await slotRepository.save(slot);
    delete savedSlot.datasource;
    return savedSlot;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateSlot = async (
  apiKey: string,
  datasourceId: number,
  slotId: number,
  slotReq: UpdateSlotReq
): Promise<Slot> => {
  const foundUser = await getUserAndCheckDatasource(apiKey, datasourceId);
  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');
  const datasource = foundUser.datasource[0];
  const foundSlot = await slotRepository.findOne({
    where: { id: slotId, datasource: { id: datasourceId } },
    relations: {
      woocommerceProduct: datasource.platform === 'woocommerce',
      magentoProduct: datasource.platform !== 'woocommerce',
    },
  });
  // const foundSlot = await slotRepository.preload({ id: slotId, ...slotReq },);

  if (!foundSlot) throw new Error('Slot not found');

  if (!!slotReq.productId) {
    const productId = slotReq.productId;
    delete slotReq.productId;
    let foundProduct: WoocommerceProduct | MagentoProduct;

    if (datasource.platform === 'woocommerce') {
      foundProduct = await woocommerceProductRepository.findOne({
        where: { productId: productId, datasourceId },
        relations: {
          images: true,
        },
      });
    } else if (datasource.platform === 'magento') {
      foundProduct = await magentoProductRepository.findOne({
        where: { productId: productId, datasourceId },
        relations: {
          mediaGalleryEntries: true,
        },
      });
    }
    if (!foundProduct)
      throw new Error(
        `Product ${productId} not found in datasource ${datasourceId} and platform ${datasource.platform}`
      );
    if (datasource.platform === 'woocommerce') {
      foundSlot.woocommerceProduct = foundProduct as WoocommerceProduct;
      foundSlot.image = await proccesImage(
        foundSlot.woocommerceProduct.images[0].src
      );
    } else {
      foundSlot.magentoProduct = foundProduct as MagentoProduct;
      foundSlot.image = await proccesImage(
        `${datasource.baseUrl}/media/catalog/product${foundSlot.magentoProduct.mediaGalleryEntries[0].file}`
      );
    }
    try {
      await slotRepository.save({ ...foundSlot, ...slotReq });
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  try {
    if (Object.keys(slotReq).length) {
      const result = await slotRepository.update({ id: foundSlot.id }, slotReq);
    }
    const updatedSlot = await slotRepository.findOne({
      where: { id: slotId, datasource: { id: datasourceId } },
      relations: {
        woocommerceProduct: datasource.platform === 'woocommerce',
        magentoProduct: datasource.platform !== 'woocommerce',
      },
    });
    return updatedSlot;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

// export const updateSlot = async (
//   apiKey: string,
//   datasourceId: number,
//   slotId: number,
//   slotReq: UpdateSlotReq
// ): Promise<Slot> => {
//   const foundUser = await getUserAndCheckDatasource(apiKey, datasourceId);
//   if (!foundUser) throw new Error('User not found');
//   if (!foundUser.datasource.length) throw new Error('Datasource not found');

//   const foundSlot = await slotRepository.findOne({
//     where: { id: slotId, datasource: { id: datasourceId } },
//   });

//   if (!foundSlot) throw new Error('Slot not found');

//   if (slotReq.name !== undefined) {
//     foundSlot.name = slotReq.name;
//   }
//   if (slotReq.enabled !== undefined) {
//     foundSlot.enabled = slotReq.enabled;
//   }
//   if (slotReq.posX !== undefined) {
//     foundSlot.posX = slotReq.posX;
//   }
//   if (slotReq.posY !== undefined) {
//     foundSlot.posY = slotReq.posY;
//   }
//   if (slotReq.posZ !== undefined) {
//     foundSlot.posZ = slotReq.posZ;
//   }
//   if (slotReq.sizeX !== undefined) {
//     foundSlot.sizeX = slotReq.sizeX;
//   }
//   if (slotReq.sizeY !== undefined) {
//     foundSlot.sizeY = slotReq.sizeY;
//   }
//   if (slotReq.sizeZ !== undefined) {
//     foundSlot.sizeZ = slotReq.sizeZ;
//   }
//   if (slotReq.rotX !== undefined) {
//     foundSlot.rotX = slotReq.rotX;
//   }
//   if (slotReq.rotY !== undefined) {
//     foundSlot.rotY = slotReq.rotY;
//   }
//   if (slotReq.rotZ !== undefined) {
//     foundSlot.rotZ = slotReq.rotZ;
//   }
//   if (slotReq.productId !== undefined) {
//     foundSlot.productId = slotReq.productId;
//   }

//   try {
//     return await slotRepository.save(foundSlot);
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
// };

export const deleteSlot = async (
  apiKey: string,
  datasourceId: number,
  slotId: number
): Promise<void> => {
  const foundUser = await getUserAndCheckDatasource(apiKey, datasourceId);
  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');

  const foundSlot = await slotRepository.findOne({
    where: { id: slotId, datasource: { id: datasourceId } },
  });

  if (!foundSlot) throw new Error('Slot not found');

  try {
    await slotRepository.remove(foundSlot);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getSlot = async (
  datasourceId: number,
  slotId: number
): Promise<Slot> => {
  const foundUser = await userRepository.findOne({
    where: { datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');

  const foundSlot = await slotRepository.findOne({
    where: { id: slotId, datasource: { id: datasourceId } },
    relations: {
      woocommerceProduct: true,
    },
  });

  if (!foundSlot) throw new Error('Slot not found');

  return foundSlot;
};

export const getSlots = async (datasourceId: number): Promise<Slot[]> => {
  const foundUser = await userRepository.findOne({
    where: { datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');

  const foundSlot = await slotRepository.find({
    where: { datasource: { id: datasourceId } },
    relations: {
      woocommerceProduct: true,
    },
  });

  if (!foundSlot) throw new Error('Slot not found');

  return foundSlot;
};

async function getUserAndCheckDatasource(apiKey: string, datasourceId: number) {
  const foundUser = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: {
      datasource: true,
    },
  });

  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');

  return foundUser;
}

export const updateSlotJoystick = async ({
  payload,
  slotId,
}: {
  payload: JoystickBaseData;
  slotId: number;
  datasourceId: number;
}): Promise<any> => {
  try {
    delete payload.key;
    delete payload.save;
    const res = await slotRepository.update({ id: slotId }, payload);
    return res;
  } catch (err) {
    throw err;
  }
};

export const validateUserKey = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}): Promise<boolean> => {
  try {
    const foundUser = await userRepository.findOne({
      where: { apiKey, datasource: { id: datasourceId } },
      relations: {
        datasource: true,
      },
    });
    return !!foundUser;
  } catch (err) {
    throw err;
  }
};

export const addShippingCost = async ({
  apiKey,
  datasourceId,
  body,
}: {
  apiKey: string;
  datasourceId: number;
  body: DatasourceShippingCost;
}) => {
  const foundUser = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: {
      datasource: true,
    },
  });

  if (!foundUser) throw new Error('User not found');

  const shippingCostExists = await shippingCostRepository.findOne({
    where: { countryCode: body.code, datasource: { id: datasourceId } },
  });
  if (shippingCostExists)
    throw new Error(
      `Shipping cost already exists for countryCode : ${body.code}`
    );
  if (countries.find((c) => c.code === body.code) === undefined)
    throw new Error(`Invalid Country code ${body.code}`);

  const shippingCost = new ShippingCost();
  shippingCost.countryCode = body.code;
  shippingCost.price = body.price;
  shippingCost.datasource = foundUser.datasource[0];
  shippingCost.isActive = true;

  try {
    const savedShippingCost = await shippingCostRepository.save(shippingCost);
    return savedShippingCost;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateShippingCost = async ({
  apiKey,
  datasourceId,
  body,
  code,
}: {
  apiKey: string;
  datasourceId: number;
  code: string;
  body: DatasourceShippingCostUpdate;
}) => {
  const foundUser = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: {
      datasource: true,
    },
  });

  if (!foundUser) throw new Error('User not found');

  const shippingCost = await shippingCostRepository.findOne({
    where: { countryCode: code, datasource: { id: datasourceId } },
  });
  if (!shippingCost)
    throw new Error(`Shipping cost not found for countryCode : ${code}`);

  if (body.price !== undefined) shippingCost.price = body.price;
  shippingCost.isActive = !!body.isActive;
  try {
    const savedShippingCost = await shippingCostRepository.save(shippingCost);
    return savedShippingCost;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteShipping = async ({
  apiKey,
  datasourceId,
  code,
}: {
  apiKey: string;
  datasourceId: number;
  code: string;
}) => {
  const foundUser = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: {
      datasource: true,
    },
  });

  if (!foundUser) throw new Error('User not found');

  const shippingCost = await shippingCostRepository.findOne({
    where: { countryCode: code, datasource: { id: datasourceId } },
  });
  if (!shippingCost)
    throw new Error(`Shipping cost not found for countryCode : ${code}`);

  try {
    await shippingCostRepository.remove(shippingCost);
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const getShippingsByDatasourceId = async ({
  datasourceId,
}: {
  datasourceId: number;
}) => {
  const shippingCosts = await shippingCostRepository.find({
    where: { datasource: { id: datasourceId } },
  });

  const shippingCostsData = shippingCosts.map((sc) => {
    return {
      name: countries.find((c) => c.code === sc.countryCode)?.name,
      code: sc.countryCode,
      price: sc.price,
      isActive: sc.isActive,
    };
  });
  return shippingCostsData;
};
