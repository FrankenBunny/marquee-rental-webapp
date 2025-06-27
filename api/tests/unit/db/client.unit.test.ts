import { vi, describe, it, expect } from 'vitest';

vi.mock('pg', () => {
  return {
    Client: vi.fn().mockImplementation(() => ({
      connect: vi.fn().mockRejectedValue(new Error('Connection refused')),
      end: vi.fn().mockRejectedValue(new Error('Disconnect failed')),
    })),
  };
});

import db from '../../../src/db/client.js';

describe('(UnitTest): Database connection', () => {
  it('should throw error when failed to connect', async () => {
    await expect(db.connect()).rejects.toThrow();
  });

  it('should throw error when failed to disconnect', async () => {
    await expect(db.disconnect()).rejects.toThrow();
  });
});