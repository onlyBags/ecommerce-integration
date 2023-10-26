import { AppDataSource, Billing, Customer } from '@dg-live/ecommerce-db';
import { OrderBilling } from '@dg-live/ecommerce-data-types';

const billingRepository = AppDataSource.getRepository(Billing);

export const saveBilling = async ({
  customer,
  billingData,
}: {
  customer: Customer;
  billingData: OrderBilling;
}) => {
  const newBilling = new Billing();
  newBilling.customer = customer;
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
    return await billingRepository.save(newBilling);
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const getBilling = async (wallet: string) => {
  try {
    return await billingRepository.find({
      where: { customer: { wallet } },
    });
  } catch (err) {
    console.log('err', err);
    throw err;
  }
};
