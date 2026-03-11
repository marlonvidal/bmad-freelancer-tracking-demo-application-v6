import type { ProviderStateInput } from './consumer-helpers';

export const taskExists = (task: {
  id: string;
  title: string;
  status: string;
  priority: string;
}): ProviderStateInput => ({
  name: 'A task exists',
  params: task,
});

export const noTasksExist = (): ProviderStateInput => ({
  name: 'No tasks exist',
  params: {},
});

export const freelancerExists = (freelancer: {
  id: string;
  name: string;
  email: string;
  status: string;
}): ProviderStateInput => ({
  name: 'A freelancer exists',
  params: freelancer,
});
