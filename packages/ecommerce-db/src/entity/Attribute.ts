import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  attributeId: number;

  @Column({ type: 'varchar' })
  @Unique('UQ_ATTRIBUTE_NAME', ['name'])
  name: string;

  @Column({ type: 'int', nullable: true })
  position: number;

  @Column({ type: 'boolean', nullable: true })
  visible: boolean;

  @Column({ type: 'boolean', nullable: true })
  variation: boolean;

  @Column({ type: 'varchar', nullable: true })
  options: string;

  @ManyToOne(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.attributes
  )
  woocommerceProduct: WoocommerceProduct;
}
