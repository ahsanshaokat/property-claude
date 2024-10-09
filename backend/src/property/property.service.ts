import { StorageFileService } from '../storage-file/storage-file.service';
import { UserService } from '../user/user.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CreatePropertyDto } from './dto/create-property.dto';
import {
  Filters,
  PropertyOrder,
  QueryFilterPropertyDto,
} from './dto/query-filter.property';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PropertyFeature } from './entities/property-feature.entity';
import { Property } from './entities/property.entity';
import { PropertyPurpose } from './enum/property.enum';
import { FloorPlanService } from './floor-plan/floor-plan.service';
import { ExpressRequestUser } from '../common/type/ExpressRequestUser';
@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private readonly propertyRepository: Repository<Property>,
    @InjectRepository(PropertyFeature)
    private readonly propertyFeatureRepository: Repository<PropertyFeature>,
    private readonly storageFileService: StorageFileService,
    private readonly floorPlanService: FloorPlanService,
    private readonly userService: UserService,
  ) {}

  async create(createPropertyDto: CreatePropertyDto, user: ExpressRequestUser) {
    try {
      const {
        features,
        propertyImages = [],
        floorPlans = [],
        rentCriteria,
        ...allFields
      } = createPropertyDto;

      let property = Object.assign(new Property(), allFields) as Property;
      property.slug = property.name.toLocaleLowerCase().split(' ').join('-');

      const checkExists = await this.findBySlug(property.slug);
      if (checkExists.success) {
        throw new BadRequestException('Property already exists !');
      }

      propertyImages.length > 0 &&
        (property.propertyImages = await this.storageFileService.findByIds(
          propertyImages,
        ));

      property.purpose === PropertyPurpose.RENT &&
        (property = Object.assign(property, { ...rentCriteria }));

      if (floorPlans.length > 0) {
        const floorPlanToSave = [];
        for await (const plan of floorPlans) {
          const newFloorPlan = await this.floorPlanService.create(plan);
          floorPlanToSave.push(newFloorPlan);
        }
        property.floorPlans = floorPlanToSave;
      }

      const agentUser = await this.userService.findOne(user.id, 'agent');

      if (!agentUser.agent) {
        throw new BadRequestException('Please add agent information first');
      }

      property.agent = agentUser.agent;
      const savedProperty = await this.propertyRepository.save(property);

      features.length > 0 &&
        (await this.setPropertyFeature(features, savedProperty));

      return await this.findBySlug(savedProperty.slug);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: QueryFilterPropertyDto) {
    try {
      const { page = 1, perPage = 10, order = {}, filters = {} } = query;
      const queryFilters = await this.customFilter(filters);
      console.log('filters', queryFilters);

      const [results, total] = await this.propertyRepository.findAndCount({
        relations: [
          'propertyType',
          'city',
          'propertyImages',
          'propertyFeatures.feature',
          'floorPlans',
        ],
        where: {
          ...queryFilters,
        },
        take: Number(perPage),
        skip: (Number(page) - 1) * Number(perPage),
        order: order,
      });

      return {
        success: true,
        data: results,
        meta: {
          all_total: total,
          total: results.length,
          per_page: Number(perPage),
          page: Number(page),
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(
    id: number,
    relations: string[] = [
      'propertyType',
      'city',
      'propertyImages',
      'propertyFeatures.feature',
      'floorPlans',
    ],
  ) {
    return await this.propertyRepository.findOne({
      relations: relations,
      where: { id: id },
    });
  }

  async findOneWithRelation(
    id: number,
    relations: string[] = [
      'propertyType',
      'city',
      'propertyImages',
      'propertyFeatures.feature',
      'floorPlans',
    ],
  ) {
    try {
      const property = await this.propertyRepository.findOne({
        relations: relations,
        where: { id: id },
      });

      if (!property) {
        return {
          success: false,
          data: null,
        };
      }

      return {
        success: true,
        data: property,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async findBySlug(slug: string) {
    try {
      const property = await this.propertyRepository.findOne({
        relations: [
          'propertyType',
          'city',
          'propertyImages',
          'propertyFeatures.feature',
          'floorPlans',
          'agent.user',
          'agent.agentImage',
        ],
        where: {
          slug: slug,
        },
      });

      if (!property) {
        return {
          success: false,
          data: null,
        };
      }

      return {
        success: true,
        data: property,
      };
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async update(id: number, updatePropertyDto: UpdatePropertyDto) {
    try {
      const result = await this.findOneWithRelation(id, [
        'propertyType',
        'city',
        'propertyImages',
        'propertyFeatures.feature',
        'floorPlans',
        'agent.user',
        'agent.agentImage',
      ]);
      if (!result.success) {
        throw new NotFoundException('Property not found !');
      }

      let property = result.data;

      const {
        features,
        itemToBeDeleted = [],
        propertyImages = [],
        floorPlans = [],
        rentCriteria,
        ...allFields
      } = updatePropertyDto;

      property = Object.assign(property, {
        ...allFields,
      });

      // need to send all image id with existing one and new one
      // need to delete previous one if not found with the update dto
      if (propertyImages.length > 0) {
        property.propertyImages = [
          ...property.propertyImages,
          ...(await this.storageFileService.findByIds(propertyImages)),
        ];
      }

      if (floorPlans.length > 0) {
        const floorPlanToSave = [];
        for await (const plan of floorPlans) {
          const newFloorPlan = await this.floorPlanService.create(plan);
          floorPlanToSave.push(newFloorPlan);
        }
        property.floorPlans = floorPlanToSave;
      }

      if (property.purpose === PropertyPurpose.RENT) {
        property = Object.assign(property, { ...rentCriteria });
      }

      const updatedProperty = await this.propertyRepository.save(property);

      if (features.length > 0) {
        await this.setPropertyFeature(features, updatedProperty);
      }

      if (itemToBeDeleted.length > 0) {
        await this.removePropertyFeature(itemToBeDeleted, updatedProperty);
      }

      return await this.findBySlug(updatedProperty.slug);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }

  async setPropertyFeature(features: number[], savedProperty: Property) {
    try {
      for await (const featureId of features) {
        const propertyFeatureInit = this.propertyFeatureRepository.create({
          featureId: featureId,
          propertyId: savedProperty.id,
        });
        await this.propertyFeatureRepository.save(propertyFeatureInit);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async removePropertyFeature(features: number[], savedProperty: Property) {
    try {
      for await (const featureId of features) {
        const propertyFeatureInit =
          await this.propertyFeatureRepository.findOne({
            where: {
              featureId: featureId,
              propertyId: savedProperty.id,
            },
          });
        await this.propertyFeatureRepository.delete(propertyFeatureInit.id);
      }
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  removeFalsy(filters: Filters) {
    return Object.entries(filters).reduce(
      (a, [k, v]) => (v ? ((a[k] = v), a) : a),
      {} as Filters,
    );
  }

  async customFilter(
    filters: Filters,
  ): Promise<FindOptionsWhere<Property>[] | FindOptionsWhere<Property>> {
    filters?.propertyType?.toLocaleLowerCase() === 'properties'
      ? (filters.propertyType = '')
      : filters.propertyType;

    const removeFalsy = this.removeFalsy(filters);

    let newFilters: FindOptionsWhere<Property>[] | FindOptionsWhere<Property> =
      {};

    if (Object.keys(removeFalsy).length > 0) {
      removeFalsy.purpose &&
        (newFilters = {
          ...newFilters,
          purpose: String(removeFalsy.purpose).toUpperCase(),
        });

      removeFalsy.noOfBedRoom &&
        (newFilters = {
          ...newFilters,
          noOfBedRoom: MoreThanOrEqual(removeFalsy.noOfBedRoom),
        });

      removeFalsy.price &&
        (newFilters = {
          ...newFilters,
          price: LessThanOrEqual(removeFalsy.price),
        });

      removeFalsy.propertyType &&
        (newFilters = {
          ...newFilters,
          propertyType: {
            alias: removeFalsy.propertyType,
          },
        });

      removeFalsy.cityId &&
        (newFilters = {
          ...newFilters,
          city: {
            id: Number(removeFalsy.cityId),
          },
        });

      if (removeFalsy.userId) {
        try {
          const agentUser = await this.userService.findOne(
            Number(removeFalsy.userId),
            'agent',
          );
          newFilters = {
            ...newFilters,
            agent: {
              id: Number(agentUser?.agent?.id),
            },
          };
        } catch (error) {
          newFilters = {
            ...newFilters,
          };
        }
      }
      removeFalsy.propertyFeatures &&
        (newFilters = {
          ...newFilters,
          propertyFeatures: {
            featureId: In([
              ...removeFalsy.propertyFeatures?.split(',').map(Number),
            ]),
          },
        });
    }

    return newFilters;
  }

  // diffArray(existing: number[], incoming: number[]) {
  //   const diff = (a: number[], b: number[]) => {
  //     return a.filter((item) => b.indexOf(item) === -1);
  //   };
  //   return [...diff(existing, incoming), ...diff(incoming, existing)];
  // }
}
