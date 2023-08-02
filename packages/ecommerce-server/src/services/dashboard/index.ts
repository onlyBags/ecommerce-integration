import { AppDataSource, User, Datasource } from '@dg-live/ecommerce-db';
import { SaveUserDatasourceReq, SaveUserReq } from '../../interfaces/index.js';
import { getPassword } from '../../util/index.js';

const userRepository = AppDataSource.getRepository(User);
const datasourceRepository = AppDataSource.getRepository(Datasource);

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
