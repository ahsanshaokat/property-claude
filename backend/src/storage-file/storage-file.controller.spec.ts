import { Test, TestingModule } from '@nestjs/testing';
import { StorageFileController } from './storage-file.controller';
import { StorageFileService } from './storage-file.service';

describe('StorageFileController', () => {
  let controller: StorageFileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StorageFileController],
      providers: [StorageFileService],
    }).compile();

    controller = module.get<StorageFileController>(StorageFileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
