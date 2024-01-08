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
export class MagentoCategoryLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @Column()
  categoryId: string;

  @ManyToOne(() => MagentoProduct, (product) => product.categoryLinks)
  @JoinColumn({ name: 'productId' })
  product: Relation<MagentoProduct>;
}
