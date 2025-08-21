import { Collection, Entity, ManyToMany, Property } from '@mikro-orm/core';
import { BaseEntity } from '../shared/entities/base.entity';
import { Topic } from './topic.entity';

@Entity()
export class Course extends BaseEntity {
  @Property({ nullable: false })
  name: string;

  @Property({ nullable: false, type: 'text' })
  description: string;

  @Property({ type: 'float', nullable: false })
  price: number;

  @ManyToMany(() => Topic, 'courses', {
    owner: true,
    pivotTable: 'course_topic',
  })
  topics = new Collection<Topic>(this);
}
