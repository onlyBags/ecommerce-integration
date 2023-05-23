import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Index()
  @Unique(['name'])
  name: string;

  @Column({ type: 'int' })
  position: number;

  @Column({ type: 'boolean' })
  visible: boolean;

  @Column({ type: 'boolean' })
  variation: boolean;

  @Column('text', { array: true })
  options: string[];
}
