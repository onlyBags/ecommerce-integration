import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Relation,
} from 'typeorm';
import { MagentoExtensionAttributes } from './index.js';

@Entity()
export class MagentoConfigurableProductOptions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  configurableProductId: number;

  @Column()
  attributeId: string;

  @Column()
  label: string;

  @Column()
  position: number;

  @Column('simple-array')
  values: number[];

  @Column()
  productId: number;

  @ManyToOne(() => MagentoExtensionAttributes)
  extensionAttributes: Relation<MagentoExtensionAttributes>;
}
