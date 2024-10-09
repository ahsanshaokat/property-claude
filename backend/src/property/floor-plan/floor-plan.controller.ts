import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FloorPlanService } from './floor-plan.service';
import { CreateFloorPlanDto } from './dto/create-floor-plan.dto';
import { UpdateFloorPlanDto } from './dto/update-floor-plan.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Floor-plan')
@Controller('floor-plan')
export class FloorPlanController {
  constructor(private readonly floorPlanService: FloorPlanService) {}

  @Post()
  create(@Body() createFloorPlanDto: CreateFloorPlanDto) {
    return this.floorPlanService.create(createFloorPlanDto);
  }

  @Get()
  findAll() {
    return this.floorPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.floorPlanService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateFloorPlanDto: UpdateFloorPlanDto,
  ) {
    return this.floorPlanService.update(+id, updateFloorPlanDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.floorPlanService.remove(+id);
  }
}
