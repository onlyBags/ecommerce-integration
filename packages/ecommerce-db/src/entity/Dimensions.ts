import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity()
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
  woocommerceProduct: WoocommerceProduct;
}
