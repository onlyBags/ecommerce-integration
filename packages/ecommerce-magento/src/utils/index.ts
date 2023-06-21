import { AppDataSource, User } from '@dg-live/ecommerce-db';
import oAuth from 'oauth-1.0a';
import { createHmac } from 'crypto';
import axios from 'axios';

const userRepository = AppDataSource.getRepository(User);

export const createMagentoOauthInstance = async ({
  apiKey,
  datasourceId,
}: {
  apiKey: string;
  datasourceId: number;
}): Promise<any> => {
  const foundUserDatasource = await userRepository.findOne({
    where: { apiKey, datasource: { id: datasourceId } },
    relations: ['datasource'],
  });
  if (!foundUserDatasource) throw new Error("User's datasource not found");
  const {
    baseUrl,
    consumerKey,
    consumerSecret,
    accessToken,
    accessTokenSecret,
  } = foundUserDatasource.datasource[0];

  const simpleTryData = {
    url: `${baseUrl}/rest/V1/products?searchCriteria[pageSize]=100`,
    method: 'GET',
  };
  const simpleTryAccess = new oAuth({
    consumer: {
      key: consumerKey,
      secret: consumerSecret,
    },
    signature_method: 'HMAC-SHA256',
    hash_function(base_string, key) {
      return createHmac('sha256', key)
        .update(base_string)
        .digest('base64')
        .toString();
    },
  });

  const token = {
    key: accessToken,
    secret: accessTokenSecret,
  };
  const simpleTryAuthHeader = simpleTryAccess.toHeader(
    simpleTryAccess.authorize(simpleTryData, token)
  );
  try {
    const res = await axios.get(simpleTryData.url, {
      headers: {
        ...simpleTryAuthHeader,
      },
    });
    if (res.data) return res.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
// 0o2fy5fznnlijdr4ii1zx9mvrmva2y85
// 9qu2jdrp4w2ctgvpcg35j6oidd0oza9c
// 58pmkyu7ebkiof1uznufhx0awnoxogzr
// kzeejctuncpsy2g46ehzdj6bb9w5gsvp
