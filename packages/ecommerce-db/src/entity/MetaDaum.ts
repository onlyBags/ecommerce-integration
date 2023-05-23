import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity()
export class MetaDaum {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Index()
  @Unique(['key'])
  key: string;

  @Column({ type: 'text' })
  value: string;
}
