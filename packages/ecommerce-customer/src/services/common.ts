import { BagPriceResponse } from '@dg-live/ecommerce-data-types';
import { AppDataSource, Customer } from '@dg-live/ecommerce-db';
import axios from 'axios';

export const getBagPrice = async (): Promise<BagPriceResponse> => {
  try {
    const res = await axios.get<BagPriceResponse>(
      'https://api.dglive.org/v1/stripe/ice-price'
    );
    return res.data;
  } catch (error) {
    console.error('An error occurred:', error);
    throw new Error('Failed to fetch ICE price');
  }
};

const customerRepository = AppDataSource.getRepository(Customer);

export const getCustomer = async (wallet: string, email?: string) => {
  const foundCustomer = await customerRepository.findOne({
    where: {
      wallet,
    },
  });
  if (foundCustomer) return foundCustomer;
  const newCustomer = new Customer();
  newCustomer.wallet = wallet;
  newCustomer.email = email || 'no@mail.com';

  return await customerRepository.save(newCustomer);
};
