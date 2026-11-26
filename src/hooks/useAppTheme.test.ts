// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAppTheme } from './useAppTheme.ts';

const GOOD = '/theme-a.json',
  BAD = '/theme-b.json',
  PRIMARY = '#123456';

const respond = (url: string) =>
  url === GOOD
    ? new Response(JSON.stringify({ palette: { primary: { main: PRIMARY } } }))
    : new Response('', { status: 404 });

describe('useAppTheme', () => {
  afterEach(() => vi.restoreAllMocks());

  it('keeps the shown theme when a switch fails and hands its path back', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async url => respond(String(url)));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const onFailedSwitch = vi.fn();
    const { result, rerender } = renderHook(({ path }) => useAppTheme(path, onFailedSwitch), {
      initialProps: { path: GOOD },
    });
    await waitFor(() => expect(result.current?.palette.primary.main).toBe(PRIMARY));

    rerender({ path: BAD });
    await waitFor(() => expect(onFailedSwitch).toHaveBeenCalledWith(GOOD));
    expect(result.current?.palette.primary.main).toBe(PRIMARY);
  });

  it('falls back to plain MUI when the first theme fails, with nothing to go back to', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation(async url => respond(String(url)));
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const onFailedSwitch = vi.fn();
    const { result } = renderHook(() => useAppTheme(BAD, onFailedSwitch));
    await waitFor(() => expect(result.current).not.toBeNull());
    expect(result.current?.palette.primary.main).not.toBe(PRIMARY);
    expect(onFailedSwitch).not.toHaveBeenCalled();
  });
});
