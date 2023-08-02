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
} from '../../interfaces/index.js';
import { getPassword } from '../../util/index.js';

const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);
const slotRepository = AppDataSource.getRepository(Slot);
const woocommerceProduct = AppDataSource.getRepository(WoocommerceProduct);

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
    apiKey: apiKey,
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
    return await datasourceRepository.save(datasource);
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
  slotReq: NewSlotReq
): Promise<Slot> => {
  const {
    name,
    datasourceId,
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
    productId,
  } = slotReq;

  const foundUser = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUser) throw new Error('User not found');
  if (!foundUser.datasource.length) throw new Error('Datasource not found');

  const datasource = foundUser.datasource[0];
  let foundProductId: number;

  if (datasource.platform === 'woocommerce') {
    const foundProduct = await woocommerceProduct.findOne({
      where: { productId: productId, datasourceId },
    });
    if (foundProduct && foundProduct.id) foundProductId = foundProduct.id;
  } else if (datasource.platform === 'magento') {
    throw new Error('Magento platform not supported yet');
  }
  if (!foundProductId)
    throw new Error(
      `Product ${productId} not found in datasource ${datasourceId} and platform ${datasource.platform}`
    );
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
  slot.productId = foundProductId;

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
