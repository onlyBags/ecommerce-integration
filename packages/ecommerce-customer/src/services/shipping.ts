import { AppDataSource, Shipping, Customer } from '@dg-live/ecommerce-db';
import { OrderShipping } from '@dg-live/ecommerce-data-types';
import { ValidateError } from 'tsoa';

const shippingRepository = AppDataSource.getRepository(Shipping);
const customerRepository = AppDataSource.getRepository(Customer);

export const saveShipping = async ({
  customer,
  shippingData,
}: {
  customer: Customer;
  shippingData: OrderShipping;
}) => {
  try {
    const newShipping = new Shipping();
    newShipping.firstName = shippingData.firstName;
    newShipping.lastName = shippingData.lastName;
    newShipping.address1 = shippingData.address1;
    newShipping.address2 = shippingData.address2;
    newShipping.city = shippingData.city;
    newShipping.state = shippingData.state;
    newShipping.postcode = shippingData.postcode;
    newShipping.country = shippingData.country;
    newShipping.customer = customer;
    const savedShipping = await shippingRepository.save(newShipping);
    return savedShipping;
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const getShipping = async (wallet: string) => {
  try {
    const foundShipping = await shippingRepository.find({
      relations: {
        customer: true,
      },
      where: {
        customer: {
          wallet,
        },
      },
    });
    return foundShipping;
  } catch (err) {
    throw err;
  }
};

export const mapShippingWCShipping = (shipping: Shipping | OrderShipping) => {
  return {
    first_name: shipping.firstName,
    last_name: shipping.lastName,
    address_1: shipping.address1,
    address_2: shipping.address2,
    city: shipping.city,
    state: shipping.state,
    postcode: shipping.postcode,
    country: shipping.country,
  };
};
