import {
  Collection,
  Entity,
  Enum,
  ManyToMany,
  Property,
  TextType,
} from '@mikro-orm/core';
import { BaseEntity } from '../shared/entities/base.entity';
import { Topic } from './topic.entity';

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class User extends BaseEntity {
  @Property({ nullable: false, length: 30, unique: true })
  email!: string;

  @Property({ nullable: false, length: 100 })
  password!: string;

  @Property({ nullable: false, length: 50 })
  name!: string;

  @Property({ type: TextType, length: 1000, nullable: true })
  bio?: string;

  @Property({ length: 30, nullable: true })
  company?: string;

  @Property({ length: 30, nullable: true })
  location?: string;

  @Property({ length: 30, nullable: true })
  github_username?: string;

  @Enum(() => UserStatus)
  status?: UserStatus = UserStatus.ACTIVE;

  @Property({ length: 50, nullable: true })
  website?: string;

  @Property({ length: 50, nullable: true })
  youtube?: string;

  @Property({ length: 50, nullable: true })
  twitter?: string;

  @Property({ length: 50, nullable: true })
  instagram?: string;

  @Property({ length: 50, nullable: true })
  facebook?: string;

  @Property({ length: 50, nullable: true })
  linkedin?: string;

  @ManyToMany(() => Topic, 'users', {
    owner: true,
    pivotTable: 'user_topic',
  })
  interests = new Collection<Topic>(this);
}
