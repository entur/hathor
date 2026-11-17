// @vitest-environment jsdom
/**
 * `EditFooter` is presentational — it holds no state and knows nothing about
 * saving. These pin what a host depends on: Save reaches the host only with
 * something to save and nothing missing (and says why otherwise), Cancel is inert
 * unless there is something to discard, and every string is overridable (the
 * library carries no i18n).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditFooter } from './EditFooter';

const save = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Save' });
const cancel = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Cancel' });

describe('EditFooter', () => {
  it('while clean: Cancel inert, Save says there is nothing to save until the form changes', () => {
    const onSave = vi.fn();
    const { rerender } = render(<EditFooter dirty={false} onSave={onSave} onCancel={vi.fn()} />);

    expect(cancel().disabled).toBe(true);
    expect(save().disabled).toBe(false);
    fireEvent.click(save());
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByRole('status').textContent).toBe('No changes to save');

    rerender(<EditFooter dirty onSave={onSave} onCancel={vi.fn()} />);
    expect(screen.getByRole('status').textContent).toBe('Unsaved changes');
    rerender(<EditFooter dirty={false} saved onSave={onSave} onCancel={vi.fn()} />);
    expect(screen.getByRole('status').textContent).toBe('All changes saved');
  });

  it('wakes both actions once dirty and reports the click', () => {
    const onSave = vi.fn(),
      onCancel = vi.fn();
    render(<EditFooter dirty onSave={onSave} onCancel={onCancel} />);

    fireEvent.click(save());
    fireEvent.click(cancel());

    expect(onSave).toHaveBeenCalledOnce();
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('locks both actions while a save is in flight', () => {
    const onSave = vi.fn(),
      onCancel = vi.fn();
    render(<EditFooter dirty saving onSave={onSave} onCancel={onCancel} />);

    // Not just double-submit: discarding mid-flight would restore a baseline
    // the in-flight save is about to replace.
    expect(save().disabled).toBe(true);
    expect(cancel().disabled).toBe(true);
  });

  it('honours `disabled` even when dirty', () => {
    render(<EditFooter dirty disabled onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(save().disabled).toBe(true);
    expect(cancel().disabled).toBe(true);
  });

  it('with a required field missing, Save says why instead of saving; Cancel still discards', () => {
    const onSave = vi.fn(),
      onCancel = vi.fn();
    render(<EditFooter dirty canSubmit={false} onSave={onSave} onCancel={onCancel} />);

    fireEvent.click(save());
    fireEvent.click(cancel());

    expect(onSave).not.toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.getByText('Required fields missing')).toBeTruthy();
  });

  it('tints the band when dirty over its surface, not in place of it', () => {
    // An `alpha()` tint as the background colour would replace the surface; it
    // composites over it instead.
    const { container, rerender } = render(
      <EditFooter dirty={false} onSave={vi.fn()} onCancel={vi.fn()} />
    );
    const band = () => container.firstElementChild as HTMLElement;
    const clean = getComputedStyle(band()).backgroundColor;

    rerender(<EditFooter dirty onSave={vi.fn()} onCancel={vi.fn()} />);

    const style = getComputedStyle(band());
    expect(style.backgroundColor).toBe(clean);
    expect(style.backgroundColor).not.toMatch(/rgba|transparent/);
    expect(style.backgroundImage).toMatch(/linear-gradient/);
  });

  it('lets a host restyle the band — its sx wins over the defaults', () => {
    const { container } = render(
      <EditFooter dirty onSave={vi.fn()} onCancel={vi.fn()} sx={{ bgcolor: 'rgb(1, 2, 3)' }} />
    );

    expect(getComputedStyle(container.firstElementChild as HTMLElement).backgroundColor).toBe(
      'rgb(1, 2, 3)'
    );
  });

  it('keeps the controlled props, whatever slotProps ask for', () => {
    const onSave = vi.fn();
    render(
      <EditFooter
        dirty={false}
        onSave={onSave}
        onCancel={vi.fn()}
        slotProps={{ save: { onClick: onSave } }}
      />
    );

    // Nothing to save is the component's call, not a default to override.
    fireEvent.click(save());
    expect(onSave).not.toHaveBeenCalled();
  });

  it('states the session status, and takes localized strings for every word', () => {
    const { rerender } = render(<EditFooter dirty={false} onSave={vi.fn()} onCancel={vi.fn()} />);
    // Entering a form is not news: a fresh, clean form states nothing.
    expect(screen.getByRole('status').textContent).toBe('');

    rerender(<EditFooter dirty={false} saved onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('All changes saved')).toBeTruthy();

    rerender(<EditFooter dirty onSave={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Unsaved changes')).toBeTruthy();

    rerender(
      <EditFooter
        dirty
        onSave={vi.fn()}
        onCancel={vi.fn()}
        labels={{ save: 'Lagre', cancel: 'Avbryt', dirty: 'Ulagrede endringer' }}
      />
    );
    expect(screen.getByRole('button', { name: 'Lagre' })).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Avbryt' })).toBeTruthy();
    expect(screen.getByText('Ulagrede endringer')).toBeTruthy();
  });
});
