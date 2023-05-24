import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  imageId: number;

  @Column({ type: 'varchar', nullable: true })
  dateCreated: string;

  @Column({ type: 'varchar', nullable: true })
  dateCreatedGmt: string;

  @Column({ type: 'varchar', nullable: true })
  dateModified: string;

  @Column({ type: 'varchar', nullable: true })
  dateModifiedGmt: string;

  @Column({ type: 'varchar', nullable: true })
  @Unique('UQ_IMAGE_SRC', ['src'])
  src: string;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  alt: string;

  @ManyToOne(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.images
  )
  woocommerceProduct: WoocommerceProduct;
}
