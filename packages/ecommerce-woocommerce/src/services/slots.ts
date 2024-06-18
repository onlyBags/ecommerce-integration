import { AppDataSource, Slot } from '@dg-live/ecommerce-db';
const slotRepository = AppDataSource.getRepository(Slot);

export const getAllSlots = async ({
  datasourceId,
}: {
  datasourceId: number;
}): Promise<Slot[]> => {
  try {
    const foundSlots = await slotRepository.find({
      where: {
        datasource: {
          id: datasourceId,
        },
      },
      relations: {
        woocommerceProduct: {
          attributes: true,
          images: true,
          categories: true,
        },
      },
    });
    if (!foundSlots.length) return [];
    return foundSlots;
  } catch (err) {
    throw err;
  }
};
