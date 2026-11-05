// @vitest-environment jsdom
/**
 * `EditFooter` is presentational — it holds no state and knows nothing about
 * saving. These pin the two things a host actually depends on: the buttons are
 * inert unless there is something to act on, and every string is overridable
 * (the library carries no i18n).
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { EditFooter } from './EditFooter';

const save = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Save' });
const cancel = () => screen.getByRole<HTMLButtonElement>('button', { name: 'Cancel' });

describe('EditFooter', () => {
  it('renders both actions inert while the form is clean', () => {
    render(<EditFooter dirty={false} onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(save().disabled).toBe(true);
    expect(cancel().disabled).toBe(true);
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

  it('locks only Save while a required field is missing, and says why', () => {
    const onCancel = vi.fn();
    render(<EditFooter dirty canSubmit={false} onSave={vi.fn()} onCancel={onCancel} />);

    fireEvent.click(cancel());

    expect(save().disabled).toBe(true);
    expect(onCancel).toHaveBeenCalledOnce();
    expect(screen.getByText('Required fields missing')).toBeTruthy();
  });

  it('keeps the band opaque when dirty, so the form cannot scroll through it', () => {
    // The footer is sticky: an `alpha()` tint as the background colour leaves it
    // 92% see-through, and the fields scroll visibly under the buttons. The tint
    // has to composite over the surface, not replace it.
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

  it('lets a host restyle either button through slotProps', () => {
    render(
      <EditFooter
        dirty
        onSave={vi.fn()}
        onCancel={vi.fn()}
        slotProps={{ save: { color: 'secondary' }, cancel: { size: 'large' } }}
      />
    );

    expect(save().className).toMatch(/MuiButton-containedSecondary/);
    expect(cancel().className).toMatch(/MuiButton-outlinedSizeLarge/);
  });

  it('keeps the controlled props, whatever slotProps ask for', () => {
    const onSave = vi.fn();
    render(
      <EditFooter
        dirty={false}
        onSave={onSave}
        onCancel={vi.fn()}
        slotProps={{ save: { disabled: false } }}
      />
    );

    // Inert-while-clean is the component's contract, not a default to override.
    expect(save().disabled).toBe(true);
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
