import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { MagentoProduct } from './index.js';

@Entity()
export class MagentoProductLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  linkType: string;

  @Column()
  linkedProductId: number;

  @Column()
  position: number;

  @ManyToOne(() => MagentoProduct, (product) => product.productLinks)
  @JoinColumn({ name: 'productId' })
  product: Relation<MagentoProduct>;
}
