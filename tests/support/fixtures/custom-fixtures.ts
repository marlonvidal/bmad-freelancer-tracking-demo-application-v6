import { test as base } from '@playwright/test';
import { createTask, createFreelancer, type Task, type Freelancer } from '../factories';

type CustomFixtures = {
  task: Task;
  urgentTask: Task;
  freelancer: Freelancer;
};

export const test = base.extend<CustomFixtures>({
  task: async ({}, use) => {
    const task = createTask();
    await use(task);
  },

  urgentTask: async ({}, use) => {
    const task = createTask({ priority: 'urgent', status: 'in-progress' });
    await use(task);
  },

  freelancer: async ({}, use) => {
    const freelancer = createFreelancer();
    await use(freelancer);
  },
});
