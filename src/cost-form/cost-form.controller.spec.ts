import { Test, TestingModule } from '@nestjs/testing';
import { CostFormController } from './cost-form.controller';

describe('CostFormController', () => {
  let controller: CostFormController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CostFormController],
    }).compile();

    controller = module.get<CostFormController>(CostFormController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
