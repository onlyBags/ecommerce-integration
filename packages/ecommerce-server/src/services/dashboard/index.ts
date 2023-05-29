import { AppDataSource, User, Datasource } from '@dg-live/ecommerce-db';
import { SaveUserDatasourceReq, SaveUserReq } from '../../interfaces/index.js';
import { getPassword } from '../../util/index.js';

const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);

export const saveUser = async (userReq: SaveUserReq): Promise<User> => {
  const user = new User();
  user.username = userReq.username;
  user.apiKey = userReq.apiKey;
  user.isActive = true;
  return await userRepository.save(user);
};

export const saveUserDatasource = async (
  apiKey: string,
  userReq: SaveUserDatasourceReq
): Promise<Datasource> => {
  const user = await userRepository.findOneBy({
    apiKey: apiKey,
    isActive: true,
  });

  if (!user) throw new Error('User not found');

  const datasource = new Datasource();
  datasource.user = user;
  datasource.name = userReq.name;
  datasource.platform = userReq.platform;
  datasource.consumerKey = userReq.consumerKey;
  datasource.consumerSecret = userReq.consumerSecret;
  datasource.baseUrl = userReq.baseUrl;
  datasource.webhookSecret = getPassword();
  datasource.isActive = true;
  return await datasourceRepository.save(datasource);
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
