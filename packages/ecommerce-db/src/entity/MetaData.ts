import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity({
  name: 'wc_meta_data',
})
export class MetaData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  metaDataId: number;

  @Column({ type: 'varchar', nullable: true })
  key: string;

  @Column({ type: 'text', nullable: true })
  value: string;

  @ManyToMany(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.metaData
  )
  woocommerceProduct: WoocommerceProduct;
}
