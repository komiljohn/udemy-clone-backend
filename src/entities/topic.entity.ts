import {
  Property,
  ManyToOne,
  Enum,
  OneToMany,
  Collection,
  ManyToMany,
  Entity,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/entities/base.entity';
import { Course } from './course.entity';
import { User } from './user.entity';

export enum TopicType {
  CATEGORY = 'category',
  SUBCATEGORY = 'sub-category',
  TOPIC = 'topic',
}

@Entity()
export class Topic extends BaseEntity {
  @Property({ unique: true, nullable: false })
  name: string;

  @ManyToOne(() => Topic, { nullable: true })
  parent?: Topic;

  @Enum(() => TopicType)
  type: TopicType;

  @Property({ type: 'float', default: 0 })
  score?: number;

  @OneToMany(() => Topic, 'parent')
  children = new Collection<Topic>(this);

  @ManyToMany(() => Course, 'topics')
  courses = new Collection<Course>(this);

  @ManyToMany(() => User, 'interests')
  users = new Collection<any>(this);
}
