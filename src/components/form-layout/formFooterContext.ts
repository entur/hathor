import { createContext, type ReactNode } from 'react';

/** The host's footer (a form page's `EditFooter`) that `FormSections` draws last in its form
 *  column, where it sticks to the bottom of whatever scrolls the form (#293). */
export const FormFooterContext = createContext<ReactNode>(null);
