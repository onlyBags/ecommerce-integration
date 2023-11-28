import {
  AppDataSource,
  User,
  Datasource,
  Slot,
  WoocommerceProduct,
} from '@dg-live/ecommerce-db';
import {
  NewSlotReq,
  SaveUserDatasourceReq,
  SaveUserReq,
  UpdateSlotReq,
} from '@dg-live/ecommerce-data-types';

import { getPassword } from '../../util/index.js';
import { getSettings } from '@dg-live/ecommerce-woocommerce';
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
const woocommerceProduct = AppDataSource.getRepository(WoocommerceProduct);

export const saveClient = async (clientReq: SaveUserReq): Promise<User> => {
  const user = new User();
  user.username = clientReq.username;
  user.apiKey = clientReq.apiKey;
  user.isActive = true;
  user.wallet = clientReq.wallet;
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
  datasource.baseUrl = clientReq.baseUrl;
  datasource.webhookSecret = getPassword();
  datasource.isActive = true;
  try {
    const savedDatasource = await datasourceRepository.save(datasource);
    const storeSettings = await getSettings({
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
    return savedDatasource;
  } catch (err) {
    console.log(err);
    throw err;
  }
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

  const foundSlot = await slotRepository.findOne({
    where: { id: slotId, datasource: { id: datasourceId } },
    relations: {
      woocommerceProduct: true,
    },
  });
  // const foundSlot = await slotRepository.preload({ id: slotId, ...slotReq },);

  if (!foundSlot) throw new Error('Slot not found');

  if (!!slotReq.productId) {
    const productId = slotReq.productId;
    delete slotReq.productId;
    const datasource = foundUser.datasource[0];
    let foundProduct: WoocommerceProduct;

    if (datasource.platform === 'woocommerce') {
      foundProduct = await woocommerceProduct.findOne({
        where: { productId: productId, datasourceId },
      });
    } else if (datasource.platform === 'magento') {
      throw new Error('Magento platform not supported yet');
    }
    if (!foundProduct)
      throw new Error(
        `Product ${productId} not found in datasource ${datasourceId} and platform ${datasource.platform}`
      );
    foundSlot.woocommerceProduct = foundProduct;
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
        woocommerceProduct: true,
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
    relations: ['datasource'],
  });

  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');

  return foundUser;
}
