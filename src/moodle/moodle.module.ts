import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { MoodleController } from './moodle.controller';
import { MoodleService } from './moodle.service';
import { MoodleDBService } from './moodleDB.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MoodleReqDto } from './req/moodle-req.dto';
import { MoodleResDto } from './res/moodle-res.dto';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([MoodleReqDto, MoodleResDto])],
  controllers: [MoodleController],
  providers: [
    {
      provide: 'MOODLE_MODULE',
      useClass: MoodleService,
    },
    MoodleService,
    MoodleDBService,
  ],
  exports: ['MOODLE_MODULE'],
})
@Global()
export class MoodleModule {}
