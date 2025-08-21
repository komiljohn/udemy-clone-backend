import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Course } from 'src/entities';

@Injectable()
export class CourseService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Course)
    private readonly courseRepository: EntityRepository<Course>,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const course = this.courseRepository.create(createCourseDto);
    await this.em.persistAndFlush(course);
    return course;
  }

  async findAll() {
    return this.courseRepository.findAll();
  }

  async findOne(id: string) {
    return this.courseRepository.findOne({
      id,
    });
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.findOne(id);
    if (!course) {
      throw new Error('Course not found');
    }
    this.em.assign(course, updateCourseDto);
    await this.em.persistAndFlush(course);
    return course;
  }

  async remove(id: string) {
    const course = await this.findOne(id);
    if (!course) {
      throw new Error('Course not found');
    }
    await this.em.removeAndFlush(course);
    return course;
  }
}
