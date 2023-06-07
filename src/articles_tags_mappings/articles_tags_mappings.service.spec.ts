import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesTagsMappingsService } from './articles_tags_mappings.service';

describe('ArticlesTagsMappingsService', () => {
  let service: ArticlesTagsMappingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesTagsMappingsService],
    }).compile();

    service = module.get<ArticlesTagsMappingsService>(ArticlesTagsMappingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
