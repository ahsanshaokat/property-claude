import { StorageFileResponseDto } from '../../storage-file/dto/storagefile.response.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class PropertyResponseDto {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  purpose: string;

  @ApiProperty()
  @Expose()
  descriptions: string;

  @ApiProperty()
  @Expose()
  address: string;

  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  noOfBedRoom: number;

  @ApiProperty()
  @Expose()
  noOfBathRoom: number;

  @ApiProperty()
  @Expose()
  propertySize: number;

  @ApiProperty()
  @Expose()
  yearBuild: number;

  @ApiProperty()
  @Expose()
  publishedDate: string;

  @ApiProperty()
  @Expose()
  totalFloors: number;

  @ApiProperty()
  @Expose()
  accommodations: string;

  @ApiProperty()
  @Expose()
  ceilingHeight: number;

  @ApiProperty()
  @Expose()
  distanceFromCenter: number;

  @ApiProperty()
  @Expose()
  parking: string;

  @ApiProperty()
  @Expose()
  heating: string;

  @ApiProperty()
  @Expose()
  areaSize: number;

  @ApiProperty()
  @Expose()
  garage: boolean;

  @ApiProperty()
  @Expose()
  garageSize: number;

  @ApiProperty()
  @Expose()
  additionalSpec: string;

  @ApiProperty()
  @Expose()
  utilityCost: number;

  @ApiProperty()
  @Expose()
  cableTvCost: number;

  @ApiProperty()
  @Expose()
  electricityCost: string;

  @ApiProperty()
  @Expose()
  lat: number;

  @ApiProperty()
  @Expose()
  long: number;

  @ApiProperty()
  @Expose()
  videoTourLink: string;

  //propertyType: PropertyType;

  // agent: Agent;

  //city: City;

  // @ManyToMany(() => Feature, (feature) => feature.property)
  // features: Feature[];

  // propertyFeatures: PropertyFeature[];

  //floorPlans: FloorPlan[];

  @ApiProperty({
    type: () => StorageFileResponseDto,
  })
  @Expose()
  propertyImages: StorageFileResponseDto[];

  // based on purpose(rent) the below data will be filled like for rent the below data will be filled

  @ApiProperty()
  @Expose()
  deposit: number;

  @ApiProperty()
  @Expose()
  petAllowed: boolean;

  @ApiProperty()
  @Expose()
  paymentPeriod: string;

  @ApiProperty()
  @Expose()
  habitable: string;

  @ApiProperty()
  @Expose()
  minimumStayDuration: number;
}
