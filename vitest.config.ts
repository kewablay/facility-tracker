import { defineConfig } from 'vitest/config';

const APPLICATION_BOOT_TIMEOUT_MS = 20000;

export default defineConfig({
  test: {
    testTimeout: APPLICATION_BOOT_TIMEOUT_MS,
  },
});
