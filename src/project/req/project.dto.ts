import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  UpdateDateColumn,
} from 'typeorm';

@Entity('project', { schema: 'sonarqube' })
export class ProjectDto {
  @Column('varchar', {
    primary: true,
    name: 'id',
    length: 255,
    generated: 'uuid',
  })
  id: string;

  @Column('varchar', { name: 'key', unique: true, length: 255 })
  key: string;

  @Column('varchar', { name: 'submissionId', nullable: true, length: 255 })
  submissionId: string | null;

  @Column('varchar', { name: 'userId', length: 255 })
  userId: string;

  @CreateDateColumn({
    name: 'createdAt',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updatedAt',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deletedAt',
  })
  deletedAt: Date;
}
