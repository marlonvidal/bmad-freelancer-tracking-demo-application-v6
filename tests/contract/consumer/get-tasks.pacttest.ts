import { MatchersV3 } from '@pact-foundation/pact';
import type { V3MockServer } from '@pact-foundation/pact';
import { createProviderState, setJsonBody, setJsonContent } from '../support/consumer-helpers';
import { taskExists, noTasksExist } from '../support/provider-states';
import { createPact } from '../support/pact-config';

/**
 * Consumer contract test for Tasks API.
 *
 * IMPORTANT: When the app has a real API client (e.g. src/api/tasks-client.ts),
 * replace the fetch() calls below with imports of your actual consumer functions.
 * CDC testing validates YOUR consumer code works with the contract — not raw fetch().
 *
 * Example:
 *   import { getTasks, getTaskById } from '../../../src/api/tasks-client';
 *   // then: setApiUrl(mockServer.url) before calling getTasks()
 */

const { like, string, integer, eachLike } = MatchersV3;

const pact = createPact();

describe('Tasks API Consumer Contract', () => {
  const sampleTask = {
    id: 'task-123',
    title: 'Implement authentication',
    status: 'in-progress',
    priority: 'high',
  };

  it('should get all tasks', async () => {
    await pact
      .addInteraction()
      .given('A task exists', { id: sampleTask.id, title: sampleTask.title, status: sampleTask.status, priority: sampleTask.priority })
      .uponReceiving('a request to get all tasks')
      .withRequest(
        'GET',
        '/api/tasks',
        setJsonContent({
          headers: { Accept: 'application/json' },
        }),
      )
      .willRespondWith(
        200,
        setJsonBody(
          eachLike({
            id: string('task-123'),
            title: string('Implement authentication'),
            status: string('in-progress'),
            priority: string('high'),
          }),
        ),
      )
      .executeTest(async (mockServer: V3MockServer) => {
        const response = await fetch(`${mockServer.url}/api/tasks`, {
          headers: { Accept: 'application/json' },
        });
        const tasks = await response.json();

        expect(response.status).toBe(200);
        expect(Array.isArray(tasks)).toBe(true);
        expect(tasks[0]).toHaveProperty('id');
        expect(tasks[0]).toHaveProperty('title');
        expect(tasks[0]).toHaveProperty('status');
      });
  });

  it('should get a task by ID', async () => {
    const [stateName, stateParams] = createProviderState(taskExists(sampleTask));

    await pact
      .addInteraction()
      .given(stateName, stateParams)
      .uponReceiving('a request to get a task by ID')
      .withRequest(
        'GET',
        '/api/tasks/task-123',
        setJsonContent({
          headers: { Accept: 'application/json' },
        }),
      )
      .willRespondWith(
        200,
        setJsonBody(
          like({
            id: string('task-123'),
            title: string('Implement authentication'),
            status: string('in-progress'),
            priority: string('high'),
            estimatedHours: integer(8),
          }),
        ),
      )
      .executeTest(async (mockServer: V3MockServer) => {
        const response = await fetch(`${mockServer.url}/api/tasks/task-123`, {
          headers: { Accept: 'application/json' },
        });
        const task = await response.json();

        expect(response.status).toBe(200);
        expect(task.id).toBe('task-123');
        expect(task.title).toBe('Implement authentication');
      });
  });

  it('should return 404 for a non-existent task', async () => {
    const [stateName, stateParams] = createProviderState(noTasksExist());

    await pact
      .addInteraction()
      .given(stateName, stateParams)
      .uponReceiving('a request for a non-existent task')
      .withRequest('GET', '/api/tasks/non-existent-id')
      .willRespondWith(404, setJsonBody({ error: 'Task not found' }))
      .executeTest(async (mockServer: V3MockServer) => {
        const response = await fetch(`${mockServer.url}/api/tasks/non-existent-id`);

        expect(response.status).toBe(404);
      });
  });
});
