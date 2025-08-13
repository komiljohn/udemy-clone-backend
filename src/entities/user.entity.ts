import { Entity, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from 'src/shared/entities/base.entity';

@Entity()
export class User extends BaseEntity {
  @Property()
  name: string;

  @Property()
  email: string;
}
