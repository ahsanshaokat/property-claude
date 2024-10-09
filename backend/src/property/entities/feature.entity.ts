import { Column, Entity, JoinTable, ManyToMany, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Property } from './property.entity';
import { PropertyFeature } from './property-feature.entity';
//import { PropertyFeature } from './property-feature.entity';

@Entity('features')
export class Feature extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  alias: string;

  @OneToMany(
    () => PropertyFeature,
    (propertyFeature) => propertyFeature.feature,
    {
      createForeignKeyConstraints: false,
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  propertyFeatures!: PropertyFeature[];

  // @ManyToMany(() => Property, (property) => property.features)
  // @JoinTable()
  // property: Property[];
}
