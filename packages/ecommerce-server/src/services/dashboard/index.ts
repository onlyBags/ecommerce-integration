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

export const saveUserKeys = async (
  apiKey: string,
  userReq: SaveUserDatasourceReq
): Promise<Datasource> => {
  const user = await userRepository.findOneBy({
    id: userReq.id,
    apiKey: apiKey,
    isActive: true,
  });

  if (!user) throw new Error('User not found');

  const datasource = new Datasource();
  datasource.user = user;
  datasource.platform = userReq.platform;
  datasource.consumerKey = userReq.consumerKey;
  datasource.consumerSecret = userReq.consumerSecret;
  datasource.baseUrl = userReq.baseUrl;
  datasource.isActive = true;
  return await datasourceRepository.save(datasource);
};

export const getUserDatasources = async (id: string): Promise<User> => {
  const foundUser = await userRepository.findOne({
    where: { id },
    relations: ['keys'],
  });
  if (foundUser) return foundUser;
  throw new Error('User not found');
};
