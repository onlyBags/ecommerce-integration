import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity({
  name: 'wc_attribute',
})
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
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

  @ManyToMany(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.attributes
  )
  woocommerceProduct: WoocommerceProduct;
}
