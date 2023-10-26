import { Entity, PrimaryGeneratedColumn, OneToMany, Relation } from 'typeorm';
import { Self } from './Self.js';
import { Collection } from './Collection.js';

@Entity({
  name: 'wc_links',
})
export class Links {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany((type) => Self, (self) => self.id, {
    nullable: true,
  })
  self: Relation<Self[]>;

  @OneToMany((type) => Collection, (collection) => collection.id, {
    nullable: true,
  })
  collection: Relation<Collection[]>;
}
