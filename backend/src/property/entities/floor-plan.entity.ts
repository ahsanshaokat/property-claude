import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Property } from './property.entity';
import { StorageFile } from '../../storage-file/entities/storage-file.entity';

@Entity('floor_plans')
export class FloorPlan extends BaseEntity {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, type: 'text' })
  description: string;

  @Column({ nullable: false })
  floorNo: number;

  @Column({ nullable: false, type: 'int' })
  noOfBathRoom: number;

  @Column({ nullable: false, type: 'int' })
  propertySize: number;

  @Column({ nullable: false, type: 'int' })
  noOfBedRoom: number;

  @ManyToOne(() => Property, (property) => property.floorPlans, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  property: Property;

  @OneToMany(() => StorageFile, (storageFile) => storageFile.floorPlan, {
    createForeignKeyConstraints: false,
  })
  floorPlanImages: StorageFile[];
}
