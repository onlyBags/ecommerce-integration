import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Relation,
  ManyToOne,
} from 'typeorm';
import { Datasource } from './Datasource.js';

@Entity()
export class ShippingCost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  countryCode: string;

  @ManyToOne(() => Datasource, (datasource) => datasource.user)
  datasource: Relation<Datasource>;

  @Column('decimal', { precision: 18, scale: 2 })
  price: number;

  @Column()
  isActive: boolean;
}
