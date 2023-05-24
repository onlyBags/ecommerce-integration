import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity()
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

  @ManyToOne(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.categories
  )
  woocommerceProduct: WoocommerceProduct;
}
