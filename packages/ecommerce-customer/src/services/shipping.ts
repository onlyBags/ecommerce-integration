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
    const foundCustomer = await customerRepository.findOne({
      where: { id: customer.id },
    });
    if (!foundCustomer) throw new ValidateError({}, 'Invalid customer');
    const newShipping = new Shipping();
    newShipping.firstName = shippingData.firstName;
    newShipping.lastName = shippingData.lastName;
    newShipping.address1 = shippingData.address1;
    newShipping.address2 = shippingData.address2;
    newShipping.city = shippingData.city;
    newShipping.state = shippingData.state;
    newShipping.postcode = shippingData.postcode;
    newShipping.country = shippingData.country;
    const savedShipping = await shippingRepository.save(newShipping);
    foundCustomer.shipping = [savedShipping];
    await customerRepository.save(foundCustomer);
    return savedShipping;
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const getShippings = async (wallet: string) => {
  try {
    const foundCustomer = await customerRepository.findOne({
      where: { wallet },
      relations: {
        shipping: true,
      },
    });
    if (!foundCustomer) throw new ValidateError({}, 'Invalid customer');
    return foundCustomer.shipping;
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};
