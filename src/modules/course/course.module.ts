import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Course } from 'src/entities';

@Module({
  controllers: [CourseController],
  providers: [CourseService],
  imports: [MikroOrmModule.forFeature([Course])],
})
export class CourseModule {}
