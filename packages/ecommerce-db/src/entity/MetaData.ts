import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinTable,
  ManyToMany,
  Relation,
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

  @ManyToOne(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.metaData
  )
  woocommerceProduct: Relation<WoocommerceProduct>;
}
