import { User, UserKey } from '@dg-live/ecommerce-db';
import { SaveUserKeysReq, SaveUserReq } from 'src/interfaces/dashboard';
import { AppDataSource } from '@dg-live/ecommerce-db';

const userRepository = AppDataSource.getRepository(User);
const userKeyRepository = AppDataSource.getRepository(UserKey);

export const saveUser = async (userReq: SaveUserReq): Promise<User> => {
  const user = new User();
  user.username = userReq.username;
  user.apiKey = userReq.apiKey;
  user.isActive = true;
  return await userRepository.save(user);
};

export const saveUserKeys = async (
  userReq: SaveUserKeysReq
): Promise<UserKey> => {
  const user = await userRepository.findOneBy({
    id: userReq.id,
    apiKey: userReq.apiKey,
    isActive: true,
  });

  if (!user) throw new Error('User not found');

  const userKey = new UserKey();
  userKey.user = user;
  userKey.platform = userReq.platform;
  userKey.consumerKey = userReq.consumerKey;
  userKey.consumerSecret = userReq.consumerSecret;
  userKey.baseUrl = userReq.baseUrl;
  userKey.isActive = true;
  return await userKeyRepository.save(userKey);
};

export const getUserKeys = async (id: string): Promise<User> => {
  const foundUser = await userRepository.findOne({
    where: { id },
    relations: ['keys'],
  });
  if (foundUser) return foundUser;
  throw new Error('User not found');
};
