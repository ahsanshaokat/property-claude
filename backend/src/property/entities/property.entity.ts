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
  @Column({ nullable: true })
  @Index('properties_unique_name', { unique: true })
  name: string;

  @Column({ nullable: true })
  slug: string;

  @Column({ nullable: true, length: 50 })
  purpose: string;

  @Column({ nullable: true, type: 'text' })
  descriptions: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @Column({ nullable: true, type: 'float' })
  price: number;

  @Column({ nullable: true, type: 'int' })
  noOfBedRoom: number;

  @Column({ nullable: true, type: 'int' })
  noOfBathRoom: number;

  @Column({ nullable: true, type: 'int' })
  propertySize: number;

  @Column({ nullable: true, type: 'int' })
  yearBuild: number;

  @Column({ nullable: true, type: 'date' })
  publishedDate: string;

  @Column({ nullable: true, type: 'int' })
  totalFloors: number;

  @Column({ nullable: true })
  accommodations: string;

  @Column({ nullable: true, type: 'float' })
  ceilingHeight: number;

  @Column({ nullable: true, type: 'float' })
  distanceFromCenter: number;

  @Column({ nullable: true })
  parking: string;

  @Column({ nullable: true })
  heating: string;

  @Column({ nullable: true, type: 'float' })
  areaSize: number;

  @Column({ nullable: true, type: 'boolean' })
  garage: boolean;

  @Column({ nullable: true, type: 'float' })
  garageSize: number;

  @Column({ nullable: true })
  additionalSpec: string;

  @Column({ nullable: true, type: 'int' })
  utilityCost: number;

  @Column({ nullable: true, type: 'int' })
  cableTvCost: number;

  @Column({ nullable: true })
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
