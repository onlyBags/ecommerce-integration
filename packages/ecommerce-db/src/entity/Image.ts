import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  dateCreated: string;

  @Column({ type: 'varchar' })
  dateCreatedGmt: string;

  @Column({ type: 'varchar' })
  dateModified: string;

  @Column({ type: 'varchar' })
  dateModifiedGmt: string;

  @Column({ type: 'varchar' })
  @Unique(['src'])
  src: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  alt: string;
}
