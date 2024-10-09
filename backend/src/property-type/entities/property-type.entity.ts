import { BaseEntity } from '../../common/entity/base.entity';
import { Property } from '../../property/entities/property.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('property_types')
export class PropertyType extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  alias: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Property, (property) => property.propertyType, {
    createForeignKeyConstraints: false,
  })
  properties: Property[];
}
