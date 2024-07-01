import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  Relation,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity({
  name: 'wc_category',
})
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

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
  woocommerceProduct: Relation<WoocommerceProduct>;
}
