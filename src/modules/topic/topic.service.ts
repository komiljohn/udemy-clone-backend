import { EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Topic } from 'src/entities';

@Injectable()
export class TopicService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Topic)
    private readonly topicRepository: EntityRepository<Topic>,
  ) {}

  findAll() {
    return this.topicRepository.findAll();
  }

  async findOne(id: string) {
    return this.topicRepository.findOne(
      {
        id,
      },
      { populate: ['children'] },
    );
  }
}
