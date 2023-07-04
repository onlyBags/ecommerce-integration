import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Unique,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity({
  name: 'wc_tag',
})
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique('UQ_TAG_ID', ['tagId'])
  @Column()
  tagId: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  slug: string;

  @ManyToOne(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.tags
  )
  woocommerceProduct: WoocommerceProduct;
}
