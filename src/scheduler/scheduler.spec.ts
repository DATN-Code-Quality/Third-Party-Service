import { Test, TestingModule } from '@nestjs/testing';
import { SchedulerService } from './scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';
import { SubmissionModule } from '../submission/submission.module';

describe('schedulerSpec', () => {
  let service: SchedulerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SchedulerService],
      imports: [ScheduleModule.forRoot(), SubmissionModule],
    }).compile();

    service = module.get<SchedulerService>(SchedulerService);
  });

  it.only('should be defined', () => {
    const res = service.startJob('2', 2);

    // expect(service.startJob).toBeDefined();
  });
});
