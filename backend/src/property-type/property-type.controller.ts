import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PropertyTypeService } from './property-type.service';
import { CreatePropertyTypeDto } from './dto/create-property-type.dto';
import { UpdatePropertyTypeDto } from './dto/update-property-type.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Property-type')
@Controller('property-type')
export class PropertyTypeController {
  constructor(private readonly propertyTypeService: PropertyTypeService) {}

  @Post()
  create(@Body() createPropertyTypeDto: CreatePropertyTypeDto) {
    return this.propertyTypeService.create(createPropertyTypeDto);
  }

  @Get()
  findAll() {
    return this.propertyTypeService.findPropertyCount();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyTypeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyTypeDto: UpdatePropertyTypeDto,
  ) {
    return this.propertyTypeService.update(+id, updatePropertyTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyTypeService.remove(+id);
  }

  @Get('/insert/all/types')
  insertAll() {
    return this.propertyTypeService.insertAll();
  }
}
