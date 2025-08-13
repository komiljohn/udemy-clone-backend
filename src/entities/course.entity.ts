import { Entity, Property } from '@mikro-orm/core';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity()
export class Course extends BaseEntity {
  @Property()
  name: string;
}
