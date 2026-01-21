import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect với các matchers từ jest-dom
expect.extend(matchers);

// Tự động cleanup sau mỗi test
afterEach(() => {
    cleanup();
});
