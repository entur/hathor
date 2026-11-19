// @vitest-environment jsdom
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormNumberField } from './FormFields.tsx';
import { FormFieldContext } from './form-layout/formFieldContext.ts';

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
        <FormFieldContext.Provider value={{ resetKey: reset }}>
          <FormNumberField id="len" label="Length" value={12} onChange={() => {}} />
          <button onClick={() => setReset(r => r + 1)}>cancel</button>
        </FormFieldContext.Provider>
      );
    }
    render(<Host />);
    type('12a');
    fireEvent.click(screen.getByText('cancel'));
    expect((screen.getByLabelText('Length') as HTMLInputElement).value).toBe('12');
    expect(screen.queryByText('Enter a number')).toBeNull();
  });

  it('shows a null from Sobek (an unset capacity count) as blank, and a reset drops bad text', () => {
    function Host() {
      const [resetKey, setResetKey] = useState(0);
      return (
        <FormFieldContext.Provider value={{ resetKey }}>
          <FormNumberField id="len" label="Length" value={null} onChange={() => {}} />
          <button onClick={() => setResetKey(r => r + 1)}>cancel</button>
        </FormFieldContext.Provider>
      );
    }
    render(<Host />);
    const input = screen.getByLabelText('Length') as HTMLInputElement;
    expect(input.value).toBe('');
    expect(screen.queryByText('Enter a number')).toBeNull();
    type('abc');
    fireEvent.click(screen.getByText('cancel'));
    expect(input.value).toBe('');
    expect(screen.queryByText('Enter a number')).toBeNull();
  });

  it('reports text that is not a number to the editor, and again once it is fixed', () => {
    const onInvalid = vi.fn();
    render(
      <FormFieldContext.Provider value={{ resetKey: 0, onInvalid }}>
        <FormNumberField id="len" label="Length" value={12} onChange={() => {}} />
      </FormFieldContext.Provider>
    );
    type('2 5');
    type('25');
    expect(onInvalid.mock.calls).toEqual([
      ['len', true],
      ['len', false],
    ]);
  });

  it('reads an exponent, as String() writes a very small number', () => {
    render(<FormNumberField id="len" label="Length" value={1e-7} onChange={() => {}} />);
    expect((screen.getByLabelText('Length') as HTMLInputElement).value).toBe('1e-7');
    expect(screen.queryByText('Enter a number')).toBeNull();
  });
});
