import { AppDataSource, Shipping, Customer } from '@dg-live/ecommerce-db';
import { OrderShipping } from '@dg-live/ecommerce-data-types';

const shippingRepository = AppDataSource.getRepository(Shipping);

export const saveShipping = async ({
  customer,
  shippingData,
}: {
  customer: Customer;
  shippingData: OrderShipping;
}) => {
  const newShipping = new Shipping();
  newShipping.customer = customer;
  newShipping.firstName = shippingData.firstName;
  newShipping.lastName = shippingData.lastName;
  newShipping.address1 = shippingData.address1;
  newShipping.address2 = shippingData.address2;
  newShipping.city = shippingData.city;
  newShipping.state = shippingData.state;
  newShipping.postcode = shippingData.postcode;
  newShipping.country = shippingData.country;
  try {
    return await shippingRepository.save(newShipping);
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const getShippings = async (wallet: string) => {
  try {
    return await shippingRepository.find({
      where: { customer: { wallet } },
    });
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};
