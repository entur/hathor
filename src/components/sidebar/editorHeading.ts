import { createContext } from 'react';

/** Element of an editor's title: `h6` in the sidebar, `h1` where the editor is the whole page. */
export const EditorHeadingContext = createContext<'h1' | 'h6'>('h6');
