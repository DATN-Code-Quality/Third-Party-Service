import { IsString } from 'class-validator';
import { BaseEntity } from 'src/common/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('category', { schema: 'sonarqube' })
export class CategoryReqDto extends BaseEntity {
  @IsString()
  @Column('varchar', { name: 'name', length: 255 })
  name: string;

  // @IsString()
  @Column('varchar', {
    name: 'categoryMoodleId',
    length: 255,
    nullable: true,
    unique: true,
  })
  categoryMoodleId: string;
}