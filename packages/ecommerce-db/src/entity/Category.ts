import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Unique(['name'])
  name: string;

  @Column({ type: 'varchar' })
  @Unique(['slug'])
  slug: string;
}
