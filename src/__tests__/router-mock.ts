import { vi } from 'vitest';
import { createRouterMock, type RouterMockOptions } from 'vue-router-mock';

export const createVitestRouterMock = (options?: RouterMockOptions) =>
  createRouterMock({
    ...options,
    spy: {
      create: (fn) => vi.fn(fn),
      reset: (spy) => spy.restore(),
    },
  });
