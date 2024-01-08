import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MagentoProduct } from './index.js';

@Entity()
export class MagentoMediaGalleryEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  mediaId: number;

  @Column()
  mediaType: string;

  @Column({ nullable: true })
  label: string;

  @Column()
  position: number;

  @Column()
  disabled: boolean;

  @Column('simple-array')
  types: string[];

  @Column()
  file: string;

  @ManyToOne(() => MagentoProduct, (product) => product.mediaGalleryEntries)
  @JoinColumn({ name: 'productId' })
  product: MagentoProduct;
}
