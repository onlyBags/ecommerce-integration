import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { MagentoProduct, MagentoCategoryLink } from './index.js';

@Entity()
export class MagentoExtensionAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('simple-array')
  websiteIds: number[];

  @OneToMany(() => MagentoCategoryLink, (categoryLink) => categoryLink.product)
  @JoinTable()
  categoryLinks: MagentoCategoryLink[];

  // Add other fields for extension attributes here
  // For example, if there are configurable product options, you can define them as follows:
  // @OneToMany(() => ConfigurableProductOption, configurableProductOption => configurableProductOption.extensionAttribute)
  // configurableProductOptions: ConfigurableProductOption[];

  @OneToMany(() => MagentoProduct, (product) => product.extensionAttributes)
  products: MagentoProduct[];
}

// If you have configurable product options, you would also define an entity for them
// @Entity()
// export class ConfigurableProductOption {
//   @PrimaryGeneratedColumn()
//   id: number;
//
//   // Define other fields specific to configurable product options
//
//   @ManyToOne(() => MagentoExtensionAttributes, extensionAttributes => extensionAttributes.configurableProductOptions)
//   extensionAttribute: MagentoExtensionAttributes;
// }

// Continue this pattern for other nested extension attributes as needed
