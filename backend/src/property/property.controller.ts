import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PropertyService } from './property.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { QueryFilterPropertyDto } from './dto/query-filter.property';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { ExpressRequestUser } from '../common/type/ExpressRequestUser';
import { CurrentUser } from '../auth/decorator/loggedin-user';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Property')
@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @CurrentUser() user: ExpressRequestUser,
    @Body() createPropertyDto: CreatePropertyDto,
  ) {
    return this.propertyService.create(createPropertyDto, user);
  }

  @Get()
  findAll(@Query() query: QueryFilterPropertyDto) {
    return this.propertyService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propertyService.findOneWithRelation(+id);
  }

  @Get('/find-by/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.propertyService.findBySlug(slug);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePropertyDto: UpdatePropertyDto,
  ) {
    return this.propertyService.update(+id, updatePropertyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propertyService.remove(+id);
  }
}
