import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Feature } from './feature.entity';
import { FloorPlan } from './floor-plan.entity';
import { Agent } from '../../agent/entities/agent.entity';
import { City } from '../../city/entities/city.entity';
import { BaseEntity } from '../../common/entity/base.entity';
import { PropertyType } from '../../property-type/entities/property-type.entity';
import { StorageFile } from '../../storage-file/entities/storage-file.entity';
import { PropertyFeature } from './property-feature.entity';
//import { PropertyFeature } from './property-feature.entity';

@Entity('properties')
export class Property extends BaseEntity {
  @Column({ nullable: false })
  @Index('properties_unique_name', { unique: true })
  name: string;

  @Column({ nullable: false })
  slug: string;

  @Column({ nullable: false, length: 50 })
  purpose: string;

  @Column({ nullable: false, type: 'text' })
  descriptions: string;

  @Column({ nullable: false, type: 'text' })
  address: string;

  @Column({ nullable: false, type: 'float' })
  price: number;

  @Column({ nullable: false, type: 'int' })
  noOfBedRoom: number;

  @Column({ nullable: false, type: 'int' })
  noOfBathRoom: number;

  @Column({ nullable: false, type: 'int' })
  propertySize: number;

  @Column({ nullable: false, type: 'int' })
  yearBuild: number;

  @Column({ nullable: true, type: 'date' })
  publishedDate: string;

  @Column({ nullable: false, type: 'int' })
  totalFloors: number;

  @Column({ nullable: false })
  accommodations: string;

  @Column({ nullable: false, type: 'float' })
  ceilingHeight: number;

  @Column({ nullable: false, type: 'float' })
  distanceFromCenter: number;

  @Column({ nullable: false })
  parking: string;

  @Column({ nullable: false })
  heating: string;

  @Column({ nullable: false, type: 'float' })
  areaSize: number;

  @Column({ nullable: false, type: 'boolean' })
  garage: boolean;

  @Column({ nullable: true, type: 'float' })
  garageSize: number;

  @Column({ nullable: true })
  additionalSpec: string;

  @Column({ nullable: false, type: 'int' })
  utilityCost: number;

  @Column({ nullable: false, type: 'int' })
  cableTvCost: number;

  @Column({ nullable: false })
  electricityCost: string;

  @Column({ nullable: true, type: 'float' })
  lat: number;

  @Column({ nullable: true, type: 'float' })
  long: number;

  @Column({ nullable: true })
  videoTourLink: string;

  @ManyToOne(() => PropertyType, (propertyType) => propertyType.properties, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  propertyType: PropertyType;

  @ManyToOne(() => Agent, (agent) => agent.properties, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  agent: Agent;

  @ManyToOne(() => City, (city) => city.properties, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  city: City;

  // @ManyToMany(() => Feature, (feature) => feature.property)
  // features: Feature[];

  @OneToMany(
    () => PropertyFeature,
    (propertyFeature) => propertyFeature.property,
    {
      createForeignKeyConstraints: false,
      cascade: true,
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
  )
  propertyFeatures: PropertyFeature[];

  //for property type === 'house' and purpose === 'sale' then floor plan value will be applied
  @OneToMany(() => FloorPlan, (floorPlan) => floorPlan.property, {
    createForeignKeyConstraints: false,
  })
  floorPlans: FloorPlan[];

  // by setting type [header and feature] we can get header and feature images of any property
  @OneToMany(() => StorageFile, (storageFile) => storageFile.property, {
    createForeignKeyConstraints: false,
    cascade: true,
  })
  propertyImages: StorageFile[];

  // based on purpose(rent) the below data will be filled like for rent the below data will be filled
  @Column({ nullable: true, type: 'float' })
  deposit: number;

  @Column({ nullable: true, type: 'boolean' })
  petAllowed: boolean;

  @Column({ nullable: true })
  paymentPeriod: string;

  @Column({ nullable: true })
  habitable: string;

  @Column({ nullable: true, type: 'int' })
  minimumStayDuration: number;
}
