import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity()
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
  woocommerceProduct: WoocommerceProduct;
}
