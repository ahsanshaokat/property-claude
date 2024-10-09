import { Injectable } from '@nestjs/common';
import { PropertyTypeService } from './property-type/property-type.service';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppService {
  constructor(
    private readonly propertyTypeService: PropertyTypeService,
    private readonly configService: ConfigService,
  ) {}

  async getHello() {
    try {
      const [property, frontend] = await Promise.all([
        this.getProperty(),
        this.callFrontend(),
      ]);
      return {
        backend:
          property?.length > 0
            ? 'Hello world from backend'
            : 'Ajke amar mon valo nei',
        frontend: frontend?.status,
      };
    } catch (error) {
      return {
        backend: 'Ajke amar mon valo nei',
        frontend: 'Ajke amar mon valo nei',
      };
    }
  }

  async getProperty() {
    return await this.propertyTypeService.findAll();
  }

  async callFrontend() {
    return await axios.get(this.configService.get('FRONTEND_BASE_URL'));
  }
}
