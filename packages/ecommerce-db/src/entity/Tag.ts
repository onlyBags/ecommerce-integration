import { Entity, Column, Index, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity()
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Index()
  @Unique(['name'])
  name: string;

  @Column({ type: 'varchar' })
  @Index()
  @Unique(['slug'])
  slug: string;
}
