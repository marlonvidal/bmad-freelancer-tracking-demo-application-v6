import { faker } from '@faker-js/faker';

export type FreelancerStatus = 'active' | 'inactive' | 'on-leave';

export type Freelancer = {
  id: string;
  name: string;
  email: string;
  skills: string[];
  hourlyRate: number;
  status: FreelancerStatus;
  timezone: string;
  joinedAt: string;
};

export const createFreelancer = (overrides: Partial<Freelancer> = {}): Freelancer => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  skills: [faker.hacker.noun(), faker.hacker.noun(), faker.hacker.noun()],
  hourlyRate: faker.number.int({ min: 25, max: 200 }),
  status: 'active',
  timezone: faker.location.timeZone(),
  joinedAt: faker.date.past().toISOString(),
  ...overrides,
});

export const createInactiveFreelancer = (overrides: Partial<Freelancer> = {}): Freelancer =>
  createFreelancer({ status: 'inactive', ...overrides });
