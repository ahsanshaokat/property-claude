import {
  BadRequestException,
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFeatureDto } from '../dto/feature/create-feature.dto';
import { UpdateFeatureDto } from '../dto/feature/update-feature.dto';
import { Feature } from '../entities/feature.entity';

@Injectable()
export class FeatureService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Feature)
    private readonly featureRepository: Repository<Feature>,
  ) {}
  async onApplicationBootstrap() {
    await this.insertAll();
  }

  async create(createFeatureDto: CreateFeatureDto) {
    try {
      const feature = Object.assign(new Feature(), createFeatureDto) as Feature;
      return await this.featureRepository.save(feature);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return await this.featureRepository.find({
      select: ['id', 'name'],
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} property`;
  }

  update(id: number, updateFeatureDto: UpdateFeatureDto) {
    return `This action updates a #${id} property`;
  }

  remove(id: number) {
    return `This action removes a #${id} property`;
  }

  async insertAll() {
    const featureArray = [
      { name: 'AC & Heating' },
      { name: 'Balcony' },
      { name: 'Clubhouse' },
      { name: 'Dishwasher' },
      { name: 'Elevator' },
      { name: 'Fitness Center' },
      { name: 'Granite Countertops' },
      { name: 'Laundry Facilities' },
      { name: 'Modern Kitchen' },
      { name: 'Pet Friendly' },
      { name: 'Pool' },
      { name: 'Spa' },
    ];

    const featureCount = await this.featureRepository.count();
    if (!featureCount) {
      Logger.log('Running feature seeder');
      await this.featureRepository.insert(featureArray);
    }
    return await this.featureRepository.find({});
  }
}
