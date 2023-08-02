import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
} from 'typeorm';
import { Datasource } from './Datasource.js';

@Entity({
  name: 'slot',
})
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ManyToOne(() => Datasource, (datasource) => datasource.slot)
  datasource: Datasource;

  @Column({ default: true })
  enabled: boolean;

  @Column()
  productId: number;

  @Column()
  posX: number;

  @Column()
  posY: number;

  @Column()
  posZ: number;

  @Column()
  sizeX: number;

  @Column()
  sizeY: number;

  @Column()
  sizeZ: number;

  @Column()
  rotX: number;

  @Column()
  rotY: number;

  @Column()
  rotZ: number;
}