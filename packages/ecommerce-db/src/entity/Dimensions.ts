import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity({
  name: 'wc_dimensions',
})
export class Dimensions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', default: '0' })
  length: string;

  @Column({ type: 'varchar', default: '0' })
  width: string;

  @Column({ type: 'varchar', default: '0' })
  height: string;

  @OneToOne(() => WoocommerceProduct)
  @JoinColumn()
  woocommerceProduct: Relation<WoocommerceProduct>;
}
