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
export class MagentoCategoryLink {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  position: number;

  @Column()
  categoryId: string;

  @ManyToOne(() => MagentoExtensionAttributes)
  extensionAttributes: Relation<MagentoExtensionAttributes>;
}
