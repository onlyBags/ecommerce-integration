import { Entity, PrimaryGeneratedColumn, Column, Index, Unique } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  @Index()
  dateCreated: string;

  @Column({ type: 'varchar' })
  dateCreatedGmt: string;

  @Column({ type: 'varchar' })
  dateModified: string;

  @Column({ type: 'varchar' })
  dateModifiedGmt: string;

  @Column({ type: 'varchar' })
  @Index()
  @Unique(['src'])
  src: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  alt: string;
}
