import axios from 'axios';
import FormData from 'form-data';
import { AppDataSource, User } from '@dg-live/ecommerce-db';

const userRepository = AppDataSource.getRepository(User);

export const getProductVariation = async ({
  apiKey,
  datasourceId,
  productId,
  attributes,
  values,
}: {
  apiKey: string;
  datasourceId: number;
  productId: number;
  attributes: string[];
  values: string[];
}) => {
  try {
    const foundUserDatasource = await userRepository.findOne({
      where: { apiKey, datasource: { id: datasourceId } },
      relations: ['datasource'],
    });
    if (!foundUserDatasource) throw new Error("User's datasource not found");

    const { baseUrl, consumerKey, consumerSecret } =
      foundUserDatasource.datasource[0];
    debugger;
    const url = `${baseUrl}?wc-ajax=get_variation`;
    const form = new FormData();
    form.append('product_id', productId.toString());
    attributes.forEach((attribute, index) => {
      form.append(`attribute_${attribute}`, values[index]);
    });

    const res = await axios.post(url, form, {
      auth: {
        username: consumerKey,
        password: consumerSecret,
      },
    });
    console.log('res', res.data);
    debugger;
    return res.data;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};
