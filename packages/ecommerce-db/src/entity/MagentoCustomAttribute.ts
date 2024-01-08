import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MagentoProduct } from './index.js';

@Entity()
export class MagentoCustomAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attributeCode: string;

  @Column('simple-json')
  value: any;

  @ManyToOne(() => MagentoProduct, (product) => product.customAttributes)
  @JoinColumn({ name: 'productId' })
  product: MagentoProduct;
}
