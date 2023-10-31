import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToMany,
  OneToMany,
  Relation,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';
import { AttributeOption } from './AttributeOption.js';

@Entity({
  name: 'wc_attribute',
})
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeId: number;

  @Column({ type: 'varchar' })
  // @Unique('UQ_ATTRIBUTE_NAME', ['name'])
  name: string;

  @Column({ type: 'int', nullable: true })
  position: number;

  @Column({ type: 'boolean', nullable: true })
  visible: boolean;

  @Column({ type: 'boolean', nullable: true })
  variation: boolean;

  @OneToMany(() => AttributeOption, (option) => option.attribute)
  options: AttributeOption[];

  @ManyToMany(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.attributes
  )
  woocommerceProduct: Relation<WoocommerceProduct>;
}
