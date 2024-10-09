import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { PropertyType } from './entities/property-type.entity';

@Injectable()
export class PropertyTypeService {
  constructor(
    @InjectRepository(PropertyType)
    private readonly propertyTypeRepository: Repository<PropertyType>,
  ) {}

  async create(createPropertyTypeDto: CreatePropertyTypeDto) {
    try {
      const propertyType = Object.assign(
        new PropertyType(),
        createPropertyTypeDto,
      ) as PropertyType;
      return await this.propertyTypeRepository.save(propertyType);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return await this.propertyTypeRepository.find({
      select: {
        id: true,
        name: true,
        properties: {
          id: true,
          name: true,
          noOfBathRoom: true,
          propertyImages: {
            id: true,
            fileName: true,
          },
          propertyFeatures: {
            feature: {
              name: true,
            },
          },
          floorPlans: {
            name: true,
            noOfBathRoom: true,
            noOfBedRoom: true,
          },
        },
      },
      relations: [
        'properties',
        'properties.propertyImages',
        'properties.propertyFeatures.feature',
        'properties.floorPlans.floorPlanImages',
      ],
    });
  }

  async findPropertyCount() {
    return await this.propertyTypeRepository
      .createQueryBuilder('propertyType')
      .select([
        'propertyType.id',
        'propertyType.name',
        'propertyType.alias',
        'propertyType.imageUrl',
      ])
      .loadRelationCountAndMap(
        'propertyType.propertyCount',
        'propertyType.properties',
      )
      .getMany();
  }

  findOne(id: number) {
    return `This action returns a #${id} propertyType`;
  }

  update(id: number, updatePropertyTypeDto: UpdatePropertyTypeDto) {
    return `This action updates a #${id} propertyType`;
  }

  remove(id: number) {
    return `This action removes a #${id} propertyType`;
  }

  async insertAll() {
    const propertyTypes = [
      { name: 'Townhouses', alias: 'townhouses' },
      { name: 'Houses', alias: 'houses' },
      { name: 'Garages', alias: 'garages' },
      { name: 'Duplex', alias: 'duplex' },
      { name: 'Apartments', alias: 'apartments' },
    ];

    const propertyTypeCount = await this.propertyTypeRepository.count({});

    if (!propertyTypeCount) {
      Logger.log('Running property type seeder');
      await this.propertyTypeRepository.insert(propertyTypes);
    }

    return await this.propertyTypeRepository.find({});
  }
}
