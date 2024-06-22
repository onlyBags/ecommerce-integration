import { ValidateError } from 'tsoa';
import { AppDataSource, Billing, Customer } from '@dg-live/ecommerce-db';
import { BillingReq, OrderBilling } from '@dg-live/ecommerce-data-types';

const billingRepository = AppDataSource.getRepository(Billing);
const customerRepository = AppDataSource.getRepository(Customer);
export const saveBilling = async ({
  customer,
  billingData,
}: {
  customer: Customer;
  billingData: OrderBilling;
}) => {
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
  newBilling.customer = customer;
  try {
    const savedBilling = await billingRepository.save(newBilling);
    return savedBilling;
  } catch (error) {
    console.log('error', error);
    debugger;
    throw error;
  }
};

export const getBilling = async (wallet: string) => {
  try {
    const foundBilling = await billingRepository.find({
      relations: {
        customer: true,
      },
      where: {
        customer: {
          wallet,
        },
      },
    });
    return foundBilling;
  } catch (err) {
    throw err;
  }
};

export const mapBillingWCBilling = (billing: Billing | OrderBilling) => {
  const mappedBilling: BillingReq = {
    first_name: billing.firstName,
    last_name: billing.lastName,
    address_1: billing.address1,
    city: billing.city,
    state: billing.state,
    postcode: billing.postcode,
    country: billing.country,
    email: '',
    phone: '',
    address_2: '',
  };
  if (billing.email) mappedBilling.email = billing.email;
  else delete mappedBilling.email;
  if (billing.phone) mappedBilling.phone = billing.phone;
  else delete mappedBilling.phone;
  if (billing.address2) mappedBilling.address_2 = billing.address2;
  else delete mappedBilling.address_2;
  return mappedBilling;
};
