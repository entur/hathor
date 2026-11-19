import { createContext } from 'react';

/** What the editor shares with fields that hold text of their own (`FormNumberField`'s
 *  not-a-number entry, #395). */
export interface FormFieldLink {
  /** Bumped when the editor puts its baseline back (Cancel, a read of the record): such a
   *  field drops its text then, even when the number it shows has not changed. */
  resetKey: number;
  /** A field reports text it cannot pass on: Save waits, leaving asks. */
  onInvalid?: (id: string, invalid: boolean) => void;
}

export const FormFieldContext = createContext<FormFieldLink>({ resetKey: 0 });
