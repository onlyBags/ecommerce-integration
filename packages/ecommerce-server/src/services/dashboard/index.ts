import { AppDataSource, User, Datasource } from '@dg-live/ecommerce-db';
import { SaveUserDatasourceReq, SaveUserReq } from '../../interfaces/index';

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
  datasource.isActive = true;
  return await datasourceRepository.save(datasource);
};

export const getUserDatasources = async (id: string): Promise<Datasource[]> => {
  const foundUser = await userRepository.findOne({
    where: { id },
    relations: ['datasource'],
  });
  if (foundUser?.datasource) return foundUser.datasource;
  throw new Error('User not found');
};

export const getUserDatasource = async (id: string): Promise<Datasource> => {
  const foundUser = await userRepository.findOne({
    where: { id, datasource: { isActive: true } },
    relations: ['datasource'],
  });
  if (foundUser?.datasource) {
    foundUser.datasource.length ? foundUser.datasource[0] : [];
  }
  throw new Error('User not found');
};
