import { AppDataSource, Billing, Customer } from '@dg-live/ecommerce-db';
import { BillingReq, OrderBilling } from '@dg-live/ecommerce-data-types';

const billingRepository = AppDataSource.getRepository(Billing);
export const saveBilling = async ({
  customer,
  billingData,
}: {
  customer: Customer;
  billingData: OrderBilling;
}) => {
  const billingAddressExists = await billingRepository.findOne({
    where: {
      firstName: billingData?.firstName?.toLowerCase() || 'only-bags-ecommerce',
      lastName: billingData?.lastName?.toLowerCase() || 'only-bags-ecommerce',
      address1: billingData.address1.toLowerCase(),
      address2: billingData?.address2?.toLowerCase() || 'only-bags-ecommerce',
      city: billingData.city.toLowerCase(),
      state: billingData.state.toLowerCase(),
      postcode: billingData.postcode.toLowerCase(),
      country: billingData.country.toLowerCase(),
      email: billingData.email.toLowerCase(),
      customer: {
        id: customer.id,
      },
    },
    relations: {
      customer: true,
    },
  });
  if (billingAddressExists) return billingAddressExists;
  const newBilling = new Billing();
  newBilling.firstName = billingData.firstName.toLowerCase();
  newBilling.lastName = billingData.lastName?.toLowerCase();
  newBilling.address1 = billingData.address1.toLowerCase();
  newBilling.address2 = billingData.address2?.toLowerCase();
  newBilling.city = billingData.city.toLowerCase();
  newBilling.state = billingData.state.toLowerCase();
  newBilling.postcode = billingData.postcode.toLowerCase();
  newBilling.country = billingData.country.toLowerCase();
  newBilling.email = billingData.email.toLowerCase();
  newBilling.phone = billingData.phone?.toLowerCase();
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
