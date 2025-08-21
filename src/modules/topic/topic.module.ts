import { Module } from '@nestjs/common';
import { TopicService } from './topic.service';
import { TopicController } from './topic.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Topic } from 'src/entities';

@Module({
  imports: [MikroOrmModule.forFeature([Topic])],
  controllers: [TopicController],
  providers: [TopicService],
})
export class TopicModule {}
