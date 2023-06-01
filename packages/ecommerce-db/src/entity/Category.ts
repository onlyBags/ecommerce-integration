import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity({
  name: 'wc_category',
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique('UQ_CATEGORY_ID', ['categoryId'])
  @Column()
  categoryId: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;

  @ManyToMany(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.categories
  )
  woocommerceProduct: WoocommerceProduct;
}
