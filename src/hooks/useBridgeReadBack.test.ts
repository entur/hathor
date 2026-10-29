// @vitest-environment jsdom
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useBridgeReadBack } from './useBridgeReadBack';

const NOT_FOUND = 'Vehicle not found';
const OK = { error: null, notFound: false };

const renderBridge = (record: { error: string | null; notFound: boolean }, bridged: boolean) => {
  const warn = vi.fn();
  const hook = renderHook(
    ({ record, bridged }) => useBridgeReadBack(record, bridged, NOT_FOUND, warn),
    { initialProps: { record, bridged } }
  );
  return { warn, ...hook };
};

describe('useBridgeReadBack', () => {
  it('warns with the load error while bridged', () => {
    const { warn, rerender } = renderBridge(OK, true);
    expect(warn).not.toHaveBeenCalled();
    rerender({ record: { error: 'boom', notFound: false }, bridged: true });
    expect(warn).toHaveBeenCalledExactlyOnceWith('boom');
  });

  it('warns with the not-found label when Sobek has no record', () => {
    const { warn } = renderBridge({ error: null, notFound: true }, true);
    expect(warn).toHaveBeenCalledExactlyOnceWith(NOT_FOUND);
  });

  it('stays quiet when not bridged', () => {
    const { warn } = renderBridge({ error: 'boom', notFound: true }, false);
    expect(warn).not.toHaveBeenCalled();
  });

  it('warns once per failure across re-renders', () => {
    const failed = { error: 'boom', notFound: false };
    const { warn, rerender } = renderBridge(failed, true);
    rerender({ record: { ...failed }, bridged: true });
    expect(warn).toHaveBeenCalledTimes(1);
  });
});
