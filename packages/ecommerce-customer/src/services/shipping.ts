import { AppDataSource, Shipping, Customer } from '@dg-live/ecommerce-db';
import { OrderShipping } from '@dg-live/ecommerce-data-types';
import { ValidateError } from 'tsoa';

const shippingRepository = AppDataSource.getRepository(Shipping);

export const saveShipping = async ({
  customer,
  shippingData,
}: {
  customer: Customer;
  shippingData: OrderShipping;
}) => {
  try {
    const shippingAddressExists = await shippingRepository.findOne({
      where: {
        firstName:
          shippingData?.firstName?.toLowerCase() || 'only-bags-ecommerce',
        lastName:
          shippingData?.lastName?.toLowerCase() || 'only-bags-ecommerce',
        address1: shippingData.address1.toLowerCase(),
        address2: shippingData?.address2?.toLowerCase(),
        city: shippingData.city.toLowerCase(),
        state: shippingData.state.toLowerCase(),
        postcode: shippingData.postcode.toLowerCase(),
        country: shippingData.country.toLowerCase(),
        email: shippingData.email.toLowerCase(),
        customer: {
          id: customer.id,
        },
      },
      relations: {
        customer: true,
      },
    });
    if (shippingAddressExists) return shippingAddressExists;
    const newShipping = new Shipping();
    newShipping.firstName = shippingData.firstName?.toLowerCase();
    newShipping.lastName = shippingData.lastName?.toLowerCase();
    newShipping.address1 = shippingData.address1.toLowerCase();
    newShipping.address2 = shippingData.address2?.toLowerCase();
    newShipping.city = shippingData.city.toLowerCase();
    newShipping.state = shippingData.state.toLowerCase();
    newShipping.postcode = shippingData.postcode.toLowerCase();
    newShipping.country = shippingData.country.toLowerCase();
    newShipping.email = shippingData.email.toLowerCase();
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
    email: shipping.email,
  };
};
