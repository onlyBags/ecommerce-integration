import {
  AppDataSource,
  Customer,
  Order,
  OrderLog,
  User,
  WoocommerceProduct,
} from '@dg-live/ecommerce-db';
import { AxiosResponse } from 'axios';

import { analyticsCacheRepository } from '@dg-live/ecommerce-cache';
import { createNewWoocommerceInstance } from '@dg-live/ecommerce-woocommerce';
import { Between } from 'typeorm';
import { EntityId } from 'redis-om';
import WooCommerceRestApi from '@woocommerce/woocommerce-rest-api';

interface AnalyticsData {
  datasourceId: number;
  apiKey: string;
  startDate?: string;
  endDate?: string;
}

interface SaleItem {
  sku: string;
  productId: string;
  price: string;
  amount: number;
  wallet: string;
  date: Date;
}

const woocommerceRepository = AppDataSource.getRepository(WoocommerceProduct);
const orderRepository = AppDataSource.getRepository(Order);
const userRepository = AppDataSource.getRepository(User);
const customerRepository = AppDataSource.getRepository(Customer);
const orderLogRepository = AppDataSource.getRepository(OrderLog);

async function fetchAllWcOrders(
  wcInstance: any,
  storeOrderIds: number[],
  perPage = 50
) {
  let allWcOrders = [];
  let page = 1;
  let fetchMore = true;

  while (fetchMore) {
    const wcOrdersResponse: AxiosResponse = await wcInstance.get(`orders`, {
      include: storeOrderIds.join(','),
      per_page: perPage,
      page: page,
    });
    const wcOrders = wcOrdersResponse.data;

    allWcOrders = allWcOrders.concat(wcOrders);
    fetchMore = wcOrders.length === perPage;
    page++;
  }

  return allWcOrders;
}

export const getAnalyticsData = async (
  analyticsData: AnalyticsData
): Promise<any> => {
  const { datasourceId, apiKey, startDate, endDate } = analyticsData;
  if (!datasourceId) throw new Error('datasourceId is required');
  const cachedEntity = await analyticsCacheRepository
    .search()
    .where('datasourceId')
    .eq(datasourceId)
    .return.first();
  if (cachedEntity) {
    let totalSalesDetails = JSON.parse(
      cachedEntity.totalSalesDetails as string
    ) as SaleItem[];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      totalSalesDetails = totalSalesDetails.filter((item) => {
        const itemDate = new Date(item.date);
        return itemDate >= start && itemDate <= end;
      });
    }

    let totalSales = totalSalesDetails.reduce(
      (acc, item) => acc + parseFloat(item.price),
      0
    );
    let totalUnitSales = totalSalesDetails.reduce(
      (acc, item) => acc + item.amount,
      0
    );

    return {
      totalSales: totalSales.toString(),
      totalUnitSales: totalUnitSales.toString(),
      totalSalesDetails,
    };
  }
  const orderLogCondition =
    startDate && endDate
      ? { createdAt: Between(new Date(startDate), new Date(endDate)) }
      : {};
  const orders = await orderRepository.find({
    where: {
      datasource: { id: datasourceId },
      orderLog: orderLogCondition,
    },
    relations: {
      customer: true,
      orderLog: {
        user: true,
        customer: true,
      },
    },
  });

  let totalSales = 0;
  let totalUnitSales = 0;
  const totalSalesDetails: SaleItem[] = [];

  const storeOrderIds = orders.map((order) => order.storeOrderId);

  const wc = await createNewWoocommerceInstance({ apiKey, datasourceId });
  const wcOrders = await fetchAllWcOrders(wc, storeOrderIds);

  for (const wcOrder of wcOrders) {
    for (const item of wcOrder.line_items) {
      const order = orders.find((o) => o.storeOrderId === wcOrder.id);

      if (order) {
        totalSales += parseFloat(item.price);
        totalUnitSales += item.quantity;
        const custometId = order?.orderLog?.customer?.id ?? '0';
        let customer: Customer | undefined;

        customer = await customerRepository.findOne({
          where: { id: custometId },
        });

        totalSalesDetails.push({
          productId: item.product_id,
          sku: item.sku,
          price: item.price,
          amount: item.quantity,
          wallet: customer?.wallet || 'no customer found',
          date: order.orderLog.createdAt,
        });
      }
    }
  }
  if (!startDate && !endDate) {
    const cacheItem = {
      datasourceId,
      totalSales: totalSales.toString(),
      totalUnitSales: totalUnitSales.toString(),
      totalSalesDetails: JSON.stringify(totalSalesDetails),
    };
    const cachedEntity = await analyticsCacheRepository.save({
      ...cacheItem,
    });
    const ttlInSeconds = 60 * 5;
    await analyticsCacheRepository.expire(cachedEntity[EntityId], ttlInSeconds);
  }
  return {
    totalSales,
    totalUnitSales,
    totalSalesDetails,
  };
};
