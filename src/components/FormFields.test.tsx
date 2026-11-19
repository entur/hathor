// @vitest-environment jsdom
import { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { FormNumberField } from './FormFields.tsx';

const input = () => screen.getByLabelText('Length') as HTMLInputElement;
const type = (text: string) => fireEvent.change(input(), { target: { value: text } });

// `vitest.setup.ts` pins the language to English: `.` is the decimal mark, `,` groups thousands.
describe('FormNumberField', () => {
  it('reports numbers, a thousands mark, and blank as undefined', () => {
    const onChange = vi.fn();
    render(<FormNumberField id="len" label="Length" value={12} onChange={onChange} />);
    type('2.55');
    type('-3');
    type('18,000');
    type('');
    expect(onChange.mock.calls).toEqual([[2.55], [-3], [18000], [undefined]]);
  });

  it('refuses letters: the field keeps its number and reports nothing (#395)', () => {
    const onChange = vi.fn();
    render(<FormNumberField id="len" label="Length" value={12} onChange={onChange} />);
    type('12a');
    expect(onChange).not.toHaveBeenCalled();
    expect(input().value).toBe('12');
  });

  // Base UI holds typed text while the field has focus; clicking Cancel takes it away first.
  it('shows a value set from outside once the field is left (load, cancel)', () => {
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
    type('125');
    fireEvent.blur(input());
    fireEvent.click(screen.getByText('reset'));
    expect(input().value).toBe('7');
  });

  it('shows a null from Sobek (an unset capacity count) as blank', () => {
    render(<FormNumberField id="len" label="Length" value={null} onChange={() => {}} />);
    expect(input().value).toBe('');
  });
});
