import { Test } from '@nestjs/testing';
import { SubmissionsService } from './submission.service';
import { TemporlClientModule } from '../temporal/client.module';
import { Any } from 'typeorm';

describe('SubmissionsController', () => {
  let service: SubmissionsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [TemporlClientModule],
      providers: [SubmissionsService],
      exports: [SubmissionsService],
    }).compile();

    service = moduleRef.get<SubmissionsService>(SubmissionsService);
  });

  describe('scanCodes', () => {
    it('should return null', async () => {
      const result = await service.scanCodes();
      // expect(result).toBe(Any);
    });
  });
});
