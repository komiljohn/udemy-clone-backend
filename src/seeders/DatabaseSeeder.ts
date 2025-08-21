import { EntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { Course } from '../entities/course.entity';
import { Topic, TopicType } from '../entities/topic.entity';
import { faker } from '@faker-js/faker';

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager) {
    const topicRepository = em.getRepository(Topic);
    const courseRepository = em.getRepository(Course);

    // Create main categories
    const mainTopics = Array.from({ length: 5 }, () => {
      const topic = topicRepository.create({
        name: faker.internet.domainWord(),
        type: TopicType.CATEGORY,
      });
      return topic;
    });

    await em.persistAndFlush(mainTopics);

    // Create sub-categories for each main topic
    for (const mainTopic of mainTopics) {
      const subTopics = Array.from(
        { length: faker.number.int({ min: 2, max: 5 }) },
        () => {
          const subTopic = topicRepository.create({
            name: faker.internet.domainWord(),
            type: TopicType.SUBCATEGORY,
            parent: mainTopic,
          });
          return subTopic;
        },
      );
      await em.persistAndFlush(subTopics);

      // Create courses for each sub-topic
      for (const subTopic of subTopics) {
        const courses = Array.from(
          { length: faker.number.int({ min: 3, max: 8 }) },
          () => {
            const course = courseRepository.create({
              name: faker.company.catchPhrase(),
              price: faker.number.float({
                min: 9.99,
                max: 199.99,
                fractionDigits: 2,
              }),
              description: faker.lorem.paragraphs(2),
              topics: [subTopic],
            });
            return course;
          },
        );
        await em.persistAndFlush(courses);
      }
    }
  }
}
