import { Test, TestingModule } from '@nestjs/testing';
import { CostFormService } from './cost-form.service';

describe('CostFormService', () => {
  let service: CostFormService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CostFormService],
    }).compile();

    service = module.get<CostFormService>(CostFormService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
