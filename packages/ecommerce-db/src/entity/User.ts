import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Unique,
  Relation,
} from 'typeorm';
import { Datasource } from './Datasource.js';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Unique(['UQ_USERNAME'])
  username: string;

  // @Column({ type: 'varchar', length: 42 })
  // wallet: string;

  @Column({ length: 1000 })
  apiKey: string;

  @OneToMany(() => Datasource, (datasource) => datasource.user)
  datasource: Relation<Datasource[]>;

  @Column()
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
