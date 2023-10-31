import { ValidateError } from 'tsoa';
import { AppDataSource, Billing, Customer } from '@dg-live/ecommerce-db';
import { OrderBilling, OrderShipping } from '@dg-live/ecommerce-data-types';

const billingRepository = AppDataSource.getRepository(Billing);
const customerRepository = AppDataSource.getRepository(Customer);
export const saveBilling = async ({
  customer,
  billingData,
}: {
  customer: Customer;
  billingData: OrderBilling;
}) => {
  const foundCustomer = await customerRepository.findOne({
    where: { id: customer.id },
  });
  if (!foundCustomer) throw new ValidateError({}, 'Invalid customer');
  const newBilling = new Billing();
  newBilling.firstName = billingData.firstName;
  newBilling.lastName = billingData.lastName;
  newBilling.address1 = billingData.address1;
  newBilling.address2 = billingData.address2;
  newBilling.city = billingData.city;
  newBilling.state = billingData.state;
  newBilling.postcode = billingData.postcode;
  newBilling.country = billingData.country;
  newBilling.email = billingData.email;
  newBilling.phone = billingData.phone;
  try {
    const savedBilling = await billingRepository.save(newBilling);
    foundCustomer.billing = [savedBilling];
    await customerRepository.save(foundCustomer);
    return savedBilling;
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const getBilling = async (wallet: string) => {
  try {
    const foundCustomer = await customerRepository.findOne({
      where: { wallet },
      relations: {
        billing: true,
      },
    });
    if (!foundCustomer) throw new ValidateError({}, 'Invalid customer');
    return foundCustomer.billing;
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};
