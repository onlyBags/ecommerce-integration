import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Datasource } from './Datasource.js';
import { WoocommerceProduct } from './WoocommerceProduct.js';

@Entity({
  name: 'slot',
})
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Datasource, (datasource) => datasource.slot)
  datasource: Relation<Datasource>;

  @Column({ default: true })
  enabled: boolean;

  @ManyToOne(
    () => WoocommerceProduct,
    (woocommerceProduct) => woocommerceProduct.slot
  )
  woocommerceProduct: Relation<WoocommerceProduct>;

  @Column('decimal', { precision: 18, scale: 2 })
  posX: number;

  @Column('decimal', { precision: 18, scale: 2 })
  posY: number;

  @Column('decimal', { precision: 18, scale: 2 })
  posZ: number;

  @Column('decimal', { precision: 18, scale: 2 })
  sizeX: number;

  @Column('decimal', { precision: 18, scale: 2 })
  sizeY: number;

  @Column('decimal', { precision: 18, scale: 2 })
  sizeZ: number;

  @Column()
  rotX: number;

  @Column()
  rotY: number;

  @Column()
  rotZ: number;

  @Column({ nullable: true })
  image: string;
}
