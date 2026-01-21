import '@testing-library/jest-dom';
import { expect, afterEach, beforeAll } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock localStorage before all tests
beforeAll(() => {
    class LocalStorageMock implements Storage {
        private store: Record<string, string> = {};

        get length(): number {
            return Object.keys(this.store).length;
        }

        clear(): void {
            this.store = {};
        }

        getItem(key: string): string | null {
            return this.store[key] || null;
        }

        setItem(key: string, value: string): void {
            this.store[key] = String(value);
        }

        removeItem(key: string): void {
            delete this.store[key];
        }

        key(index: number): string | null {
            const keys = Object.keys(this.store);
            return keys[index] || null;
        }
    }

    global.localStorage = new LocalStorageMock();
});

// Cleanup after each test
afterEach(() => {
    cleanup();
    localStorage.clear();
});
