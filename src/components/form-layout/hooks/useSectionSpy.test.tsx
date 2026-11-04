// @vitest-environment jsdom
import { act, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useSectionSpy } from './useSectionSpy.ts';

const LABELS = ['General', 'Dimensions', 'Capacity'];

/** The one observer the hook creates; `cross` plays a section entering or leaving the band. */
let observer: { cb: IntersectionObserverCallback; observed: Element[] } | undefined;
const cross = (label: string, isIntersecting: boolean) =>
  act(() =>
    observer!.cb(
      [
        {
          target: observer!.observed.find(n => (n as HTMLElement).dataset.section === label)!,
          isIntersecting,
        } as unknown as IntersectionObserverEntry,
      ],
      {} as IntersectionObserver
    )
  );

beforeEach(() => {
  observer = undefined;
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(cb: IntersectionObserverCallback) {
        observer = { cb, observed: [] };
      }
      observe(n: Element) {
        observer!.observed.push(n);
      }
      disconnect() {}
    }
  );
  Element.prototype.scrollIntoView = vi.fn();
});
afterEach(() => vi.unstubAllGlobals());

const Sections = (props: {
  enabled?: boolean;
  active?: string;
  onActiveChange?: (l: string) => void;
}) => {
  const register = useSectionSpy({ labels: LABELS, ...props, enabled: props.enabled ?? true });
  return (
    <>
      {LABELS.map(l => (
        <section key={l} data-section={l} ref={register(l)} />
      ))}
    </>
  );
};

describe('useSectionSpy', () => {
  it('reports the first section inside the reading band', () => {
    const onActiveChange = vi.fn();
    render(<Sections onActiveChange={onActiveChange} />);
    expect(observer!.observed).toHaveLength(LABELS.length);
    cross('Dimensions', true);
    cross('Capacity', true);
    expect(onActiveChange.mock.calls).toEqual([['Dimensions']]);
    cross('Dimensions', false);
    expect(onActiveChange).toHaveBeenLastCalledWith('Capacity');
  });

  it('scrolls to a requested section, and never on mount', () => {
    const { rerender } = render(<Sections active="General" />);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
    rerender(<Sections active="Capacity" />);
    expect(Element.prototype.scrollIntoView).toHaveBeenCalledOnce();
  });

  it('does not scroll back to a section it reported itself', () => {
    const onActiveChange = vi.fn();
    const { rerender } = render(<Sections active="General" onActiveChange={onActiveChange} />);
    cross('Dimensions', true);
    rerender(<Sections active="Dimensions" onActiveChange={onActiveChange} />);
    expect(Element.prototype.scrollIntoView).not.toHaveBeenCalled();
  });

  it('observes nothing while disabled', () => {
    render(<Sections enabled={false} />);
    expect(observer).toBeUndefined();
  });
});
