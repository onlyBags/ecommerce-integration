import { User } from '@dg-live/ecommerce-db';
import { SaveUserReq } from 'src/interfaces/dashboard';
import { AppDataSource } from '@dg-live/ecommerce-db';
const userRepository = AppDataSource.getRepository(User);

export const saveUserKeys = async (userReq: SaveUserReq): Promise<User> => {
  const user = new User();
  user.username = userReq.username;
  user.platform = userReq.platform;
  user.clientKey = userReq.clientKey;
  user.clientSecret = userReq.clientSecret;
  return await userRepository.save(user);
};

export const getUserKeys = async (id: number): Promise<User> => {
  return await userRepository.findOneBy({ id });
};
