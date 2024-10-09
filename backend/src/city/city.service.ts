import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { City } from './entities/city.entity';

@Injectable()
export class CityService {
  constructor(
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(createCityDto: CreateCityDto) {
    try {
      const city = Object.assign(new City(), createCityDto) as City;
      return await this.cityRepository.save(city);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      return await this.cityRepository.find({
        select: ['id', 'name'],
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} city`;
  }

  update(id: number, updateCityDto: UpdateCityDto) {
    return `This action updates a #${id} city`;
  }

  remove(id: number) {
    return `This action removes a #${id} city`;
  }

  async insertAll() {
    const cityArray = [
      { name: 'Washington' },
      { name: 'San Francisco' },
      { name: 'San Diego' },
      { name: 'New York' },
      { name: 'Miami' },
      { name: 'Boston' },
      { name: 'Chicago' },
      { name: 'Columbus' },
      { name: 'Dallas' },
      { name: 'Detroit' },
      { name: 'Las Vegas' },
      { name: 'Los Angeles' },
    ];

    const cityCount = await this.cityRepository.count({});

    if (!cityCount) {
      Logger.log('Running city seeder');
      await this.cityRepository.insert(cityArray);
    }

    return await this.cityRepository.find({});
  }
}
