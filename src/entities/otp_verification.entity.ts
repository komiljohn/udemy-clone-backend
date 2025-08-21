import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class OtpVerification {
  @PrimaryKey()
  id: number;

  @Property({ length: 50 })
  name: string;

  @Property({ unique: true, length: 50 })
  email: string;

  @Property()
  passwordHash: string;

  @Property({ type: 'int', length: 6 })
  otp: number;

  @Property({ type: 'date' })
  expiresAt: Date;

  @Property({ onCreate: () => new Date() })
  createdAt?: Date;
}
