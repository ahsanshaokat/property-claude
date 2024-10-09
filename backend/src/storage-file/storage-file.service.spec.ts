import { Test, TestingModule } from '@nestjs/testing';
import { StorageFileService } from './storage-file.service';

describe('StorageFileService', () => {
  let service: StorageFileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StorageFileService],
    }).compile();

    service = module.get<StorageFileService>(StorageFileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
