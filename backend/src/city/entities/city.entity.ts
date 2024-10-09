import { BaseEntity } from '../../common/entity/base.entity';
import { Property } from '../../property/entities/property.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity('cities')
export class City extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  alias: string;

  @OneToMany(() => Property, (property) => property.city, {
    createForeignKeyConstraints: false,
  })
  properties: Property[];
}
