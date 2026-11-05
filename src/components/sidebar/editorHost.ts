import { createContext, useContext } from 'react';

/** Where an entity editor runs: the sidebar (an `h6` title, the `EditorRail`), or a form
 *  page of its own (an `h1` title, text buttons and a sticky Save / Cancel footer, #280). */
export const EditorHostContext = createContext<'sidebar' | 'page'>('sidebar');

/** The editor runs on a form page of its own. */
export const useEditorOnPage = (): boolean => useContext(EditorHostContext) === 'page';
