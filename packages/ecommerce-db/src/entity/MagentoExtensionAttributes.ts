import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
  Relation,
  OneToOne,
} from 'typeorm';
import {
  MagentoProduct,
  MagentoCategoryLink,
  MagentoConfigurableProductOptions,
} from './index.js';

@Entity()
export class MagentoExtensionAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  websiteIds: number[];

  @Column('simple-array', { nullable: true })
  configurableProductLinks: number[];

  // @OneToMany(
  //   () => MagentoCategoryLink,
  //   (categoryLink) => categoryLink.extensionAttributes
  // )
  // categoryLinks: Relation<MagentoCategoryLink[]>;

  // @OneToMany(
  //   () => MagentoConfigurableProductOptions,
  //   (options) => options.extensionAttributes
  // )
  // configurableProductOptions: Relation<MagentoConfigurableProductOptions[]>;
}
