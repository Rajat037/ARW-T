import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from '../components/ErrorBoundary';

describe('Sanity Check', () => {
  it('math works', () => {
    expect(1 + 1).toBe(2);
  });

  it('renders ErrorBoundary fallback on error', () => {
    const ThrowError = () => {
      throw new Error("Test error");
    };

    // Suppress console.error for this expected error in tests
    const spy = vi.spyOn(console, 'error');
    spy.mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByText('Oops, something went wrong!')).toBeDefined();
    spy.mockRestore();
  });
});
