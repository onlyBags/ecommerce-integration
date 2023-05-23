import { Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Self } from './Self.js';
import { Collection } from './Collection.js';

@Entity()
export class Links {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Self, (self) => self.id)
  self: Self[];

  @OneToMany((type) => Collection, (collection) => collection.id)
  collection: Collection[];
}
