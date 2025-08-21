import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { RegisterDto } from '../auth/dto/register.dto';
import { User } from 'src/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User) private readonly userRepo: EntityRepository<User>,
  ) {}

  async create(createUserDto: RegisterDto) {
    const { email } = createUserDto;

    const userExists = await this.userRepo.findOne({ email });

    if (userExists)
      throw new ConflictException('User with this email already exists');

    const user = this.userRepo.create({
      ...createUserDto,
    });

    await this.em.persistAndFlush([user]);

    return user;
  }

  findAll() {
    return `This action returns all user`;
  }

  async findOneOrFail(id: string) {
    const user = await this.userRepo.findOne({ id });

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOne(id: string) {
    const user = await this.userRepo.findOne({ id });

    return user;
  }

  async findOneByEmail(email: string) {
    const user = await this.userRepo.findOne({ email });

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto);
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }
}
