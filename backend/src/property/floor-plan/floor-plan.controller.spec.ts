import { Test, TestingModule } from '@nestjs/testing';
import { FloorPlanController } from './floor-plan.controller';
import { FloorPlanService } from './floor-plan.service';

describe('FloorPlanController', () => {
  let controller: FloorPlanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloorPlanController],
      providers: [FloorPlanService],
    }).compile();

    controller = module.get<FloorPlanController>(FloorPlanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
