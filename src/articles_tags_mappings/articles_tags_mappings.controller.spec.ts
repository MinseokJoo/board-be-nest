import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesTagsMappingsController } from './articles_tags_mappings.controller';

describe('ArticlesTagsMappingsController', () => {
  let controller: ArticlesTagsMappingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArticlesTagsMappingsController],
    }).compile();

    controller = module.get<ArticlesTagsMappingsController>(ArticlesTagsMappingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
