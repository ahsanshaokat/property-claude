import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entity/base.entity';
import { Property } from './property.entity';
import { Feature } from './feature.entity';

@Entity('property_features')
export class PropertyFeature extends BaseEntity {
  @Column()
  propertyId!: number;

  @Column()
  featureId!: number;

  @ManyToOne(() => Property, (property) => property.propertyFeatures, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  property: Property;

  @ManyToOne(() => Feature, (feature) => feature.propertyFeatures, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn()
  feature: Feature;
}

// for await (const featureId of features) {
//     // feature.property = [savedProperty];
//     const propertyFeatureInit = this.propertyFeatureRepository.create({
//       featureId: featureId,
//     });
//     const savedPropertyFeature = await this.propertyFeatureRepository.save(
//       propertyFeatureInit,
//     );
//     savedProperty.propertyFeatures = [savedPropertyFeature];
//     await this.propertyRepository.save(savedProperty);
//   }
