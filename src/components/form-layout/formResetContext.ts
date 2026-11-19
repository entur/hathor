import { createContext } from 'react';

/** Bumped when the editor puts its baseline back in the fields (Cancel, a read of the record):
 *  a field holding text of its own (`FormNumberField`'s not-a-number entry) drops it then,
 *  even when the number it shows has not changed (#395). */
export const FormResetContext = createContext(0);
