import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('moodle', { schema: 'sonarqube' })
export class MoodleReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'host', length: 255 })
  host: string;

  @IsString()
  @Column('varchar', { name: 'token', length: 50 })
  token: string;
}
