// @vitest-environment jsdom
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormNumberField } from './FormFields.tsx';
import { FormResetContext } from './form-layout/formResetContext.ts';

const type = (text: string) =>
  fireEvent.change(screen.getByLabelText('Length'), { target: { value: text } });

describe('FormNumberField', () => {
  it('reports numbers, a comma decimal, and blank as undefined', () => {
    const onChange = vi.fn();
    render(<FormNumberField id="len" label="Length" value={12} onChange={onChange} />);
    type('2,55');
    type('-3');
    type('');
    expect(onChange.mock.calls).toEqual([[2.55], [-3], [undefined]]);
    expect(screen.queryByText('Enter a number')).toBeNull();
  });

  it('keeps text that is not a number, flags it, and does not report it', () => {
    const onChange = vi.fn();
    render(<FormNumberField id="len" label="Length" value={12} onChange={onChange} />);
    type('12a');
    expect(onChange).not.toHaveBeenCalled();
    expect((screen.getByLabelText('Length') as HTMLInputElement).value).toBe('12a');
    expect(screen.getByLabelText('Length').getAttribute('aria-invalid')).toBe('true');
    expect(screen.getByText('Enter a number')).toBeTruthy();
  });

  it('shows a value set from outside (load, cancel) over a bad entry', () => {
    function Host() {
      const [v, setV] = useState<number | undefined>(12);
      return (
        <>
          <FormNumberField id="len" label="Length" value={v} onChange={setV} />
          <button onClick={() => setV(7)}>reset</button>
        </>
      );
    }
    render(<Host />);
    type('12a');
    fireEvent.click(screen.getByText('reset'));
    expect((screen.getByLabelText('Length') as HTMLInputElement).value).toBe('7');
    expect(screen.queryByText('Enter a number')).toBeNull();
  });

  it('flags a number too long to be finite, rather than reporting Infinity', () => {
    const onChange = vi.fn();
    render(<FormNumberField id="len" label="Length" value={12} onChange={onChange} />);
    type('9'.repeat(400));
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByText('Enter a number')).toBeTruthy();
  });

  it('drops a bad entry on a reset that puts back the same number (Cancel)', () => {
    function Host() {
      const [reset, setReset] = useState(0);
      return (
        <FormResetContext.Provider value={reset}>
          <FormNumberField id="len" label="Length" value={12} onChange={() => {}} />
          <button onClick={() => setReset(r => r + 1)}>cancel</button>
        </FormResetContext.Provider>
      );
    }
    render(<Host />);
    type('12a');
    fireEvent.click(screen.getByText('cancel'));
    expect((screen.getByLabelText('Length') as HTMLInputElement).value).toBe('12');
    expect(screen.queryByText('Enter a number')).toBeNull();
  });
});
