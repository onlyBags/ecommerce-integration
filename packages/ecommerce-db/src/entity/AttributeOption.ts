import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attribute } from './Attribute.js';

@Entity({
  name: 'wc_attribute_options',
})
export class AttributeOption {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-array', nullable: false })
  value: string[]; // You can store the value as a string

  @ManyToOne(() => Attribute, (attribute) => attribute.options)
  attribute: Attribute;
}
